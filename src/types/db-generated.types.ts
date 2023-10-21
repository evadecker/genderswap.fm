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
      covers: {
        Row: {
          cover: number
          created_at: string
          id: number
          original: number
          review: string | null
          slug: string
          tags: Database["public"]["Enums"]["tag"][] | null
        }
        Insert: {
          cover: number
          created_at?: string
          id?: number
          original: number
          review?: string | null
          slug?: string
          tags?: Database["public"]["Enums"]["tag"][] | null
        }
        Update: {
          cover?: number
          created_at?: string
          id?: number
          original?: number
          review?: string | null
          slug?: string
          tags?: Database["public"]["Enums"]["tag"][] | null
        }
        Relationships: []
      }
      songs: {
        Row: {
          album_img: string | null
          album_name: string | null
          album_year: number | null
          artists: string[]
          created_at: string
          id: string
          name: string
          url: string
        }
        Insert: {
          album_img?: string | null
          album_name?: string | null
          album_year?: number | null
          artists: string[]
          created_at?: string
          id: string
          name: string
          url: string
        }
        Update: {
          album_img?: string | null
          album_name?: string | null
          album_year?: number | null
          artists?: string[]
          created_at?: string
          id?: string
          name?: string
          url?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      tag:
        | "pronoun change"
        | "tempo change"
        | "key change"
        | "overshadowed original"
        | "extremely different vibe"
        | "meter change"
        | "mtf"
        | "ftm"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
