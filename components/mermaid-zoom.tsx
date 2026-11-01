'use client'

import { useEffect, useRef } from 'react'

const diagramSelector = 'main svg[aria-roledescription]'

export function MermaidZoom() {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const activeTriggerRef = useRef<HTMLElement | SVGSVGElement>(null)

  useEffect(() => {
    const prepareDiagrams = () => {
      document.querySelectorAll<SVGSVGElement>(diagramSelector).forEach(svg => {
        svg.classList.add('hub-mermaid-zoomable')
        svg.setAttribute('tabindex', '0')
        svg.setAttribute('role', 'button')
        svg.setAttribute('aria-label', 'ขยายแผนภาพ')
        svg.setAttribute('title', 'คลิกเพื่อขยายแผนภาพ')

        if (svg.dataset.hubMermaidZoomReady === 'true') return

        svg.dataset.hubMermaidZoomReady = 'true'
        svg.addEventListener('keydown', event => {
          if (event.key !== 'Enter' && event.key !== ' ') return

          event.preventDefault()
          event.stopPropagation()
          openDiagram(svg, svg)
        })
      })
    }

    const openDiagram = (svg: SVGSVGElement, trigger: HTMLElement | SVGSVGElement) => {
      const dialog = dialogRef.current
      const content = contentRef.current

      if (!dialog || !content) return

      const clone = svg.cloneNode(true) as SVGSVGElement
      clone.classList.remove('hub-mermaid-zoomable')
      clone.removeAttribute('title')
      clone.setAttribute('aria-hidden', 'true')
      content.replaceChildren(clone)
      activeTriggerRef.current = trigger

      if (!dialog.open) dialog.showModal()
    }

    const findDiagram = (target: EventTarget | null) => {
      if (!(target instanceof Element)) return null
      const svg = target.closest(diagramSelector)
      return svg instanceof SVGSVGElement ? { svg, trigger: svg } : null
    }

    const handleClick = (event: MouseEvent) => {
      const diagram = findDiagram(event.target)
      if (diagram) openDiagram(diagram.svg, diagram.trigger)
    }

    prepareDiagrams()

    const observer = new MutationObserver(prepareDiagrams)
    observer.observe(document.body, { childList: true, subtree: true })
    document.addEventListener('click', handleClick)

    return () => {
      observer.disconnect()
      document.removeEventListener('click', handleClick)
    }
  }, [])

  return (
    <dialog
      aria-labelledby="hub-mermaid-dialog-title"
      className="hub-mermaid-dialog"
      ref={dialogRef}
      onClose={() => activeTriggerRef.current?.focus()}
      onClick={event => {
        if (event.target === event.currentTarget) event.currentTarget.close()
      }}
    >
      <div className="hub-mermaid-dialog-header">
        <strong id="hub-mermaid-dialog-title">แผนภาพแบบขยาย</strong>
        <button type="button" onClick={() => dialogRef.current?.close()}>
          ปิด
        </button>
      </div>
      <div className="hub-mermaid-dialog-content" ref={contentRef} />
    </dialog>
  )
}
