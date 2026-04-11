'use client'

import { Button } from '@/components/ui/button'

export function PDFDownloadButton() {
  return (
    <Button variant='outline' onClick={() => window.print()} className='pdf-bar'>
      PDF 다운로드 ↓
    </Button>
  )
}
