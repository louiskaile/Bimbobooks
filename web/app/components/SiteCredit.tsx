"use client"

import { useEffect, useRef } from 'react'

const CREDIT = `Site developed by studiosmall.com\ninfo@studiosmall.com`

export default function SiteCredit() {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const parent = el.parentNode
    if (!parent || !parent.contains(el)) return
    const comment = document.createComment(CREDIT)
    parent.insertBefore(comment, el)

    if (process.env.NODE_ENV === 'production') {
      // eslint-disable-next-line no-console
      console.log('%c💾 Site developed by studiosmall.com', 'color: #000; background: #4CFF3C; font-size: 11px; font-weight: bold; padding: 4px 6px;')
      // eslint-disable-next-line no-console
      console.log(CREDIT)
    }
  }, [])

  return <div ref={ref} aria-hidden={true}></div>
}
