import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ── Database types ────────────────────────────────────────────────────────────
export type User = {
  id: string;
  email: string;
  provider: string;
  created_at: string;
};

export type Subscription = {
  id: string;
  user_id: string;
  name: string;
  category: string;
  amount: number;
  frequency: string;
  last_used: string;
  risk: "high" | "med" | "low";
  active: boolean;
};

export type Scan = {
  id: string;
  user_id: string;
  emails_count: number;
  savings_found: number;
  created_at: string;
  status: "pending" | "done" | "error";
};

export type Invoice = {
  id: string;
  user_id: string;
  merchant: string;
  amount: number;
  date: string;
  flag: string;
  severity: "high" | "med";
};
