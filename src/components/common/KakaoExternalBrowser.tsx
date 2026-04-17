'use client'

import { ReactNode, useEffect } from 'react'

export function KakaoExternalBrowser({ children }: { children: ReactNode }) {
  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase()
    if (!/kakaotalk/i.test(userAgent)) return

    const currentUrl = window.location.href
    window.location.href = `kakaotalk://web/openExternal?url=${encodeURIComponent(currentUrl)}`

    setTimeout(() => {
      window.location.href = /iphone|ipad|ipod/i.test(userAgent)
        ? 'kakaoweb://closeBrowser'
        : 'kakaotalk://inappbrowser/close'
    })
  }, [])

  return <>{children}</>
}
