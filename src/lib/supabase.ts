import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// null when env is absent, so the app still builds/renders without the comment backend
export const supabase: SupabaseClient | null =
  url && anon ? createClient(url, anon, { auth: { persistSession: false } }) : null;

export type CommentRow = {
  id: string;
  poem_id: string;
  parent_id: string | null;
  author_name: string;
  body: string;
  created_at: string;
};
