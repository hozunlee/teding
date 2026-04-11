export interface WorksheetParagraph {
  heading: string
  body: string
}

export interface VocabItem {
  word: string
  pos: string
  definition: string
  koreanMeaning: string
  example: string
}

export interface MCQuestion {
  question: string
  choices: string[]
  answer: 'A' | 'B' | 'C' | 'D'
  explanation: string
}

export interface SAQuestion {
  question: string
  modelAnswer: string
  explanation: string
}

export interface Worksheet {
  readingPassage: { paragraphs: WorksheetParagraph[] }
  vocabulary: VocabItem[]
  multipleChoice: MCQuestion[]
  shortAnswer: SAQuestion[]
  essayPrompt: string
  modelEssay: string
}

export interface Phrase {
  pattern: string
  korean: string
  explanation: string
  example: string
  dailyUse: string
  tags: string[]
}

export interface ParseChunk {
  role: string
  chunk: string
  cssClass: 'subj' | 'verb' | 'obj' | 'mod'
}

export interface SentenceAnalysis {
  text: string
  structureLabel: string
  parse: ParseChunk[]
  tip: string
  vocab: string[]
}

export interface LearningMaterials {
  worksheet: Worksheet
  phrases: Phrase[]
  sentences: SentenceAnalysis[]
}
