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
      group_users: {
        Row: {
          created_at: string | null
          group_id: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          group_id: string
          id?: string
          role?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          group_id?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_users_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      groups: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
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
          group_id: string
          id: string
          max_blockouts: number
          name: string
          no_of_extras: number | null
          onboarded: boolean
          ord_date: string | null
          updated_at: string | null
          weekday_points: number
          weekend_points: number
        }
        Insert: {
          avatar_url?: string | null
          blockout_dates?: string[] | null
          enlistment_date?: string | null
          group_id: string
          id: string
          max_blockouts?: number
          name: string
          no_of_extras?: number | null
          onboarded?: boolean
          ord_date?: string | null
          updated_at?: string | null
          weekday_points?: number
          weekend_points?: number
        }
        Update: {
          avatar_url?: string | null
          blockout_dates?: string[] | null
          enlistment_date?: string | null
          group_id?: string
          id?: string
          max_blockouts?: number
          name?: string
          no_of_extras?: number | null
          onboarded?: boolean
          ord_date?: string | null
          updated_at?: string | null
          weekday_points?: number
          weekend_points?: number
        }
        Relationships: [
          {
            foreignKeyName: "profiles_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
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
          group_id: string
          id: number
          is_extra: boolean
          reserve_duty_personnel: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          duty_date: string
          duty_personnel?: string | null
          group_id: string
          id?: number
          is_extra?: boolean
          reserve_duty_personnel?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          duty_date?: string
          duty_personnel?: string | null
          group_id?: string
          id?: number
          is_extra?: boolean
          reserve_duty_personnel?: string | null
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
            foreignKeyName: "roster_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "roster_reserve_duty_personnel_fkey"
            columns: ["reserve_duty_personnel"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      swap_requests: {
        Row: {
          created_at: string
          group_id: string
          id: number
          reason: string | null
          receiver_id: string
          receiver_roster_id: number
          requester_id: string
          requester_roster_id: number
          status: Database["public"]["Enums"]["status"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          group_id: string
          id?: number
          reason?: string | null
          receiver_id: string
          receiver_roster_id: number
          requester_id: string
          requester_roster_id: number
          status?: Database["public"]["Enums"]["status"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          group_id?: string
          id?: number
          reason?: string | null
          receiver_id?: string
          receiver_roster_id?: number
          requester_id?: string
          requester_roster_id?: number
          status?: Database["public"]["Enums"]["status"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "swap_requests_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
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
          }
        ]
      }
    }
    Views: {
      user_roles: {
        Row: {
          email: string | null
          group_id: string | null
          group_name: string | null
          id: string | null
          role: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "group_users_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Functions: {
      add_group_user_by_email: {
        Args: {
          user_email: string
          gid: string
          group_role: string
        }
        Returns: string
      }
      has_group_role: {
        Args: {
          group_id: string
          group_role: string
        }
        Returns: boolean
      }
      is_group_member: {
        Args: {
          group_id: string
        }
        Returns: boolean
      }
      jwt_has_group_role: {
        Args: {
          group_id: string
          group_role: string
        }
        Returns: boolean
      }
      jwt_is_expired: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      jwt_is_group_member: {
        Args: {
          group_id: string
        }
        Returns: boolean
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
