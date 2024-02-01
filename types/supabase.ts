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
      notifications: {
        Row: {
          created_at: string
          id: number
          is_read: boolean
          message: string
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          is_read?: boolean
          message: string
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: number
          is_read?: boolean
          message?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          blockout_dates: string[] | null
          enlistment_date: string | null
          id: string
          max_blockouts: number
          name: string
          no_of_extras: number | null
          onboarded: boolean
          ord_date: string | null
          role: Database["public"]["Enums"]["role"]
          unit_id: string
          updated_at: string | null
          weekday_points: number
          weekend_points: number
        }
        Insert: {
          avatar_url?: string | null
          blockout_dates?: string[] | null
          enlistment_date?: string | null
          id: string
          max_blockouts?: number
          name: string
          no_of_extras?: number | null
          onboarded?: boolean
          ord_date?: string | null
          role?: Database["public"]["Enums"]["role"]
          unit_id: string
          updated_at?: string | null
          weekday_points?: number
          weekend_points?: number
        }
        Update: {
          avatar_url?: string | null
          blockout_dates?: string[] | null
          enlistment_date?: string | null
          id?: string
          max_blockouts?: number
          name?: string
          no_of_extras?: number | null
          onboarded?: boolean
          ord_date?: string | null
          role?: Database["public"]["Enums"]["role"]
          unit_id?: string
          updated_at?: string | null
          weekday_points?: number
          weekend_points?: number
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          }
        ]
      }
      push_subscriptions: {
        Row: {
          created_at: string
          id: number
          push_subscription_details: Json
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          push_subscription_details: Json
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: number
          push_subscription_details?: Json
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "push_subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      roster: {
        Row: {
          created_at: string
          duty_date: string
          duty_personnel: string | null
          id: number
          is_extra: boolean
          reserve_duty_personnel: string | null
          unit_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          duty_date: string
          duty_personnel?: string | null
          id?: number
          is_extra?: boolean
          reserve_duty_personnel?: string | null
          unit_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          duty_date?: string
          duty_personnel?: string | null
          id?: number
          is_extra?: boolean
          reserve_duty_personnel?: string | null
          unit_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "roster_duty_personnel_fkey"
            columns: ["duty_personnel"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "roster_reserve_duty_personnel_fkey"
            columns: ["reserve_duty_personnel"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "roster_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          }
        ]
      }
      swap_requests: {
        Row: {
          created_at: string
          id: number
          reason: string | null
          receiver_id: string
          receiver_roster_id: number
          requester_id: string
          requester_roster_id: number
          status: Database["public"]["Enums"]["status"]
          unit_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          reason?: string | null
          receiver_id: string
          receiver_roster_id: number
          requester_id: string
          requester_roster_id: number
          status?: Database["public"]["Enums"]["status"]
          unit_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          reason?: string | null
          receiver_id?: string
          receiver_roster_id?: number
          requester_id?: string
          requester_roster_id?: number
          status?: Database["public"]["Enums"]["status"]
          unit_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "swap_requests_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "swap_requests_receiver_roster_id_fkey"
            columns: ["receiver_roster_id"]
            isOneToOne: false
            referencedRelation: "roster"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "swap_requests_requester_id_fkey"
            columns: ["requester_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "swap_requests_requester_roster_id_fkey"
            columns: ["requester_roster_id"]
            isOneToOne: false
            referencedRelation: "roster"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "swap_requests_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          }
        ]
      }
      units: {
        Row: {
          created_at: string
          id: string
          unit_code: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          unit_code: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          unit_code?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_claim: {
        Args: {
          uid: string
          claim: string
        }
        Returns: string
      }
      get_claim: {
        Args: {
          uid: string
          claim: string
        }
        Returns: Json
      }
      get_claims: {
        Args: {
          uid: string
        }
        Returns: Json
      }
      get_my_claim: {
        Args: {
          claim: string
        }
        Returns: Json
      }
      get_my_claims: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      is_claims_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      set_claim: {
        Args: {
          uid: string
          claim: string
          value: Json
        }
        Returns: string
      }
    }
    Enums: {
      role: "user" | "manager" | "admin"
      status: "pending" | "accepted" | "declined"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
