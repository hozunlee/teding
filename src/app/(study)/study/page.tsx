import { createClient, createServiceClient } from '@/lib/supabase/server'
import { StepProgress } from '@/components/steps/StepProgress'
import { Step1Player } from '@/components/steps/Step1Player'
import { Step2Script } from '@/components/steps/Step2Script'
import { Step3Worksheet } from '@/components/steps/Step3Worksheet'
import { Step4Phrases } from '@/components/steps/Step4Phrases'
import { Step5Rewatch } from '@/components/steps/Step5Rewatch'
import { getKSTDate } from '@/lib/utils'
import type { Worksheet, Phrase, SentenceAnalysis } from '@/types/worksheet'
import { redirect } from 'next/navigation'

export default async function StudyPage({
  searchParams,
}: {
  searchParams: Promise<{ step?: string; date?: string }>
}) {
  const { step: stepParam, date: dateParam } = await searchParams

  const supabase = await createClient()
  const adminSupabase = createServiceClient()
  const { data: { user } } = await supabase.auth.getUser()

  const today = getKSTDate()
  const targetDate = dateParam ?? today

  const { data: video } = await adminSupabase
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

  // user progress 조회
  let progress = null
  if (user) {
    const { data } = await supabase
      .from('user_progress')
      .select('step1_completed_at,step2_completed_at,step3_completed_at,step4_completed_at')
      .eq('user_id', user.id)
      .eq('video_id', video.video_id)
      .single()
    progress = data
  }

  const isCompleted = !!progress?.step4_completed_at

  if (!stepParam) {
    let currentStep = 1
    if (progress) {
      if (!progress.step1_completed_at) currentStep = 1
      else if (!progress.step2_completed_at) currentStep = 2
      else if (!progress.step3_completed_at) currentStep = 3
      else if (!progress.step4_completed_at) currentStep = 4
      else {
        currentStep = 4
      }
    }
    
    const targetUrl = new URLSearchParams()
    targetUrl.set('step', currentStep.toString())
    if (dateParam) targetUrl.set('date', dateParam)
    redirect(`/study?${targetUrl.toString()}`)
  }

  const step = Math.max(1, Math.min(5, Number(stepParam) || 1))

  // transcript: step=2 (generation trigger), step=4 (rewatch script section), step=5 (script review)
  let transcript = null
  if (step === 2 || step >= 4) {
    const { data } = await adminSupabase
      .from('transcripts')
      .select('*')
      .eq('video_id', video.video_id)
      .single()
    transcript = data
  }

  // materials: step 2-5
  let materials = null
  if (step >= 2) {
    const { data } = await adminSupabase
      .from('learning_materials')
      .select('*')
      .eq('video_id', video.video_id)
      .single()
    materials = data
  }

  const materialsReady = !!materials

  return (
    <div className='container mx-auto max-w-2xl px-4 py-6'>
      {step <= 4 && (
        <div className='mb-6 flex items-center justify-between'>
          <StepProgress currentStep={step} isCompleted={isCompleted} />
        </div>
      )}

      <div className='mb-3'>
        <p className='line-clamp-1 text-sm text-muted-foreground'>{video.title}</p>
      </div>

      {/* Step 1: 시청 */}
      {step === 1 && <Step1Player videoId={video.video_id} isCompleted={isCompleted} />}

      {/* Step 2: 학습지 (재배치 — 구 Step 3) */}
      {step === 2 && (
        <Step3Worksheet
          videoId={video.video_id}
          worksheet={materials?.worksheet_json as unknown as Worksheet ?? null}
          phrases={materials?.phrases_json as unknown as Phrase[] ?? null}
          sentences={materials?.sentences_json as unknown as SentenceAnalysis[] ?? null}
          transcript={transcript}
          materialsReady={materialsReady}
          isCompleted={isCompleted}
        />
      )}

      {/* Step 3: 핵심표현 (재배치 — 구 Step 4) */}
      {step === 3 && (
        materials ? (
          <Step4Phrases
            videoId={video.video_id}
            phrases={materials.phrases_json as unknown as Phrase[]}
            sentences={materials.sentences_json as unknown as SentenceAnalysis[]}
            isLoggedIn={!!user}
            isCompleted={isCompleted}
          />
        ) : (
          <div className='text-sm text-muted-foreground'>학습자료를 불러오는 중...</div>
        )
      )}

      {/* Step 4: 재시청 + 스크립트 참고 (재배치 — 구 Step 5) */}
      {step === 4 && (
        <Step5Rewatch
          videoId={video.video_id}
          videoTitle={video.title}
          transcript={transcript}
          isCompleted={isCompleted}
        />
      )}

      {/* Step 5: 스크립트 추가학습 (Complete에서 진입, 선택적) */}
      {step === 5 && (
        transcript ? (
          <Step2Script
            videoId={video.video_id}
            transcript={transcript}
            materialsReady={true}
            isReviewMode={true}
          />
        ) : (
          <div className='text-sm text-muted-foreground'>스크립트를 불러오는 중...</div>
        )
      )}
    </div>
  )
}
