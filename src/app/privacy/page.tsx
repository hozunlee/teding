export default function PrivacyPage() {
  return (
    <main className='max-w-2xl mx-auto px-4 py-12 space-y-8'>
      <h1 className='text-2xl font-bold'>개인정보 처리방침</h1>

      <section className='space-y-2'>
        <h2 className='text-lg font-semibold'>1. 수집하는 개인정보</h2>
        <ul className='list-disc list-inside space-y-1 text-sm text-muted-foreground'>
          <li>이메일 주소 (회원가입 및 로그인)</li>
          <li>학습 진행도 (단계별 완료 여부, 퀴즈 결과)</li>
          <li>업로드 이미지/PDF (필기본 학습지)</li>
          <li>알림 권한 (학습 알람 설정 시)</li>
          <li>기기 저장소 (오프라인 진행도 큐, 세션 토큰)</li>
        </ul>
      </section>

      <section className='space-y-2'>
        <h2 className='text-lg font-semibold'>2. 외부 서비스 전송</h2>
        <ul className='list-disc list-inside space-y-1 text-sm text-muted-foreground'>
          <li>
            <strong>Supabase</strong>: 사용자 계정, 학습 진행도, 업로드 파일 저장
          </li>
          <li>
            <strong>Google Gemini API</strong>: 학습 콘텐츠 생성 (영상 스크립트 전송)
          </li>
        </ul>
      </section>

      <section className='space-y-2'>
        <h2 className='text-lg font-semibold'>3. 기기 내부 전용 데이터</h2>
        <p className='text-sm text-muted-foreground'>
          로컬 알림 스케줄 데이터 및 오프라인 학습 큐는 서버로 전송되지 않으며 기기에만 저장됩니다.
        </p>
      </section>

      <section className='space-y-2'>
        <h2 className='text-lg font-semibold'>4. 데이터 보안</h2>
        <p className='text-sm text-muted-foreground'>
          모든 데이터는 전송 중 HTTPS로 암호화됩니다. Supabase의 보안 인프라를 통해 저장됩니다.
        </p>
      </section>

      <section className='space-y-2'>
        <h2 className='text-lg font-semibold'>5. 데이터 삭제 요청</h2>
        <p className='text-sm text-muted-foreground'>
          계정 및 관련 데이터 삭제를 원하시면 아래 이메일로 연락 주세요. 요청 후 30일 이내 처리됩니다.
        </p>
        <p className='text-sm font-medium'>hohoya102@gmail.com</p>
      </section>

      <section className='space-y-2'>
        <h2 className='text-lg font-semibold'>6. 문의</h2>
        <p className='text-sm text-muted-foreground'>
          개인정보 처리에 관한 문의: <strong>hohoya102@gmail.com</strong>
        </p>
      </section>

      <p className='text-xs text-muted-foreground'>최종 수정일: 2026년 4월 26일</p>
    </main>
  )
}
