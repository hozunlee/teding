import { createClient } from '@/lib/supabase/server'
import { getTranscript } from '@/lib/transcript'

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { videoId } = await req.json() as { videoId: string }

  const { data: existing } = await supabase
    .from('transcripts')
    .select('*')
    .eq('video_id', videoId)
    .single()

  if (existing) return Response.json({ cached: true, transcript: existing })

  const { text, wordCount, sentenceCount } = await getTranscript(videoId)

  const { error } = await supabase.from('transcripts').upsert(
    { video_id: videoId, raw_text: text, word_count: wordCount, sentence_count: sentenceCount },
    { onConflict: 'video_id', ignoreDuplicates: true }
  )
  if (error) return Response.json({ error: error.message }, { status: 500 })

  const { data: saved } = await supabase
    .from('transcripts')
    .select('*')
    .eq('video_id', videoId)
    .single()

  return Response.json({ cached: false, transcript: saved })
}
