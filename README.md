# Engineering Hub

ฐานความรู้และเอกสาร Engineering ร่วมสำหรับ Developers, System Analysts, QA Engineers, DevOps Engineers, Architects และสมาชิกใหม่ ใช้ภาษาไทยกับศัพท์เทคนิค English เพื่อสร้าง Shared standards, Reusable guides และ Source of truth ของแต่ละโครงการ

งานปัจจุบันเป็นเว็บไซต์เอกสารและ Foundational guidance เท่านั้น ตัวอย่าง Task Management เป็น Proposed design ยังไม่มี Backend, Sample React application, Database, Docker Compose, Kubernetes cluster, Deployment pipeline, Authentication หรือ CMS

## Technology stack

| เครื่องมือ | เวอร์ชันที่ตรึงไว้ |
| --- | --- |
| Next.js / App Router | 16.4.3 |
| Nextra / Nextra Docs Theme | 4.6.1 / 4.6.1 |
| React / React DOM | 19.3.1 / 19.3.1 |
| TypeScript (strict) | 6.0.3 |
| ESLint / eslint-config-next | 9.39.5 / 16.4.3 |
| Pagefind | 1.5.2 |

ใช้ Webpack กับ Nextra loader ตาม Configuration เดิม ไม่มี Framework หรือ Dependency ใหม่สำหรับการจัดโครงสร้างเอกสารนี้ Sidebar, Breadcrumbs, TOC, Themes, Code highlighting/copy และ Mermaid ใช้ Nextra

