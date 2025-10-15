/**
 * Common types
 */

export interface BaseModel {
  id: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
  created_by: string;
  updated_by?: string;
  external_source?: string;
  external_id?: string;
}

export interface PaginatedResponse<T> {
  grouped_by?: string;
  sub_grouped_by?: string;
  total_count: number;
  next_cursor?: string;
  prev_cursor?: string;
  next_page_results?: boolean;
  prev_page_results?: boolean;
  count: number;
  total_pages: number;
  total_results: number;
  extra_stats?: any;
  results: T[];
}

export interface Assignee {
  id: string;
  first_name?: string;
  last_name?: string;
  email: string;
  avatar?: string;
  avatar_url?: string;
  display_name?: string;
}

type EmojiProps = {
  in_use: 'emoji';
  emoji: {
    value?: string;
    url?: string;
  };
};

type IconProps = {
  in_use: 'icon';
  icon: {
    name?: string;
    color?: string;
    background_color?: string;
  };
};

export type LogoProps = EmojiProps | IconProps;

export type ServerGeneratedFields =
  | 'id'
  | 'created_at'
  | 'updated_at'
  | 'deleted_at'
  | 'created_by'
  | 'updated_by'
  | 'external_source'
  | 'external_id';

export type CreateEntity<T> = Omit<T, ServerGeneratedFields>;

export type UpdateEntity<T> = Partial<Omit<T, ServerGeneratedFields | 'id'>>;

export type ResponseEntity<T> = T;

export type PriorityEnum = 'urgent' | 'high' | 'medium' | 'low' | 'none';