-- ============================================================================
-- Migration: Update Plans Pricing & Currency for Safepay (PKR)
-- File: supabase/migrations/20260819064500_update_plans_pricing_pkr.sql
-- Description: Sets plan currencies to PKR and updates monthly & yearly pricing
--              for Starter (Free), Pro (Rs 2,999/mo), and Team (Rs 6,999/mo).
-- ============================================================================

BEGIN;

-- 1. Update Starter Plan (Free Tier)
UPDATE public.plans
SET
  currency = 'PKR',
  price_monthly = 0,
  price_yearly = 0,
  updated_at = NOW()
WHERE slug = 'starter';

-- 2. Update Pro Plan (Individual Professional Tier)
-- Monthly: Rs. 2,999 / month
-- Yearly:  Rs. 24,999 / year (~Rs. 2,083 / month - 30% savings)
UPDATE public.plans
SET
  currency = 'PKR',
  price_monthly = 2999,
  price_yearly = 24999,
  updated_at = NOW()
WHERE slug = 'pro';

-- 3. Update Team Plan (Organization / Agency Tier)
-- Monthly: Rs. 6,999 / month
-- Yearly:  Rs. 59,999 / year (~Rs. 4,999 / month - 28% savings)
UPDATE public.plans
SET
  currency = 'PKR',
  price_monthly = 6999,
  price_yearly = 59999,
  updated_at = NOW()
WHERE slug = 'team';

COMMIT;

-- ============================================================================
-- VERIFICATION QUERY
-- Run this query to confirm that all plans have been updated to PKR with
-- the correct pricing structure.
-- ============================================================================
SELECT
  id,
  name,
  slug,
  currency,
  price_monthly,
  price_yearly,
  monthly_credits,
  is_active,
  updated_at
FROM public.plans
ORDER BY price_monthly ASC;
