import ArchiveClient from '@/components/archive/ArchiveClient'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export const metadata = {
  title: '보고또보고 | Teding',
  description: '이전 학습 영상들을 다시 복습해보세요.',
}

export default async function ArchivePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  return <ArchiveClient />
}
