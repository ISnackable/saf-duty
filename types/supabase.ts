export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      group_users: {
        Row: {
          created_at: string | null;
          group_id: string;
          id: string;
          role: Database['public']['Enums']['role'];
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          group_id: string;
          id?: string;
          role?: Database['public']['Enums']['role'];
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          group_id?: string;
          id?: string;
          role?: Database['public']['Enums']['role'];
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'group_users_group_id_fkey';
            columns: ['group_id'];
            isOneToOne: false;
            referencedRelation: 'groups';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'group_users_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: true;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      groups: {
        Row: {
          created_at: string;
          id: string;
          name: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
      notifications: {
        Row: {
          action: 'INSERT' | 'UPDATE' | 'DELETE' | 'TRUNCATE' | 'ERROR' | null;
          created_at: string;
          id: number;
          is_read: boolean;
          message: string;
          title: string;
          user_id: string;
        };
        Insert: {
          action?: 'INSERT' | 'UPDATE' | 'DELETE' | 'TRUNCATE' | 'ERROR' | null;
          created_at?: string;
          id?: number;
          is_read?: boolean;
          message: string;
          title: string;
          user_id: string;
        };
        Update: {
          action?: 'INSERT' | 'UPDATE' | 'DELETE' | 'TRUNCATE' | 'ERROR' | null;
          created_at?: string;
          id?: number;
          is_read?: boolean;
          message?: string;
          title?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'notifications_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          blockout_dates: string[] | null;
          enlistment_date: string | null;
          group_id: string;
          id: string;
          max_blockouts: number;
          name: string;
          no_of_extras: number | null;
          onboarded: boolean;
          ord_date: string | null;
          updated_at: string | null;
          weekday_points: number;
          weekend_points: number;
        };
        Insert: {
          avatar_url?: string | null;
          blockout_dates?: string[] | null;
          enlistment_date?: string | null;
          group_id: string;
          id: string;
          max_blockouts?: number;
          name: string;
          no_of_extras?: number | null;
          onboarded?: boolean;
          ord_date?: string | null;
          updated_at?: string | null;
          weekday_points?: number;
          weekend_points?: number;
        };
        Update: {
          avatar_url?: string | null;
          blockout_dates?: string[] | null;
          enlistment_date?: string | null;
          group_id?: string;
          id?: string;
          max_blockouts?: number;
          name?: string;
          no_of_extras?: number | null;
          onboarded?: boolean;
          ord_date?: string | null;
          updated_at?: string | null;
          weekday_points?: number;
          weekend_points?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'profiles_group_id_fkey';
            columns: ['group_id'];
            isOneToOne: false;
            referencedRelation: 'groups';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'profiles_id_fkey';
            columns: ['id'];
            isOneToOne: true;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      push_subscriptions: {
        Row: {
          created_at: string;
          id: number;
          push_subscription_details: Json;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: number;
          push_subscription_details: Json;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: number;
          push_subscription_details?: Json;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'push_subscriptions_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: true;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      rosters: {
        Row: {
          created_at: string;
          duty_date: string;
          duty_personnel_id: string | null;
          group_id: string;
          id: number;
          is_extra: boolean;
          reserve_duty_personnel_id: string | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string;
          duty_date: string;
          duty_personnel_id?: string | null;
          group_id: string;
          id?: number;
          is_extra?: boolean;
          reserve_duty_personnel_id?: string | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string;
          duty_date?: string;
          duty_personnel_id?: string | null;
          group_id?: string;
          id?: number;
          is_extra?: boolean;
          reserve_duty_personnel_id?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'rosters_duty_personnel_id_fkey';
            columns: ['duty_personnel_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'rosters_group_id_fkey';
            columns: ['group_id'];
            isOneToOne: false;
            referencedRelation: 'groups';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'rosters_reserve_duty_personnel_id_fkey';
            columns: ['reserve_duty_personnel_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      swap_requests: {
        Row: {
          created_at: string;
          group_id: string;
          id: number;
          reason: string | null;
          receiver_id: string;
          receiver_roster_id: number;
          requester_id: string;
          requester_roster_id: number;
          status: Database['public']['Enums']['status'];
          updated_at: string | null;
        };
        Insert: {
          created_at?: string;
          group_id: string;
          id?: number;
          reason?: string | null;
          receiver_id: string;
          receiver_roster_id: number;
          requester_id: string;
          requester_roster_id: number;
          status?: Database['public']['Enums']['status'];
          updated_at?: string | null;
        };
        Update: {
          created_at?: string;
          group_id?: string;
          id?: number;
          reason?: string | null;
          receiver_id?: string;
          receiver_roster_id?: number;
          requester_id?: string;
          requester_roster_id?: number;
          status?: Database['public']['Enums']['status'];
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'swap_requests_group_id_fkey';
            columns: ['group_id'];
            isOneToOne: false;
            referencedRelation: 'groups';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'swap_requests_receiver_id_fkey';
            columns: ['receiver_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'swap_requests_receiver_roster_id_fkey';
            columns: ['receiver_roster_id'];
            isOneToOne: false;
            referencedRelation: 'rosters';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'swap_requests_requester_id_fkey';
            columns: ['requester_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'swap_requests_requester_roster_id_fkey';
            columns: ['requester_roster_id'];
            isOneToOne: false;
            referencedRelation: 'rosters';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      user_roles: {
        Row: {
          group_id: string | null;
          group_name: string | null;
          id: string | null;
          name: string | null;
          role: Database['public']['Enums']['role'] | null;
          user_id: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'group_users_group_id_fkey';
            columns: ['group_id'];
            isOneToOne: false;
            referencedRelation: 'groups';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'group_users_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: true;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Functions: {
      add_group_user_by_email: {
        Args: {
          user_email: string;
          gid: string;
          group_role: string;
        };
        Returns: string;
      };
      db_pre_request: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
      delete_avatar: {
        Args: {
          avatar_url: string;
        };
        Returns: Record<string, unknown>;
      };
      delete_storage_object: {
        Args: {
          bucket: string;
          object: string;
        };
        Returns: Record<string, unknown>;
      };
      get_req_groups: {
        Args: Record<PropertyKey, never>;
        Returns: Json;
      };
      has_group_role: {
        Args: {
          group_id: string;
          group_role: string;
        };
        Returns: boolean;
      };
      is_group_member: {
        Args: {
          group_id: string;
        };
        Returns: boolean;
      };
      jwt_has_group_role: {
        Args: {
          group_id: string;
          group_role: string;
        };
        Returns: boolean;
      };
      jwt_is_expired: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      jwt_is_group_member: {
        Args: {
          group_id: string;
        };
        Returns: boolean;
      };
    };
    Enums: {
      action: 'swap_requests';
      role: 'user' | 'manager' | 'admin';
      status: 'pending' | 'accepted' | 'declined';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null;
          avif_autodetection: boolean | null;
          created_at: string | null;
          file_size_limit: number | null;
          id: string;
          name: string;
          owner: string | null;
          owner_id: string | null;
          public: boolean | null;
          updated_at: string | null;
        };
        Insert: {
          allowed_mime_types?: string[] | null;
          avif_autodetection?: boolean | null;
          created_at?: string | null;
          file_size_limit?: number | null;
          id: string;
          name: string;
          owner?: string | null;
          owner_id?: string | null;
          public?: boolean | null;
          updated_at?: string | null;
        };
        Update: {
          allowed_mime_types?: string[] | null;
          avif_autodetection?: boolean | null;
          created_at?: string | null;
          file_size_limit?: number | null;
          id?: string;
          name?: string;
          owner?: string | null;
          owner_id?: string | null;
          public?: boolean | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      migrations: {
        Row: {
          executed_at: string | null;
          hash: string;
          id: number;
          name: string;
        };
        Insert: {
          executed_at?: string | null;
          hash: string;
          id: number;
          name: string;
        };
        Update: {
          executed_at?: string | null;
          hash?: string;
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      objects: {
        Row: {
          bucket_id: string | null;
          created_at: string | null;
          id: string;
          last_accessed_at: string | null;
          metadata: Json | null;
          name: string | null;
          owner: string | null;
          owner_id: string | null;
          path_tokens: string[] | null;
          updated_at: string | null;
          version: string | null;
        };
        Insert: {
          bucket_id?: string | null;
          created_at?: string | null;
          id?: string;
          last_accessed_at?: string | null;
          metadata?: Json | null;
          name?: string | null;
          owner?: string | null;
          owner_id?: string | null;
          path_tokens?: string[] | null;
          updated_at?: string | null;
          version?: string | null;
        };
        Update: {
          bucket_id?: string | null;
          created_at?: string | null;
          id?: string;
          last_accessed_at?: string | null;
          metadata?: Json | null;
          name?: string | null;
          owner?: string | null;
          owner_id?: string | null;
          path_tokens?: string[] | null;
          updated_at?: string | null;
          version?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'objects_bucketId_fkey';
            columns: ['bucket_id'];
            isOneToOne: false;
            referencedRelation: 'buckets';
            referencedColumns: ['id'];
          },
        ];
      };
      s3_multipart_uploads: {
        Row: {
          bucket_id: string;
          created_at: string;
          id: string;
          in_progress_size: number;
          key: string;
          owner_id: string | null;
          upload_signature: string;
          version: string;
        };
        Insert: {
          bucket_id: string;
          created_at?: string;
          id: string;
          in_progress_size?: number;
          key: string;
          owner_id?: string | null;
          upload_signature: string;
          version: string;
        };
        Update: {
          bucket_id?: string;
          created_at?: string;
          id?: string;
          in_progress_size?: number;
          key?: string;
          owner_id?: string | null;
          upload_signature?: string;
          version?: string;
        };
        Relationships: [
          {
            foreignKeyName: 's3_multipart_uploads_bucket_id_fkey';
            columns: ['bucket_id'];
            isOneToOne: false;
            referencedRelation: 'buckets';
            referencedColumns: ['id'];
          },
        ];
      };
      s3_multipart_uploads_parts: {
        Row: {
          bucket_id: string;
          created_at: string;
          etag: string;
          id: string;
          key: string;
          owner_id: string | null;
          part_number: number;
          size: number;
          upload_id: string;
          version: string;
        };
        Insert: {
          bucket_id: string;
          created_at?: string;
          etag: string;
          id?: string;
          key: string;
          owner_id?: string | null;
          part_number: number;
          size?: number;
          upload_id: string;
          version: string;
        };
        Update: {
          bucket_id?: string;
          created_at?: string;
          etag?: string;
          id?: string;
          key?: string;
          owner_id?: string | null;
          part_number?: number;
          size?: number;
          upload_id?: string;
          version?: string;
        };
        Relationships: [
          {
            foreignKeyName: 's3_multipart_uploads_parts_bucket_id_fkey';
            columns: ['bucket_id'];
            isOneToOne: false;
            referencedRelation: 'buckets';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 's3_multipart_uploads_parts_upload_id_fkey';
            columns: ['upload_id'];
            isOneToOne: false;
            referencedRelation: 's3_multipart_uploads';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string;
          name: string;
          owner: string;
          metadata: Json;
        };
        Returns: undefined;
      };
      extension: {
        Args: {
          name: string;
        };
        Returns: string;
      };
      filename: {
        Args: {
          name: string;
        };
        Returns: string;
      };
      foldername: {
        Args: {
          name: string;
        };
        Returns: string[];
      };
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>;
        Returns: {
          size: number;
          bucket_id: string;
        }[];
      };
      list_multipart_uploads_with_delimiter: {
        Args: {
          bucket_id: string;
          prefix_param: string;
          delimiter_param: string;
          max_keys?: number;
          next_key_token?: string;
          next_upload_token?: string;
        };
        Returns: {
          key: string;
          id: string;
          created_at: string;
        }[];
      };
      list_objects_with_delimiter: {
        Args: {
          bucket_id: string;
          prefix_param: string;
          delimiter_param: string;
          max_keys?: number;
          start_after?: string;
          next_token?: string;
        };
        Returns: {
          name: string;
          id: string;
          metadata: Json;
          updated_at: string;
        }[];
      };
      search: {
        Args: {
          prefix: string;
          bucketname: string;
          limits?: number;
          levels?: number;
          offsets?: number;
          search?: string;
          sortcolumn?: string;
          sortorder?: string;
        };
        Returns: {
          name: string;
          id: string;
          updated_at: string;
          created_at: string;
          last_accessed_at: string;
          metadata: Json;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
        PublicSchema['Views'])
    ? (PublicSchema['Tables'] &
        PublicSchema['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
    ? PublicSchema['Enums'][PublicEnumNameOrOptions]
    : never;
