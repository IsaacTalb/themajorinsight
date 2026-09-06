export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

type Row = Record<string, unknown>;
type Table<R extends Row, I extends Row = Partial<R>, U extends Row = Partial<I>> = { Row: R; Insert: I; Update: U; Relationships: [] };

type NewsletterSubscriberInsert = {
  email: string;
  name?: string;
  status?: string;
  source?: string;
  interests?: string[];
  confirmation_status?: string;
  unsubscribe_token?: string;
  bounce_state?: string;
  signup_source?: string;
};

type PostViewEventInsert = {
  post_slug: string;
  visitor_fingerprint?: string;
  referrer_path?: string | null;
  created_at?: string;
};

export type Database = {
  public: {
    Tables: {
      posts: Table<Row>;
      authors: Table<Row>;
      categories: Table<Row>;
      tags: Table<Row>;
      post_tags: Table<Row>;
      post_sources: Table<Row>;
      newsletter_subscribers: Table<Row, NewsletterSubscriberInsert>;
      admin_profiles: Table<Row>;
      media_assets: Table<Row>;
      trend_topics: Table<Row>;
      site_settings: Table<Row>;
      audit_logs: Table<Row>;
      post_revisions: Table<Row>;
      post_view_events: Table<Row, PostViewEventInsert>;
    };
    Views: Record<string, never>;
    Functions: { increment_post_view: { Args: { post_slug: string }; Returns: number } };
    Enums: { post_status: "draft" | "review" | "scheduled" | "published" | "archived" };
    CompositeTypes: Record<string, never>;
  };
};
