import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'TED-fi — TED-Ed × AI 영어 학습',
  description: 'TED-Ed 영상 한 편으로 읽기·듣기·쓰기를 한 번에. 매일 조금씩, 영어 귀가 트이는 경험.',
  openGraph: {
    title: 'TED-fi — TED-Ed × AI 영어 학습',
    description: 'TED-Ed 영상 한 편으로 읽기·듣기·쓰기를 한 번에.',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: 'TED-fi',
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className='min-h-full flex flex-col bg-background text-foreground'>
        {children}
      </body>
    </html>
  )
}
