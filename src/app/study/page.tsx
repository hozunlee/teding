import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { StepProgress } from '@/components/steps/StepProgress'
import { Step1Player } from '@/components/steps/Step1Player'
import { Step2Script } from '@/components/steps/Step2Script'
import { Step3Worksheet } from '@/components/steps/Step3Worksheet'
import { Step4Phrases } from '@/components/steps/Step4Phrases'
import { Step5Rewatch } from '@/components/steps/Step5Rewatch'
import { MaterialsLoading } from '@/components/steps/MaterialsLoading'
import type { Worksheet, Phrase, SentenceAnalysis } from '@/types/worksheet'

export default async function StudyPage({
  searchParams,
}: {
  searchParams: Promise<{ step?: string; date?: string }>
}) {
  const { step: stepParam, date: dateParam } = await searchParams
  const step = Math.max(1, Math.min(5, Number(stepParam) || 1))

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const today = new Date().toISOString().split('T')[0]
  const targetDate = dateParam ?? today

  const { data: video } = await supabase
    .from('daily_videos')
    .select('*')
    .eq('date', targetDate)
    .single()

  if (!video) {
    return (
      <div className='container mx-auto max-w-2xl px-4 py-6'>
        <p className='text-muted-foreground text-sm'>
          {targetDate === today ? '오늘의 영상이 등록되지 않았습니다.' : '해당 날짜의 영상이 없습니다.'}
        </p>
      </div>
    )
  }

  // Step 2+ needs transcript
  let transcript = null
  if (step >= 2) {
    const { data } = await supabase
      .from('transcripts')
      .select('*')
      .eq('video_id', video.video_id)
      .single()
    transcript = data
  }

  // Step 3~4 needs materials (Step 5는 재시청이므로 불필요)
  let materials = null
  if (step >= 3 && step <= 4) {
    const { data } = await supabase
      .from('learning_materials')
      .select('*')
      .eq('video_id', video.video_id)
      .single()
    materials = data
  }

  // Step 2: also check materials exist (for background generate trigger)
  let materialsReady = false
  if (step === 2) {
    const { data } = await supabase
      .from('learning_materials')
      .select('id')
      .eq('video_id', video.video_id)
      .single()
    materialsReady = !!data
  }

  return (
    <div className='container mx-auto max-w-2xl px-4 py-6'>
      <div className='mb-6 flex items-center justify-between'>
        <StepProgress currentStep={step} />
      </div>

      <div className='mb-3'>
        <p className='line-clamp-1 text-sm text-muted-foreground'>{video.title}</p>
      </div>

      {step === 1 && <Step1Player videoId={video.video_id} />}

      {step === 2 && (
        transcript ? (
          <Step2Script
            videoId={video.video_id}
            transcript={transcript}
            materialsReady={materialsReady}
          />
        ) : (
          <div className='text-sm text-muted-foreground'>스크립트를 불러오는 중...</div>
        )
      )}

      {step === 3 && (
        materials ? (
          <Step3Worksheet
            videoId={video.video_id}
            worksheet={materials.worksheet_json as unknown as Worksheet}
            phrases={materials.phrases_json as unknown as Phrase[]}
            sentences={materials.sentences_json as unknown as SentenceAnalysis[]}
          />
        ) : (
          <MaterialsLoading />
        )
      )}

      {step === 4 && (
        materials ? (
          <Step4Phrases
            videoId={video.video_id}
            phrases={materials.phrases_json as unknown as Phrase[]}
            sentences={materials.sentences_json as unknown as SentenceAnalysis[]}
          />
        ) : (
          <div className='text-sm text-muted-foreground'>학습자료를 불러오는 중...</div>
        )
      )}

      {/* Step 5: 재시청 — Step 1과 동일한 플레이어, 목적만 다름 */}
      {step === 5 && <Step5Rewatch videoId={video.video_id} />}
    </div>
  )
}
