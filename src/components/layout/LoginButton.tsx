'use client'

import { useAuthModal } from '@/lib/store/auth-modal'
import { Button } from '@/components/ui/button'

export function LoginButton() {
  const { open } = useAuthModal()

  return (
    <Button
      onClick={() => open()}
      variant="ghost"
      className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
    >
      로그인
    </Button>
  )
}
