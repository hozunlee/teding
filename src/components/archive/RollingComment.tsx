'use client'

import { useEffect, useState } from 'react'

export function RollingComment({ comments }: { comments: string[] }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (comments.length <= 1) return
    const id = setInterval(() => setIndex((i) => (i + 1) % comments.length), 4000)
    return () => clearInterval(id)
  }, [comments.length])

  if (comments.length === 0) return null

  return (
    <p
      key={index}
      className='text-xs text-muted-foreground italic line-clamp-1 animate-in fade-in duration-700'
    >
      💬 {comments[index]}
    </p>
  )
}
