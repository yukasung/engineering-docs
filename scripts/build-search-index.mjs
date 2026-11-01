import { opendir } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'

async function containsHtml(directory) {
  try {
    const entries = await opendir(directory)

    for await (const entry of entries) {
      if (entry.isFile() && entry.name.endsWith('.html')) return true
      if (entry.isDirectory() && await containsHtml(`${directory}/${entry.name}`)) return true
    }
  } catch (error) {
    if (error?.code === 'ENOENT') return false
    throw error
  }

  return false
}

const candidates = process.env.VERCEL === '1'
  ? [
      { site: '.vercel/output/static', output: '.vercel/output/static/_pagefind' },
      { site: '.next/server/app', output: 'public/_pagefind' }
    ]
  : [{ site: '.next/server/app', output: 'public/_pagefind' }]

const source = await (async () => {
  for (const candidate of candidates) {
    if (await containsHtml(candidate.site)) return candidate
  }
  return null
})()

if (!source) {
  throw new Error(`Pagefind could not find generated HTML in: ${candidates.map(({ site }) => site).join(', ')}`)
}

console.log(`Building Pagefind index from ${source.site} into ${source.output}`)

const result = spawnSync(
  'pagefind',
  ['--site', source.site, '--output-path', source.output],
  { stdio: 'inherit', shell: process.platform === 'win32' }
)

if (result.error) throw result.error
if (result.status !== 0) process.exit(result.status ?? 1)
