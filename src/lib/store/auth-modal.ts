import { create } from 'zustand'

interface AuthModalState {
  isOpen: boolean
  message: string
  open: (message?: string) => void
  close: () => void
}

const DEFAULT_MESSAGE =
  '오늘의 지식이 완벽히 흡수되었네요. 이 작은 새싹이 사라지지 않도록, 단 3초 만에 로그인하고 당신만의 지적 루틴을 길러보세요.'

export const useAuthModal = create<AuthModalState>((set) => ({
  isOpen: false,
  message: DEFAULT_MESSAGE,
  open: (message = DEFAULT_MESSAGE) => set({ isOpen: true, message }),
  close: () => set({ isOpen: false }),
}))
