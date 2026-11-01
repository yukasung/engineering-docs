import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Head, Search } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import { MermaidZoom } from '@/components/mermaid-zoom'
import 'nextra-theme-docs/style.css'
import './globals.css'

export const metadata: Metadata = {
  title: { default: 'Engineering Hub', template: '%s | Engineering Hub' },
  description: 'ฐานความรู้ร่วมของทีม: Engineering Standards, Technical Guides & Project Knowledge Base',
  applicationName: 'Engineering Hub'
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="th" dir="ltr" suppressHydrationWarning>
      <Head color={{ hue: 166, saturation: 70 }} />
      <body>
        <Layout
          navbar={<Navbar logo={<span className="hub-logo"><span className="hub-mark" aria-hidden="true">EH</span>Engineering Hub</span>} />}
          pageMap={await getPageMap()}
          search={<Search placeholder="ค้นหาเอกสาร…" emptyResult="ไม่พบเอกสารที่ตรงกับคำค้น" errorText="ไม่สามารถโหลดการค้นหาได้ กรุณาลองใหม่" loading="กำลังค้นหา…" />}
          footer={<Footer><span>Engineering Hub <span className="hub-footer-detail"> / Shared Engineering Knowledge</span></span></Footer>}
          editLink={null}
          copyPageButton={false}
          feedback={{ content: null }}
          sidebar={{ defaultMenuCollapseLevel: 1 }}
          toc={{ title: 'ในหน้านี้', backToTop: 'กลับด้านบน' }}
          themeSwitch={{ dark: 'มืด', light: 'สว่าง', system: 'ตามระบบ' }}
        >
          {children}
        </Layout>
        <MermaidZoom />
      </body>
    </html>
  )
}
