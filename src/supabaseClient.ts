import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://ykwhwaydruzwdnoaaswt.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlrd2h3YXlkcnV6d2Rub2Fhc3d0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQ5MTU0MjUsImV4cCI6MjAzMDQ5MTQyNX0.syZdVHFCQJwCRc6dHql7RMxVZS3Pj9RPlNXW_TcJKzk",
);

export const getSupabaseClient = () => supabase;
