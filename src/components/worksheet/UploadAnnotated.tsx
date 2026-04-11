'use client'

import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'

interface Props {
  videoId: string
}

export function UploadAnnotated({ videoId }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [uploaded, setUploaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError(null)

    const form = new FormData()
    form.append('file', file)
    form.append('videoId', videoId)

    const res = await fetch('/api/upload', { method: 'POST', body: form })
    setUploading(false)

    if (!res.ok) {
      const data = await res.json() as { error?: string }
      setError(data.error ?? '업로드 실패')
    } else {
      setUploaded(true)
    }
  }

  return (
    <div className='upload-section flex flex-col gap-2'>
      <input
        ref={inputRef}
        type='file'
        accept='application/pdf'
        className='hidden'
        onChange={handleFile}
      />
      <Button
        variant='outline'
        onClick={() => inputRef.current?.click()}
        disabled={uploading || uploaded}
      >
        {uploading ? '업로드 중...' : uploaded ? '✓ 필기본 업로드 완료' : '필기본 PDF 업로드'}
      </Button>
      {error && <p className='text-xs text-destructive'>{error}</p>}
    </div>
  )
}
