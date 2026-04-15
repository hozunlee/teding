import type { Metadata } from 'next'
import { Geist, Geist_Mono, Lexend, Lora } from 'next/font/google'
import './globals.css'
import { AuthModal } from '@/components/auth/AuthModal'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const lexend = Lexend({
  variable: '--font-lexend',
  subsets: ['latin', 'latin-ext'],
})

const lora = Lora({
  variable: '--font-lora',
  subsets: ['latin', 'latin-ext'],
})

export const metadata: Metadata = {
  title: 'tedding — 밀도 높은 영어를 가장 심플하게 펼치다',
  description: 'TED-Ed의 지식을 AI가 심플하게 큐레이션합니다. 매일 하나씩, 내 안의 영어가 자라나는 감각을 경험하세요.',
  openGraph: {
    title: 'tedding — 밀도 높은 영어를 가장 심플하게 펼치다',
    description: 'TED-Ed의 지식을 AI가 심플하게 큐레이션합니다.',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: 'tedding',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang='ko'
      className={`${geistSans.variable} ${geistMono.variable} ${lexend.variable} ${lora.variable} h-full antialiased`}
    >
      <body
        className='min-h-full flex flex-col bg-background text-foreground'
        suppressHydrationWarning
      >
        {children}
        <AuthModal />
      </body>
    </html>
  )
}
