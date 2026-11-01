import { readFile, readdir, rm } from 'node:fs/promises'
import { posix } from 'node:path'
import { close, createIndex } from 'pagefind'

const contentRoot = new URL('../content/', import.meta.url)
const outputPath = new URL('../public/_pagefind/', import.meta.url)

async function listMdxFiles(directory, prefix = '') {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = []

  for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name))) {
    const relativePath = posix.join(prefix, entry.name)

    if (entry.isDirectory()) {
      files.push(...await listMdxFiles(new URL(`${entry.name}/`, directory), relativePath))
    } else if (entry.isFile() && entry.name.endsWith('.mdx')) {
      files.push({ relativePath, url: new URL(entry.name, directory) })
    }
  }

  return files
}

function parseDocument(source, relativePath) {
  const frontmatter = source.match(/^---\n([\s\S]*?)\n---\n/)
  if (!frontmatter) throw new Error(`Missing frontmatter: content/${relativePath}`)

  const readString = key => {
    const line = frontmatter[1].match(new RegExp(`^${key}:\\s*(.+)$`, 'm'))
    if (!line) throw new Error(`Missing ${key}: content/${relativePath}`)
    return JSON.parse(line[1])
  }

  const title = readString('title')
  const description = readString('description')
  const body = source.slice(frontmatter[0].length)
    .replace(/<!--([\s\S]*?)-->/g, ' ')
    .replace(/\[([^\]]+)]\([^)]+\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[`*_>#|~{}]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  const route = relativePath
    .replace(/\.mdx$/, '')
    .replace(/(^|\/)index$/, '')

  return {
    url: route ? `/${route}` : '/',
    title,
    description,
    content: `${title}\n${description}\n${body}`
  }
}

const files = await listMdxFiles(contentRoot)
const { index, errors: createErrors } = await createIndex({ forceLanguage: 'th' })

if (!index || createErrors.length > 0) {
  throw new Error(`Could not create Pagefind index: ${createErrors.join('; ')}`)
}

for (const file of files) {
  const source = await readFile(file.url, 'utf8')
  const document = parseDocument(source, file.relativePath)
  const { errors } = await index.addCustomRecord({
    url: document.url,
    content: document.content,
    language: 'th',
    meta: {
      title: document.title,
      description: document.description
    }
  })

  if (errors.length > 0) {
    throw new Error(`Could not index content/${file.relativePath}: ${errors.join('; ')}`)
  }
}

await rm(outputPath, { recursive: true, force: true })
const { errors: writeErrors } = await index.writeFiles({ outputPath: outputPath.pathname })
await close()

if (writeErrors.length > 0) {
  throw new Error(`Could not write Pagefind index: ${writeErrors.join('; ')}`)
}

console.log(`Pagefind indexed ${files.length} MDX pages into public/_pagefind`)
