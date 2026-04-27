import { AuthGuard } from '@/components/auth/AuthGuard'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { AdminNativeGuard } from './AdminNativeGuard'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <AdminNativeGuard>
        <div className='flex min-h-screen flex-col'>
          <SiteHeader />
          <main className='flex-1'>{children}</main>
        </div>
      </AdminNativeGuard>
    </AuthGuard>
  )
}
