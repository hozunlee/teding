import { SiteHeader } from '@/components/layout/SiteHeader'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex min-h-screen flex-col'>
      <SiteHeader />
      <div className='container mx-auto flex flex-1 px-4 py-6'>
        <main className='flex-1 min-w-0'>
          {children}
        </main>
      </div>
    </div>
  )
}
