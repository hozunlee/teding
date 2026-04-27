'use client'

import { useEffect, useState } from 'react'

interface CommentItem {
  text: string
  isMine?: boolean
}

export function RollingComment({ comments }: { comments: CommentItem[] }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (comments.length <= 1) return
    const id = setInterval(() => setIndex((i) => (i + 1) % comments.length), 4000)
    return () => clearInterval(id)
  }, [comments.length])

  if (comments.length === 0) return null

  const current = comments[index]

  return (
    <p
      key={index}
      className="text-xs italic line-clamp-1 animate-in fade-in duration-700 text-muted-foreground"
    >
      {current.isMine ? '👤' : '💬'} {current.text}
    </p>
  )
}
