import Anthropic from '@anthropic-ai/sdk'
import type { LearningMaterials } from '@/types/worksheet'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

function buildPrompt(transcript: string): string {
  return `You are a professional English education expert for Korean adult learners.
Your goal is to create a high-quality English reading worksheet based on the provided TED-Ed script.

[English Proficiency Level: CEFR A2 (Basic, Simple, and Clear English for Beginners)]
[Target Language: ENGLISH (except for Korean fields specified below)]

⚠️ CRITICAL LANGUAGE RULE: 
- EVERY field in "worksheet" (paragraphs, vocabulary, questions, choices, modelAnswer, essayPrompt) MUST be in ENGLISH only.
- DO NOT translate the passage, questions, or choices into Korean.
- ONLY the following fields should be in KOREAN:
  - phrases.korean
  - phrases.explanation
  - phrases.dailyUse
  - sentences.tip

SCRIPT:
${transcript}

Return a single JSON object with this exact structure (respect the language rules for each field):
{
  "worksheet": {
    "readingPassage": {
      "paragraphs": [{ "heading": "string (ENGLISH)", "body": "string (ENGLISH - A2 level)" }]
    },
    "vocabulary": [
      { "word": "string (ENGLISH)", "pos": "string (ENGLISH - e.g. noun, verb)", "definition": "string (ENGLISH)", "example": "string (ENGLISH)" }
    ],
    "multipleChoice": [
      { "question": "string (ENGLISH)", "choices": ["A) ... (ENGLISH)", "B) ... (ENGLISH)", "C) ... (ENGLISH)", "D) ... (ENGLISH)"], "answer": "A" }
    ],
    "shortAnswer": [
      { "question": "string (ENGLISH)", "modelAnswer": "string (ENGLISH sentence)" }
    ],
    "essayPrompt": "string (ENGLISH prompt)"
  },
  "phrases": [
    { "pattern": "string (ENGLISH)", "korean": "string (KOREAN translation)", "explanation": "string (KOREAN)",
      "example": "string (ENGLISH)", "dailyUse": "string (KOREAN - how to use in daily life)", "tags": ["string (ENGLISH)"] }
  ],
  "sentences": [
    { "text": "string (ENGLISH from script)", "structureLabel": "string (ENGLISH - e.g. Relative Clause)",
      "parse": [{ "role": "string (ENGLISH - e.g. Subject, Verb, etc.)", "chunk": "string (ENGLISH)", "cssClass": "subj|verb|obj|mod" }],
      "tip": "string (KOREAN explanation)", "vocab": ["string (ENGLISH)"] }
  ]
}

SPECIFIC RULES:
- readingPassage: Create a SIMPLIFIED ENGLISH VERSION of the script (A2 level, 5-6 paragraphs). Do not just copy the raw script.
- vocabulary: Exactly 6 English items with English definitions.
- multipleChoice: Exactly 5 questions. All questions and choices must be in English. Answer must be "A", "B", "C", or "D".
- shortAnswer: Exactly 3 questions in English.
- sentences: 6-8 key sentences for grammar analysis.
- ALL tips and translations in 'phrases' and 'sentences.tip' must be in natural KOREAN.

Return ONLY the JSON object. Do not include markdown fences or any other text.`
}

export async function generateWithClaude(transcript: string): Promise<LearningMaterials> {
  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 8000,
    messages: [{ role: 'user', content: buildPrompt(transcript) }],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : ''
  return JSON.parse(text.replace(/```json\n?|```/g, '').trim()) as LearningMaterials
}
