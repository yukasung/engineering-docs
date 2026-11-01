// Nextra 4.6.1 removes children before validating Layout props, but its schema
// still requires the key. Zod 4.4+ correctly rejects that missing key.
// Keep current Zod security patches and apply the narrow upstream fix instead.
// https://github.com/shuding/nextra/issues/5036
import { readFile, writeFile } from 'node:fs/promises'

const themeRoot = new URL('../node_modules/nextra-theme-docs/', import.meta.url)
const { version } = JSON.parse(await readFile(new URL('package.json', themeRoot), 'utf8'))
if (version !== '4.6.1') {
  throw new Error('Review/remove the Nextra compatibility patch before changing nextra-theme-docs 4.6.1.')
}

const schemaPath = new URL('dist/schemas.js', themeRoot)
const original = '  children: reactNode,'
const patched = '  children: reactNode.optional(),'
const source = await readFile(schemaPath, 'utf8')
if (source.includes(patched)) {
  console.log('Nextra Layout compatibility patch already applied.')
} else {
  if (source.split(original).length !== 2) {
    throw new Error('Unexpected Nextra schema: refusing to apply compatibility patch.')
  }
  await writeFile(schemaPath, source.replace(original, patched))
  console.log('Applied Nextra 4.6.1 Layout compatibility patch for Zod 4.4+.')
}
