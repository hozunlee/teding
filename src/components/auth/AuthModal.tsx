'use client'

import { useAuthModal } from '@/lib/store/auth-modal'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton'

export function AuthModal() {
  const { isOpen, message, close } = useAuthModal()

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && close()}>
      <DialogContent className='max-w-[400px] border-none bg-white p-0 overflow-hidden rounded-lg shadow-[rgba(1,1,32,0.1)_0px_4px_20px]'>
        {/* Pastel Gradient Header */}
        <div className='relative h-32 w-full overflow-hidden flex items-center justify-center'>
          <div className='absolute inset-0 pointer-events-none'>
            <div className='absolute top-[-50%] left-[-20%] w-[150%] h-[200%] bg-linear-to-br from-[#ef2cc1]/20 via-[#bdbbff]/20 to-[#fc4c02]/20 blur-3xl opacity-60' />
          </div>
          <div className='relative z-10 flex flex-col items-center gap-1'>
            <span className='text-[10px] font-medium tracking-[0.1em] text-muted-foreground uppercase opacity-80'>ted:ing account</span>
            <div className='text-3xl filter drop-shadow-sm'>🌱</div>
          </div>
        </div>

        <div className='px-8 pb-10 pt-6 flex flex-col items-center gap-6'>
          <DialogHeader className='items-center space-y-3'>
            <DialogTitle className='text-[1.5rem] font-bold tracking-[-0.03em] leading-tight text-center' style={{ color: '#010120' }}>
              함께 지적 루틴을<br />키워볼까요?
            </DialogTitle>
            <DialogDescription className='text-[14px] leading-relaxed text-muted-foreground text-center max-w-[280px] tracking-[-0.01em]'>
              {message}
            </DialogDescription>
          </DialogHeader>

          <div className='w-full pt-2'>
            <GoogleSignInButton />
          </div>

          <div className='flex items-center gap-2'>
            <div className='h-[1px] w-8 bg-border/60' />
            <span className='text-[10px] text-muted-foreground uppercase tracking-[0.05em]'>secure login with supabase</span>
            <div className='h-[1px] w-8 bg-border/60' />
          </div>
        </div>

        {/* Sharp bottom border accent */}
        <div className='h-1 w-full bg-linear-to-r from-[#ef2cc1] via-[#bdbbff] to-[#fc4c02] opacity-80' />
      </DialogContent>
    </Dialog>
  )
}
