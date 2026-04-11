import { GoogleGenerativeAI } from "@google/generative-ai";
import type { LearningMaterials } from "@/types/worksheet";
import { generateWithClaude } from "./claude";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateLearningMaterials(
    transcript: string,
): Promise<LearningMaterials> {
    const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash-lite",
        generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.4,
        },
    });

    const prompt = `You are a professional English education expert for Korean adult learners.
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
    { "text": "string (MUST BE VERBATIM FROM PASSAGE)", "structureLabel": "string (ENGLISH)",
      "parse": [{ "role": "string (ENGLISH)", "chunk": "string (ENGLISH)", "cssClass": "subj|verb|obj|mod" }],
      "tip": "string ([English] / [Korean])", "vocab": ["string (ENGLISH)"] }
  ]
}

SPECIFIC RULES:
- vocabulary: Exactly 6 items. Include a clear Korean meaning.
- multipleChoice: Exactly 5 questions based on your generated passage.
- shortAnswer: Exactly 3 questions based on your generated passage.
- Mixed Format: For "explanation" and "tip", always provide a simple English explanation first, then a slash (/), then the Korean translation. 
  Example: "To say you will not do something. / 제안이나 요청을 딱 잘라 거절할 때 씁니다."`;

    const result = await model.generateContent(prompt);
    const rawText = result.response.text();
    console.log(
        "[Gemini] raw response length:",
        rawText.length,
        "| first 200:",
        rawText.slice(0, 200),
    );
    const text = rawText.replace(/```json\n?|```/g, "").trim();
    try {
        return JSON.parse(text) as LearningMaterials;
    } catch (e) {
        console.error("[Gemini JSON Parse Error]", e);
        console.error("[Gemini Raw Text]", text.slice(0, 500));
        throw new Error("Gemini 응답을 파싱할 수 없습니다.");
    }
}

export async function generateWithFallback(
    transcript: string,
): Promise<LearningMaterials> {
    try {
        return await generateLearningMaterials(transcript);
    } catch (err) {
        console.warn("Gemini failed, falling back to Claude:", err);
        if (!process.env.ANTHROPIC_API_KEY) {
            throw new Error(
                `Gemini 생성 실패 및 Claude API 키(폴백)가 설정되지 않았습니다. 원본 에러: ${err instanceof Error ? err.message : String(err)}`,
            );
        }
        return await generateWithClaude(transcript);
    }
}
