import { TopNav } from '@/components/layout/TopNav'

export default function GuideLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopNav />
      <main className='flex-1 min-w-0'>
        {children}
      </main>
    </>
  )
}
