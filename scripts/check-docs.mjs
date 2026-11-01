import { readdir, readFile, access } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { documentationRedirects } from '../lib/documentation-redirects.mjs'

const contentRoot = path.resolve('content')
const pages = new Map()
const navigationLinks = []
const errors = []
const documentTypes = new Set(['Landing', 'Standard', 'Guide', 'Project', 'Architecture', 'ADR', 'Template', 'Runbook', 'Note'])
const statuses = new Set(['Draft', 'Reviewed', 'Approved', 'Deprecated'])
const requiredFields = ['title', 'description', 'documentType', 'owner', 'status', 'lastReviewed', 'applicableVersions']
const forbiddenAudience = /\b(?:interview|portfolio|technical\s+lead)\b|สัมภาษณ์/iu

function isRecord(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function withoutFencedCode(source) {
  let fence = null
  return source.split('\n').filter(line => {
    const match = line.match(/^\s*(`{3,}|~{3,})/)
    if (!fence && match) {
      fence = match[1]
      return false
    }
    if (fence) {
      if (match && match[1][0] === fence[0] && match[1].length >= fence.length) fence = null
      return false
    }
    return true
  }).join('\n')
}

function inspectFrontmatter(source, filename) {
  const match = source.match(/^---\n([\s\S]*?)\n---\n/)
  const metadata = {}
  if (!match) {
    errors.push(`${filename}: missing frontmatter`)
    return { metadata, body: source }
  }
  for (const line of match[1].split('\n')) {
    if (!line.trim() || line.trimStart().startsWith('#')) continue
    const field = line.match(/^([a-zA-Z][a-zA-Z0-9]*):\s+(.+)$/)
    if (!field) {
      errors.push(`${filename}: use one JSON-compatible value per frontmatter line: ${line}`)
      continue
    }
    if (Object.hasOwn(metadata, field[1])) errors.push(`${filename}: duplicate field ${field[1]}`)
    try {
      metadata[field[1]] = JSON.parse(field[2])
    } catch {
      errors.push(`${filename}: invalid ${field[1]} value (use JSON strings, null, or objects)`)
    }
  }
  for (const key of requiredFields) {
    if (!Object.hasOwn(metadata, key)) errors.push(`${filename}: missing metadata ${key}`)
  }
  for (const key of ['title', 'description']) {
    if (typeof metadata[key] !== 'string' || !metadata[key].trim()) errors.push(`${filename}: ${key} must be nonempty text`)
  }
  if (!documentTypes.has(metadata.documentType)) errors.push(`${filename}: invalid documentType`)
  if (!statuses.has(metadata.status)) errors.push(`${filename}: invalid status`)
  if (metadata.owner !== null && (typeof metadata.owner !== 'string' || !metadata.owner.trim())) errors.push(`${filename}: owner must be assigned text or null`)
  if (metadata.lastReviewed !== null) {
    const date = metadata.lastReviewed
    const parsed = typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date) ? new Date(`${date}T00:00:00Z`) : new Date(NaN)
    if (!Number.isFinite(parsed.valueOf()) || parsed.toISOString().slice(0, 10) !== date) errors.push(`${filename}: lastReviewed must be a valid YYYY-MM-DD date or null`)
  }
  if (['Reviewed', 'Approved'].includes(metadata.status) && (!metadata.owner || !metadata.lastReviewed)) {
    errors.push(`${filename}: Reviewed/Approved requires an assigned owner and review date`)
  }
  if (!isRecord(metadata.applicableVersions) || Object.values(metadata.applicableVersions).some(value => typeof value !== 'string' || !value.trim())) {
    errors.push(`${filename}: applicableVersions must map technologies to nonempty version/scope text`)
  }
  return { metadata, body: source.slice(match[0].length) }
}

async function inspectDirectory(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const navigable = entries.filter(entry => entry.isDirectory() || entry.name.endsWith('.mdx'))
  const metaPath = path.join(directory, '_meta.js')
  let meta = {}
  try {
    meta = (await import(pathToFileURL(metaPath).href)).default
    if (!isRecord(meta)) throw new Error('Metadata must be an object')
  } catch {
    errors.push(`${metaPath}: missing or invalid navigation metadata`)
    meta = {}
  }
  const expectedKeys = navigable.map(entry => entry.name.replace(/\.mdx$/, ''))
  for (const key of expectedKeys) if (!(key in meta)) errors.push(`${metaPath}: missing key ${key}`)
  for (const key of Object.keys(meta)) {
    if (isRecord(meta[key]) && typeof meta[key].href === 'string') {
      navigationLinks.push({ filename: metaPath, href: meta[key].href })
    } else if (key !== '*' && !expectedKeys.includes(key)) {
      errors.push(`${metaPath}: stale key ${key}`)
    }
  }
  if (!expectedKeys.includes('index')) errors.push(`${directory}: missing index.mdx landing page`)

  for (const entry of navigable) {
    const filename = path.join(directory, entry.name)
    if (entry.isDirectory()) {
      await inspectDirectory(filename)
      continue
    }
    const source = (await readFile(filename, 'utf8')).replaceAll('\r\n', '\n')
    if (forbiddenAudience.test(source)) errors.push(`${filename}: audience-specific material remains in main documentation`)
    const { metadata, body } = inspectFrontmatter(source, filename)
    const prose = withoutFencedCode(body)
    const route = '/' + path.relative(contentRoot, filename).split(path.sep).join('/')
      .replace(/(^|\/)index\.mdx$/, '').replace(/\.mdx$/, '')
    if (pages.has(route)) errors.push(`${filename}: duplicate canonical route ${route}`)
    pages.set(route, { filename, prose, metadata })
    const sections = prose.split('\n').filter(line => line.startsWith('## '))
    const hasSection = (heading, thaiHeading) => sections.some(
      line => line.includes(`(${heading})`)
        || line.trim() === `## ${heading}`
        || line.trim() === `## ${thaiHeading}`
    )
    if (!hasSection('Overview', 'เรื่องนี้คืออะไร?')) {
      errors.push(`${filename}: missing Overview / เรื่องนี้คืออะไร? section`)
    }
    const landingHasNavigationLinks = metadata.documentType === 'Landing'
      && /(?:\]\(|href=["'])\//.test(prose)
    if (!hasSection('Related Documentation', 'อ่านต่อ') && !landingHasNavigationLinks) {
      errors.push(`${filename}: missing Related Documentation / อ่านต่อ section`)
    }
  }
}

await inspectDirectory(contentRoot)
let linkCount = 0
for (const { filename, prose } of pages.values()) {
  const links = [...prose.matchAll(/\]\(([^\s)]+)(?:\s+"[^"]*")?\)|\bhref=["']([^"']+)["']/g)]
  for (const match of links) {
    const href = match[1] || match[2]
    if (!href.startsWith('/') && !href.startsWith('#') && !/^[a-zA-Z][a-zA-Z\d+.-]*:/.test(href)) {
      errors.push(`${filename}: use a root-relative canonical link: ${href}`)
      continue
    }
    const url = new URL(href, 'https://engineering-hub.invalid')
    if (url.origin !== 'https://engineering-hub.invalid') continue
    // A same-page anchor is checked against rendered IDs in runtime mode.
    if (href.startsWith('#')) continue
    linkCount++
    const target = decodeURIComponent(url.pathname).replace(/\/$/, '') || '/'
    if (pages.has(target)) continue
    try {
      await access(path.join('public', target))
    } catch {
      errors.push(`${filename}: broken or noncanonical internal link ${href}`)
    }
  }
}

const redirectSources = new Set()
for (const { filename, href } of navigationLinks) {
  const target = new URL(href, 'https://engineering-hub.invalid')
  if (!href.startsWith('/') || !pages.has(target.pathname)) errors.push(`${filename}: navigation link must point to a canonical page: ${href}`)
}
for (const redirect of documentationRedirects) {
  if (redirectSources.has(redirect.source) || pages.has(redirect.source)) errors.push(`Duplicate/shadowing redirect: ${redirect.source}`)
  redirectSources.add(redirect.source)
  const target = new URL(redirect.destination, 'https://engineering-hub.invalid')
  if (!pages.has(target.pathname)) errors.push(`Redirect destination missing: ${redirect.destination}`)
}

const urlIndex = process.argv.indexOf('--url')
if (urlIndex !== -1) {
  const origin = new URL(process.argv[urlIndex + 1]).origin
  const renderedPages = new Map()
  for (const route of pages.keys()) {
    const response = await fetch(`${origin}${route}`, { signal: AbortSignal.timeout(15000) })
    if (response.status !== 200) errors.push(`${route}: HTTP ${response.status}`)
    const html = await response.text()
    if (html.includes('aria-label="ข้อมูลเอกสาร"')) errors.push(`${route}: document metadata panel must not be rendered`)
    renderedPages.set(route, html)
  }
  let renderedLinks = 0
  function checkTarget(url, source) {
    const target = decodeURIComponent(url.pathname).replace(/\/$/, '') || '/'
    const destination = renderedPages.get(target)
    if (!destination) errors.push(`${source}: rendered link points to missing page ${url.pathname}`)
    else if (url.hash && !destination.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`)) errors.push(`${source}: missing rendered anchor ${url.hash}`)
  }
  for (const [route, html] of renderedPages) {
    for (const match of html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)) {
      const url = new URL(match[1].replaceAll('&amp;', '&'), `${origin}${route}`)
      if (url.origin !== origin) continue
      renderedLinks++
      checkTarget(url, route)
    }
  }
  for (const redirect of documentationRedirects) {
    const response = await fetch(`${origin}${redirect.source}`, { redirect: 'manual', signal: AbortSignal.timeout(15000) })
    const location = response.headers.get('location')
    const expected = new URL(redirect.destination, origin)
    if (response.status !== 308 || !location || new URL(location, origin).href !== expected.href) {
      errors.push(`${redirect.source}: expected 308 to ${redirect.destination}, got ${response.status} ${location}`)
    }
    checkTarget(expected, redirect.source)
  }
  const missing = await fetch(`${origin}/this-page-does-not-exist`, { signal: AbortSignal.timeout(15000) })
  if (missing.status !== 404) errors.push(`Unknown route should return 404, received ${missing.status}`)
  console.log(`Runtime: ${renderedPages.size} routes with metadata, ${renderedLinks} rendered links/anchors, ${documentationRedirects.length} redirects, unknown-route 404 checked.`)
}

if (errors.length) {
  console.error(errors.join('\n'))
  process.exitCode = 1
} else {
  console.log(`Documentation OK: ${pages.size} MDX pages, metadata convention, navigation, appropriate headings, ${linkCount} canonical content links, ${documentationRedirects.length} legacy redirects; audience scan clean.`)
}
