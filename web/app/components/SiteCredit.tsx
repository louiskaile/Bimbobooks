'use client'

import { useEffect, useRef } from 'react'

const CREDIT = `
  Site developed by
   ____  _             _ _      ____                  _ _
  / ___|| |_ _   _  __| (_) ___/ ___| _ __ ___   __ _| | |
  \\___ \\| __| | | |/ _\` | |/ _ \\___ \\| '_ \` _ \\ / _\` | | |
   ___) | |_| |_| | (_| | | (_) |__) | | | | | | (_| | | |
  |____/ \\__|\\__,_|\\__,_|_|\\___/____/|_| |_| |_|\\__,_|_|_|

  https://studiosmall.com
  
  info@studiosmall.com
`

export default function SiteCredit() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const parent = el.parentNode
    if (!parent || !parent.contains(el)) return
    const comment = document.createComment(CREDIT)
    parent.insertBefore(comment, el)

    if (process.env.NODE_ENV === 'production') {
      console.log(
        '%c💾 Site developed by studiosmall.com',
        'color: #000; background: #4CFF3C; font-size: 11px; font-weight: bold; padding: 5px 30px; border-radius: 6px;',
      )
    }
  }, [])

  return <span ref={ref} style={{ display: 'none' }} aria-hidden="true" />
}
