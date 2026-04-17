// 이 파일은 supabase gen types typescript 로 자동생성됩니다.
// 스키마 변경 시 아래 명령어 실행:
// pnpm supabase gen types typescript --project-id <id> > src/types/database.ts
// 현재는 PRD.md 스키마 기준 수동 정의 (추후 자동생성으로 교체)

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      daily_videos: {
        Row: {
          id: string
          date: string
          video_id: string
          title: string
          duration: string
          created_at: string
        }
        Insert: {
          id?: string
          date: string
          video_id: string
          title: string
          duration: string
          created_at?: string
        }
        Update: {
          id?: string
          date?: string
          video_id?: string
          title?: string
          duration?: string
          created_at?: string
        }
        Relationships: []
      }
      transcripts: {
        Row: {
          id: string
          video_id: string
          raw_text: string
          word_count: number
          sentence_count: number
          created_at: string
        }
        Insert: {
          id?: string
          video_id: string
          raw_text: string
          word_count: number
          sentence_count: number
          created_at?: string
        }
        Update: {
          id?: string
          video_id?: string
          raw_text?: string
          word_count?: number
          sentence_count?: number
          created_at?: string
        }
        Relationships: []
      }
      learning_materials: {
        Row: {
          id: string
          video_id: string
          worksheet_json: Json
          phrases_json: Json
          sentences_json: Json
          raw_json: Json
          created_at: string
        }
        Insert: {
          id?: string
          video_id: string
          worksheet_json: Json
          phrases_json: Json
          sentences_json: Json
          raw_json: Json
          created_at?: string
        }
        Update: {
          id?: string
          video_id?: string
          worksheet_json?: Json
          phrases_json?: Json
          sentences_json?: Json
          raw_json?: Json
          created_at?: string
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          id: string
          user_id: string
          video_id: string
          date: string
          step1_completed_at: string | null
          step2_completed_at: string | null
          step3_completed_at: string | null
          step4_completed_at: string | null
          completed_at: string | null
          known_sentences: Json
          quiz_results: Json
          daily_comment: string | null
          difficulty_rating: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          video_id: string
          date: string
          step1_completed_at?: string | null
          step2_completed_at?: string | null
          step3_completed_at?: string | null
          step4_completed_at?: string | null
          completed_at?: string | null
          known_sentences?: Json
          quiz_results?: Json
          daily_comment?: string | null
          difficulty_rating?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          video_id?: string
          date?: string
          step1_completed_at?: string | null
          step2_completed_at?: string | null
          step3_completed_at?: string | null
          step4_completed_at?: string | null
          completed_at?: string | null
          known_sentences?: Json
          quiz_results?: Json
          daily_comment?: string | null
          difficulty_rating?: number | null
          created_at?: string
        }
        Relationships: []
      }
      user_uploads: {
        Row: {
          id: string
          user_id: string
          video_id: string
          file_url: string
          file_name: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          video_id: string
          file_url: string
          file_name: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          video_id?: string
          file_url?: string
          file_name?: string
          created_at?: string
        }
        Relationships: []
      }
      streaks: {
        Row: {
          id: string
          user_id: string
          current_streak: number
          longest_streak: number
          last_study_date: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          current_streak?: number
          longest_streak?: number
          last_study_date?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          current_streak?: number
          longest_streak?: number
          last_study_date?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          id: string
          nickname: string
          avatar_url: string | null
          role: string
          created_at: string
        }
        Insert: {
          id: string
          nickname: string
          avatar_url?: string | null
          role?: string
          created_at?: string
        }
        Update: {
          id?: string
          nickname?: string
          avatar_url?: string | null
          role?: string
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
