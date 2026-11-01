import nextra from 'nextra'
import { documentationRedirects } from './lib/documentation-redirects.mjs'

const withNextra = nextra({
  defaultShowCopyCode: true
})

export default withNextra({
  reactStrictMode: true,
  poweredByHeader: false,
  redirects: () => documentationRedirects
})
