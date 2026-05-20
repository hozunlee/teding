import { createServiceClient } from '@/lib/supabase/server'
import { getTranscript } from '@/lib/transcript'
import { generateWithFallback } from '@/lib/gemini'
import type { Json } from '@/types/database'

interface RegisterOptions {
  videoId: string
  title: string
  duration: string
  videoUrl: string
  date: string
  force?: boolean
}

interface RegisterResult {
  transcriptCached: boolean
  materialsCached: boolean
}

export async function registerDailyVideo(opts: RegisterOptions): Promise<RegisterResult> {
  const { videoId, title, duration, videoUrl, date, force = false } = opts
  const supabase = createServiceClient()

  const { error: videoError } = await supabase.from('daily_videos').upsert(
    { date, video_id: videoId, title, duration, video_url: videoUrl },
    { onConflict: 'date', ignoreDuplicates: !force }
  )
  if (videoError) throw new Error(videoError.message)

  let transcriptText: string
  const { data: cachedTranscript } = await supabase
    .from('transcripts')
    .select('raw_text')
    .eq('video_id', videoId)
    .single()

  const transcriptCached = !!(cachedTranscript && !force)
  if (transcriptCached) {
    transcriptText = cachedTranscript.raw_text
  } else {
    const { text, wordCount, sentenceCount } = await getTranscript(videoId)
    transcriptText = text
    await supabase.from('transcripts').upsert(
      { video_id: videoId, raw_text: text, word_count: wordCount, sentence_count: sentenceCount },
      { onConflict: 'video_id', ignoreDuplicates: !force }
    )
  }

  const { data: cachedMaterials } = await supabase
    .from('learning_materials')
    .select('id')
    .eq('video_id', videoId)
    .single()

  const materialsCached = !!(cachedMaterials && !force)
  if (!materialsCached) {
    const materials = await generateWithFallback(transcriptText, title)
    const { error: matError } = await supabase.from('learning_materials').upsert(
      {
        video_id: videoId,
        worksheet_json: materials.worksheet as unknown as Json,
        phrases_json: materials.phrases as unknown as Json,
        sentences_json: materials.sentences as unknown as Json,
        raw_json: materials as unknown as Json,
      },
      { onConflict: 'video_id', ignoreDuplicates: false }
    )
    if (matError) throw new Error(matError.message)
  }

  return { transcriptCached, materialsCached }
}
