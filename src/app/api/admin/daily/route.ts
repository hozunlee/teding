import { createClient, createServiceClient } from '@/lib/supabase/server'
import { getTranscript } from '@/lib/transcript'
import { generateWithFallback } from '@/lib/gemini'
import type { Json } from '@/types/database'

export const maxDuration = 60

const ADMIN_EMAIL = process.env.ADMIN_EMAIL

async function isAdmin(req: Request): Promise<boolean> {
  // 방법 1: 로그인된 세션의 이메일 확인
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user?.email && user.email === ADMIN_EMAIL) return true

  // 방법 2: ADMIN_SECRET Bearer 토큰 (cURL 등 비브라우저 호출용)
  const authHeader = req.headers.get('Authorization')
  if (authHeader && process.env.ADMIN_SECRET && authHeader === `Bearer ${process.env.ADMIN_SECRET}`) {
    return true
  }

  return false
}

export async function POST(req: Request) {
  if (!(await isAdmin(req))) {
    return Response.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const { videoId, title, duration, force = false } = await req.json() as {
      videoId: string
      title: string
      duration: string
      force?: boolean
    }

    const supabase = createServiceClient()
    const today = new Date().toISOString().split('T')[0]

    // 1. daily_videos 등록 (중복 방지)
    const { error: videoError } = await supabase.from('daily_videos').upsert(
      { date: today, video_id: videoId, title, duration },
      { onConflict: 'date', ignoreDuplicates: !force }
    )
    if (videoError) return Response.json({ error: videoError.message }, { status: 500 })

    // 2. transcript 캐시 확인 → 없으면 추출
    let transcriptText: string
    const { data: cachedTranscript } = await supabase
      .from('transcripts')
      .select('raw_text')
      .eq('video_id', videoId)
      .single()

    if (cachedTranscript && !force) {
      transcriptText = cachedTranscript.raw_text
    } else {
      const { text, wordCount, sentenceCount } = await getTranscript(videoId)
      transcriptText = text
      await supabase.from('transcripts').upsert(
        { video_id: videoId, raw_text: text, word_count: wordCount, sentence_count: sentenceCount },
        { onConflict: 'video_id', ignoreDuplicates: !force }
      )
    }

    // 3. learning_materials 캐시 확인 → 없으면 생성 (force일 때는 무시하고 생성)
    const { data: cachedMaterials } = await supabase
      .from('learning_materials')
      .select('id')
      .eq('video_id', videoId)
      .single()

    if (!cachedMaterials || force) {
      const materials = await generateWithFallback(transcriptText)
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
      if (matError) return Response.json({ error: matError.message }, { status: 500 })
    }

    return Response.json({
      ok: true,
      date: today,
      videoId,
      transcriptCached: !!cachedTranscript,
      materialsCached: !!cachedMaterials,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[admin/daily]', message)
    return Response.json({ error: message }, { status: 500 })
  }
}
