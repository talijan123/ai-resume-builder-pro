-- ============================================================================
-- Migration: Create Cover Letters
-- File: supabase/migrations/20260823000000_create_cover_letters.sql
-- Description: Adds user-owned persistent storage for multiple cover letters.
-- ============================================================================

BEGIN;

CREATE TABLE public.cover_letters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT 'Untitled Cover Letter',
  letter_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  selected_template text NOT NULL DEFAULT 'professional',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX cover_letters_user_id_updated_at_idx
  ON public.cover_letters (user_id, updated_at DESC);

ALTER TABLE public.cover_letters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own cover letters"
  ON public.cover_letters
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own cover letters"
  ON public.cover_letters
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cover letters"
  ON public.cover_letters
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cover letters"
  ON public.cover_letters
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

COMMIT;