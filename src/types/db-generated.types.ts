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
          cover_id: string | null
          created_at: string
          description: string | null
          id: string
          original_id: string | null
          slug: string
        }
        Insert: {
          cover_id?: string | null
          created_at?: string
          description?: string | null
          id: string
          original_id?: string | null
          slug: string
        }
        Update: {
          cover_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          original_id?: string | null
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "covers_cover_id_fkey"
            columns: ["cover_id"]
            referencedRelation: "songs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "covers_original_id_fkey"
            columns: ["original_id"]
            referencedRelation: "songs"
            referencedColumns: ["id"]
          }
        ]
      }
      songs: {
        Row: {
          acousticness: number | null
          album_img: string[] | null
          album_name: string | null
          album_year: number | null
          artists: string[]
          created_at: string
          danceability: number | null
          duration_ms: number | null
          energy: number | null
          gender: Database["public"]["Enums"]["gender"][]
          id: string
          instrumentalness: number | null
          key: number | null
          liveness: number | null
          loudness: number | null
          mode: number | null
          name: string
          speechiness: number | null
          tempo: number | null
          time_signature: number | null
          url: string
          valence: number | null
        }
        Insert: {
          acousticness?: number | null
          album_img?: string[] | null
          album_name?: string | null
          album_year?: number | null
          artists: string[]
          created_at?: string
          danceability?: number | null
          duration_ms?: number | null
          energy?: number | null
          gender: Database["public"]["Enums"]["gender"][]
          id: string
          instrumentalness?: number | null
          key?: number | null
          liveness?: number | null
          loudness?: number | null
          mode?: number | null
          name: string
          speechiness?: number | null
          tempo?: number | null
          time_signature?: number | null
          url: string
          valence?: number | null
        }
        Update: {
          acousticness?: number | null
          album_img?: string[] | null
          album_name?: string | null
          album_year?: number | null
          artists?: string[]
          created_at?: string
          danceability?: number | null
          duration_ms?: number | null
          energy?: number | null
          gender?: Database["public"]["Enums"]["gender"][]
          id?: string
          instrumentalness?: number | null
          key?: number | null
          liveness?: number | null
          loudness?: number | null
          mode?: number | null
          name?: string
          speechiness?: number | null
          tempo?: number | null
          time_signature?: number | null
          url?: string
          valence?: number | null
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
      gender: "male" | "female" | "other"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
