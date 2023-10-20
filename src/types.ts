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
          tags: Database["public"]["Enums"]["tag"][] | null
        }
        Insert: {
          cover: number
          created_at?: string
          id?: number
          original: number
          review?: string | null
          tags?: Database["public"]["Enums"]["tag"][] | null
        }
        Update: {
          cover?: number
          created_at?: string
          id?: number
          original?: number
          review?: string | null
          tags?: Database["public"]["Enums"]["tag"][] | null
        }
        Relationships: [
          {
            foreignKeyName: "covers_cover_fkey"
            columns: ["cover"]
            referencedRelation: "songs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "covers_original_fkey"
            columns: ["original"]
            referencedRelation: "songs"
            referencedColumns: ["id"]
          }
        ]
      }
      songs: {
        Row: {
          album_img: string | null
          album_name: string | null
          album_year: number | null
          artists: string[]
          created_at: string
          id: number
          name: string
          url: string
        }
        Insert: {
          album_img?: string | null
          album_name?: string | null
          album_year?: number | null
          artists: string[]
          created_at?: string
          id?: number
          name: string
          url: string
        }
        Update: {
          album_img?: string | null
          album_name?: string | null
          album_year?: number | null
          artists?: string[]
          created_at?: string
          id?: number
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
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