Nextra 4.6.1 มี [Layout/Zod compatibility issue](https://github.com/shuding/nextra/issues/5036) จึงคง `postinstall` ที่เรียก `scripts/patch-nextra.mjs` ไว้ Patch ตรวจ Version/Source ก่อนแก้และใช้ซ้ำได้ ต้องทบทวนเมื่ออัปเดต Nextra ห้ามข้าม Install scripts โดยไม่ตรวจผลต่อ Runtime

## Prerequisites / Installation

- Node.js 22+, npm 10+ และ Git
- ไม่ต้องตั้ง Environment variables หรือ Secrets เพื่อเปิด Engineering Hub

```bash
npm install
```

ติดตั้งซ้ำตาม Lockfile ด้วย `npm ci` เมื่อเปลี่ยน Dependencies ให้ปรับ `package.json` และ Lockfile ให้ตรงกัน

## Local development

```bash
npm run dev
```

เปิด URL ที่ Terminal แสดง (ปกติ http://localhost:3000) MDX รองรับ Hot reload แต่ Search ใช้ Index จาก Build ล่าสุด ครั้งแรกหรือหลังเปลี่ยนเนื้อหา ให้หยุด Dev server แล้วรัน:

```bash
npm run build
npm run dev
```

ห้ามรัน Build กับ Dev พร้อมกันบน `.next/` เดียวกัน `prebuild` สร้าง Pagefind Index จาก MDX ไปที่ `public/_pagefind` โดยอัตโนมัติ เพื่อให้ Local และ Vercel ใช้ Index ชุดเดียวกัน และ Generated files ไม่เก็บใน Git

## Production build / Validation

```bash
npm run lint
npm run typecheck
npm run check:docs
npm run build
npm start
```

ขณะ Production server ทำงาน:

```bash
npm run check:docs -- --url http://localhost:3000
```

Validator ตรวจ Frontmatter, Document statuses, Required sections ตาม Convention, Metadata/file synchronization, Duplicate routes, Canonical links และ Legacy redirect destinations โดย Runtime mode เพิ่ม HTTP routes, ตรวจว่าไม่แสดง Metadata panel, Rendered anchors, 308 redirects และ 404

Source checker รองรับ Inline Markdown links และ Literal MDX `href` นอก Code fences; Reference-style/Dynamic links ต้องเพิ่มการตรวจเมื่อใช้ External URLs ไม่ถูกตรวจอัตโนมัติ และ Mermaid ต้องตรวจ Rendering ใน Browser เพราะ Build ยืนยัน MDX compilation แต่ไม่พิสูจน์ Diagram syntax ทุกกรณี

## Information architecture / Project structure

```text
app/
  layout.tsx                          # Shared Nextra theme และ Site metadata
  [[...mdxPath]]/page.tsx              # MDX gateway
content/
  index.mdx                           # Overview: Engineering Hub คืออะไร
  _meta.js                            # Main navigation 5 หมวด
  development-workflow/               # Git/PR, Code Review, SDD และ Environments
  technology-guides/                  # Frameworks and tools (versions explicit)
    devops/                           # CI/CD examples, Deploy and Operations
  standards-compliance/               # ISO, Thai laws, Governance, Risk, Audit และ Frameworks
  projects/
    *.mdx                              # Company project overview pages
lib/documentation-redirects.mjs        # Canonical destinations ของ URL เดิม
scripts/check-docs.mjs                 # Metadata / Navigation / Links / Runtime checks
scripts/patch-nextra.mjs               # Install-time compatibility fix
mdx-components.tsx
next.config.mjs
AGENTS.md
```

แต่ละ Directory ใน `content/` มี `index.mdx` และ `_meta.js` หมวดที่เนื้อหายังสั้นใช้ Sections/Anchors ใน Landing page แทนหลายหน้าเปล่า แยกหน้าเมื่อมีข้อมูลหรือการดูแลแยกจริง

เมนูหลักเรียงเป็น Overview, Projects, Development Workflow, Technology Guides และ Standards & Compliance โดย Overview คือหน้าแรกที่อธิบายว่า Engineering Hub คืออะไรและทีมใช้งานอย่างไร

Development Workflow เก็บขั้นตอนทำงานร่วมกัน Technology Guides อธิบายเครื่องมือ และ Standards & Compliance เก็บแนวทาง Security/Privacy, ISO, กฎหมายไทย, Governance, Risk, Audit และ Frameworks ส่วน Project docs เก็บ Decisions, Requirement mapping และ Configuration เฉพาะระบบ ใช้ Cross-links แทนคัดลอกข้อความเป็นอีกแหล่ง

## Document metadata convention

ทุก MDX page ใช้ Nextra YAML frontmatter โดยค่าของแต่ละ Field เป็น JSON-compatible value บนบรรทัดเดียว:

```yaml
title: "API Design"
description: "ข้อตกลง Request/Response สำหรับทีม"
documentType: "Standard"
owner: null
status: "Draft"
lastReviewed: null
applicableVersions: {}
```

- `documentType`: Landing, Standard, Guide, Project, Architecture, ADR, Template, Runbook, Note
- `status`: Draft / Reviewed / Approved / Deprecated เท่านั้น
- `owner`: คน/ทีมที่ยอมรับหน้าที่จริง หรือ `null` ถ้ายังไม่กำหนด
- `lastReviewed`: วันที่ Technical/content review จริงแบบ YYYY-MM-DD หรือ `null` ไม่ใช้ Build time หรือ Git timestamp
- `applicableVersions`: Map เทคโนโลยี → Version/scope; `{}` สำหรับ Version-neutral guidance และข้อความ Unknown เมื่อยังไม่กำหนด Runtime
- Reviewed/Approved ต้องมี Owner และ Review date ที่เกิดขึ้นจริง Checks ไม่เลื่อนสถานะอัตโนมัติ การเปลี่ยนสาระต้อง Review ใหม่

ทุกหน้าที่จัดโครงสร้างในงานนี้เริ่ม Draft พร้อม Owner/Last Reviewed ว่าง ไม่อ้าง Approval ที่ไม่มี Metadata ยังเก็บใน Source และตัวตรวจเอกสารแต่ไม่แสดงเป็น Panel บนหน้า ส่วน Built-in Git timestamp ถูกซ่อนเพื่อแยกจาก Content review

ข้อกำหนด JSON-compatible values เป็น Convention ของ Repository นี้ ไม่ใช่ข้อจำกัดทั่วไปของ YAML/Nextra รายละเอียดกฎที่ใช้อยู่เก็บใน `AGENTS.md`

## Adding a documentation page

1. อ่าน `AGENTS.md` และค้นหัวข้อเดิมก่อนเลือกหมวด
2. เพิ่ม MDX ชื่อ kebab-case พร้อม Metadata และ Overview/Related Documentation
3. เลือก Sections ให้เหมาะกับ Purpose เช่น Prerequisites, Steps, Examples, Common Issues หรือ Checklist ไม่ต้องใส่หัวข้อที่ไม่มีประโยชน์
4. เพิ่ม Key ตรงชื่อไฟล์ใน `_meta.js` ของ Parent
5. ใช้ Canonical root-relative links เช่น `/technology-guides/docker` และรัน Checks/Browser verification ตามผลกระทบ

## Adding a project

โปรเจกต์ที่มีข้อมูลสั้นให้สร้าง `content/projects/<project-slug>.mdx` และเพิ่ม Key ใน `content/projects/_meta.js` หากเนื้อหาต้องแยกดูแลหลายหน้า จึงใช้ `content/projects/<project-slug>/index.mdx` พร้อม `_meta.js` ภายใน ระบุ Unknown/Not implemented เมื่อยังไม่มีข้อมูล และไม่สร้าง Infrastructure หรือ Approval ให้ดูครบ

## Navigation / Moving content

Nextra Sidebar ใช้ `_meta.js` ตามลำดับ Keys และเก็บ Global theme defaults ใน `'*'` ทุก Directory ต้องมี Landing page URL ไม่ใส่ `.mdx` หรือ `/index`

เมื่อย้ายหน้า แก้ Links ให้ไป Canonical URL และเพิ่ม Exact redirect ใน `lib/documentation-redirects.mjs` ห้ามมี Redirect chain หรือสองหน้าที่ URL เดียวกัน Next.js ใช้ 308 เพื่อรักษา URL เดิม โดยไม่ต้องเก็บ Duplicate page ใน Search index

ก่อนย้ายหรือลบไฟล์ ให้สรุปต้นทางกับปลายทาง เก็บสำเนาเปรียบเทียบ และตรวจว่าคำแนะนำ ตัวอย่าง Checklist และเนื้อหาสำคัญยังอยู่ครบ แล้วค่อยนำต้นฉบับออก

URL เก่าที่มีเนื้อหาปลายทางอยู่ ใช้ Exact 308 redirect ไปปลายทางจริงโดยตรง เมื่อถอดหน้าออกให้ลบเมนู ลิงก์ และ Redirect ที่ชี้หน้านั้นด้วย ไม่สร้างสำเนาให้ Search เจอสองชุด

## Development conventions / Maintenance

- เอกสารมาก่อนการเปลี่ยน Contracts และอัปเดตตาม Behavior ที่เปลี่ยน
- เขียนภาษาไทยกับ Technical terms English; แยก Draft guidance, Proposed design และ Verified implementation
- ไม่สร้าง Owner, Review date, Test result หรือ Production claims สมมติ
- ไม่ใส่ Secrets/ข้อมูลผู้ใช้จริงใน MDX, Examples หรือ Logs
- รักษา TypeScript strict, Scope ที่ชัด และ Dependencies เท่าที่จำเป็น
- Review Metadata/Navigation/Links พร้อม Content; หัวข้อที่ Deprecated ต้องบอก Replacement/เหตุผล
- Search เป็น Snapshot ณ Build ล่าสุดและ Pagefind ไม่ทำ Thai stemming จึงควรตรวจคำค้นจริงหลังเพิ่มเนื้อหา
- Repository ที่ยังไม่ Commit อาจมี Nextra Git last-modified warnings ใน Build; ไม่ใช้ Timestamp fallback เป็น Review evidence

## บันทึกการตรวจครั้งก่อน — Team Knowledge Base Refactor

ผลด้านล่างเป็นบันทึกการตรวจโครงสร้างเดิมใน Local environment วันที่ 1 พฤศจิกายน 2026 ไม่ใช่จำนวนหน้า/หมวดของโครงสร้างปัจจุบัน:

| Check | Result |
| --- | --- |
| `npm run lint` | ผ่าน ไม่มี Warnings |
| `npm run typecheck` | ผ่าน |
| `npm run check:docs` | ผ่าน 38 MDX pages, Metadata, Navigation, 180 Canonical content links และ Audience scan |
| `npm run build` | ผ่าน รวม Pagefind index ครบ 38 หน้า |
| Runtime `check:docs -- --url` | ผ่าน 38 Routes พร้อม Metadata panel, 3,839 Rendered links/anchors, 23 Redirects และ Unknown-route 404 |
| Validator negative cases | ปฏิเสธ Missing metadata, Unsupported approval, Invalid review date, Broken link และ Audience wording ใน Isolated fixtures |
| Template reuse | Copy blocks ทั้ง 7 Compile เป็น MDX ได้; Project copy ผ่าน Metadata/Navigation/Links ใน Isolated fixture |
| Browser | หน้าแรกโครงสร้างเดิม 7 หมวด, Nested navigation, English/Thai search, Search result navigation และ SRS copy-code ผ่าน |
| Metadata / Themes / Responsive | Draft/Unassigned/No review แสดงถูกต้อง; Light/Dark ใช้งานได้; Desktop/Tablet/Mobile ไม่พบ Page overflow และ Mobile menu เปิด Contribution guide ได้ |
| Migrated diagrams | Mermaid ทั้ง 6 Render สำเร็จที่ Canonical project URLs; Browser console ไม่พบ Error/Warning ในรอบตรวจนี้ |

Build ยังมี Git last-modified warnings สำหรับไฟล์ที่ไม่มี Commit history การตรวจนี้ยืนยันเว็บไซต์เอกสารและ Template syntax เท่านั้น ไม่ได้ยืนยัน Backend/Infrastructure หรือยกระดับ Document status เป็น Reviewed/Approved

## บันทึกการตรวจครั้งก่อน — Simplified Navigation

ผลด้านล่างเป็นบันทึกการตรวจเมนู 4 หมวดก่อนถอดหน้าเอกสารเพิ่มเติมใน Local environment วันที่ 1 พฤศจิกายน 2026 ไม่ใช่จำนวนหน้าปัจจุบัน:

| Check | Result |
| --- | --- |
| Content migration | เอกสารเดิม 136 หน้ามีปลายทางครบ เหลือ 132 หน้าเพราะรวมหน้าอ้างอิง; ตรวจเทียบคำแนะนำ ตัวอย่าง และ Checklist ของ Standards ก่อนลบต้นฉบับ |
| Content preservation | 125 หน้าเหมือนเดิมทั้งไฟล์หลังปรับ Canonical links/ชื่ออ้างอิง; หน้าแรก/หน้ารวมและ Contribution ปรับตามโครงสร้างใหม่ |
| Lint / TypeScript / Production build | ผ่าน รวม Pagefind index 132 หน้า |
| Static documentation check | ผ่าน Metadata, Navigation และ 777 Canonical content links |
| Runtime documentation check | ผ่าน 132 Routes, 38,669 Rendered links/anchors, 67 Exact 308 redirects และ Unknown-route 404 |
| Browser navigation / Search | การ์ดหน้าแรกครบ 4 หมวด; Search เปิด Code Review ที่ URL ใหม่; Standards Security ไปหัวข้อกลาง; Mobile menu เปิด SRS Template ได้ |
| Mermaid | 5 ภาพที่ย้าย Render บน Desktop; Workflow บน Mobile 390px อยู่กลาง ไม่ล้นจอ และเว้นระยะ 24px บน/ล่าง |

Build มี Git last-modified warnings สำหรับไฟล์ที่ยังไม่มี Commit history ไม่ได้เปลี่ยน Last Reviewed หรือสถานะ Draft การตรวจครั้งนี้ยืนยันเว็บไซต์เอกสาร ไม่ได้เปิด Pipeline หรือ Deploy Infrastructure

## Recommended next documentation topics

1. Review Architecture/API/Security/Testing drafts กับทีมจริง และตกลง Owner/Review workflow
2. เติม SRS และ Canonical OpenAPI ของโครงการที่มี Requirements จริง
3. เติม Environment matrix และ Operations runbook เมื่อมีระบบให้ตรวจ พร้อม Deployment/Restore evidence ที่รันจริง
4. เก็บ Troubleshooting notes จากเหตุการณ์ที่ยืนยันได้ และทบทวน Cross-links เพื่อลดสำเนาซ้ำ

## Official references

- [Nextra Docs Theme](https://nextra.site/docs/docs-theme/start)
- [Nextra navigation metadata](https://nextra.site/docs/file-conventions/meta-file)
- [Nextra search / Pagefind](https://nextra.site/docs/guide/search)
- [Nextra Mermaid](https://nextra.site/docs/advanced/mermaid)
