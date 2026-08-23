export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

type Row = Record<string, unknown>;
type Table<R extends Row, I extends Row = Partial<R>, U extends Row = Partial<I>> = { Row: R; Insert: I; Update: U; Relationships: [] };

export type Database = {
  public: {
    Tables: {
      posts: Table<Row>;
      authors: Table<Row>;
      categories: Table<Row>;
      tags: Table<Row>;
      post_tags: Table<Row>;
      post_sources: Table<Row>;
      newsletter_subscribers: Table<Row, { email: string; name?: string; status?: string; source?: string; interests?: string[] }>;
    };
    Views: Record<string, never>;
    Functions: { increment_post_view: { Args: { post_slug: string }; Returns: number } };
    Enums: { post_status: "draft" | "review" | "scheduled" | "published" | "archived" };
    CompositeTypes: Record<string, never>;
  };
};
