import { getAuthedClient } from '@/lib/supabase/api-auth'
import { createServiceClient } from '@/lib/supabase/server'
import { generateWithFallback } from '@/lib/gemini'
import type { Json } from '@/types/database'

export const maxDuration = 60
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const { user } = await getAuthedClient(req)
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { videoId, transcript } = await req.json() as { videoId: string; transcript: string }

  const serviceClient = createServiceClient()

  const { data: existing } = await serviceClient
    .from('learning_materials')
    .select('id')
    .eq('video_id', videoId)
    .single()

  if (existing) return Response.json({ cached: true })

  // 1. 비디오 정보 조회
  const { data: video, error: videoError } = await serviceClient
    .from('daily_videos')
    .select('title')
    .eq('video_id', videoId)
    .single()

  if (videoError || !video) {
    console.error('[generate] Failed to fetch video title:', videoError?.message)
    return Response.json({ error: 'Video not found or failed to fetch title' }, { status: 404 })
  }

  const title = video.title

  let materials
  try {
    materials = await generateWithFallback(transcript, title)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[generate] generateWithFallback failed:', msg)
    return Response.json({ error: msg }, { status: 500 })
  }
  const { error } = await serviceClient.from('learning_materials').upsert(
    {
      video_id: videoId,
      worksheet_json: materials.worksheet as unknown as Json,
      phrases_json: materials.phrases as unknown as Json,
      sentences_json: materials.sentences as unknown as Json,
      raw_json: materials as unknown as Json,
    },
    { onConflict: 'video_id', ignoreDuplicates: true }
  )
  if (error) {
    console.error('[generate] upsert failed:', error.message)
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json({ cached: false, generated: true })
}
