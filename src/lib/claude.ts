import Anthropic from '@anthropic-ai/sdk'
import type { LearningMaterials } from '@/types/worksheet'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

function buildPrompt(transcript: string): string {
  return `You are a professional English education expert for Korean adult learners.
Your goal is to create a high-quality English reading worksheet based on the provided TED-Ed script.

[English Proficiency Level: CEFR A2 (Basic, Simple, and Clear English for Beginners)]
[Target Language: ENGLISH (except for Korean support fields specified below)]

⚠️ STRATEGIC INSTRUCTION:
1. First, create a SIMPLIFIED ENGLISH VERSION of the script (Reading Passage, 5-6 paragraphs, A2 level).
2. Then, EXCLUSIVELY from the "Reading Passage" YOU JUST CREATED, select 5 key phrases and 6-8 sentences for analysis.
   - This is CRITICAL: The "pattern" in phrases and the "text" in sentences MUST match the words in your Reading Passage exactly (verbatim).

⚠️ CRITICAL LANGUAGE RULE: 
- EVERY field in "worksheet" (paragraphs, vocabulary, questions, choices, modelAnswer, essayPrompt, modelEssay) MUST be in ENGLISH only.
- ONLY the following fields MUST use the mixed "[English definition] / [Korean meaning]" format:
  - phrases.explanation
  - sentences.tip
  - multipleChoice.explanation
  - shortAnswer.explanation
- The field "vocabulary.koreanMeaning" MUST be in KOREAN only.

SCRIPT:
${transcript}

Return a single JSON object with this exact structure:
{
  "worksheet": {
    "readingPassage": { "paragraphs": [{ "heading": "string (ENGLISH)", "body": "string (ENGLISH - A2 level)" }] },
    "vocabulary": [{ "word": "string (ENGLISH)", "pos": "string (ENGLISH)", "definition": "string (ENGLISH)", "koreanMeaning": "string (KOREAN)", "example": "string (ENGLISH)" }],
    "multipleChoice": [{ "question": "string (ENGLISH)", "choices": ["A) ...", "B) ...", "C) ...", "D) ..."], "answer": "A", "explanation": "string ([English] / [Korean])" }],
    "shortAnswer": [{ "question": "string (ENGLISH)", "modelAnswer": "string (ENGLISH)", "explanation": "string ([English] / [Korean])" }],
    "essayPrompt": "string (ENGLISH)",
    "modelEssay": "string (ENGLISH - An example essay for the prompt)"
  },
  "phrases": [
    { "pattern": "string (MUST BE VERBATIM FROM PASSAGE)", "korean": "string (KOREAN translation)", "explanation": "string ([English] / [Korean])",
      "example": "string (ENGLISH)", "dailyUse": "string (KOREAN)", "tags": ["string (ENGLISH)"] }
  ],
  "sentences": [
    { "text": "string (MUST BE VERBATIM FROM PASSAGE)", "koreanTranslation": "string (KOREAN - natural translation of the full sentence)",
      "structureLabel": "string (ENGLISH)",
      "parse": [{ "role": "string (ENGLISH)", "chunk": "string (ENGLISH)", "cssClass": "subj|verb|obj|mod" }],
      "tip": "string ([English] / [Korean])", "vocab": ["string (ENGLISH)"] }
  ]
}

SPECIFIC RULES:
- vocabulary: Exactly 6 items. Include a clear Korean meaning.
- multipleChoice: Exactly 5 questions based on your generated passage.
- shortAnswer: Exactly 3 questions based on your generated passage.
- Mixed Format: For "explanation" and "tip", always provide a simple English explanation first, then a slash (/), then the Korean translation. 
  Example: "To say you will not do something. / 제안이나 요청을 딱 잘라 거절할 때 씁니다."

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
