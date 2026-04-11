interface SupadataResponse {
  content: string
  lang: string
  availableLangs: string[]
}

export async function getTranscript(videoId: string): Promise<{
  text: string
  wordCount: number
  sentenceCount: number
}> {
  const res = await fetch(
    `https://api.supadata.ai/v1/youtube/transcript?videoId=${videoId}&text=true&lang=en`,
    {
      headers: { 'x-api-key': process.env.SUPADATA_API_KEY! },
    }
  )

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Supadata error ${res.status}: ${body}`)
  }

  const data: SupadataResponse = await res.json()
  const text = data.content

  const wordCount = text.split(/\s+/).filter(Boolean).length
  const sentenceCount = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length

  return { text, wordCount, sentenceCount }
}
