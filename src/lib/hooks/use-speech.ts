import { useState, useCallback } from 'react'

export function useSpeech() {
  const [speakingText, setSpeakingText] = useState<string | null>(null)

  const speak = useCallback((text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return

    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel()
      setSpeakingText(null)
      return
    }

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'en-US'
    utterance.rate = 0.9
    utterance.onstart = () => setSpeakingText(text)
    utterance.onend = () => setSpeakingText(null)
    utterance.onerror = () => setSpeakingText(null)
    window.speechSynthesis.speak(utterance)
  }, [])

  return { speak, speakingText }
}
