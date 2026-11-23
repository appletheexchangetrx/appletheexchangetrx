-- Mirrors the already-applied Supabase migration:
-- 20261123004204_implement_approved_eight_table_schema_and_random_variant_stock
-- Keep this file in sync with the remote migration history.

CREATE TABLE IF NOT EXISTS public.carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_phone TEXT UNIQUE REFERENCES public.users(phone),
  items JSONB NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(items) = 'array'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT,
  user_phone TEXT REFERENCES public.users(phone),
  items JSONB NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(items) = 'array'),
  shipping_address JSONB NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(shipping_address) = 'object'),
  payment JSONB NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(payment) = 'object'),
  tracking JSONB NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(tracking) = 'array'),
  subtotal NUMERIC,
  total NUMERIC,
  status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.livechat (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_phone TEXT REFERENCES public.users(phone),
  conversation_number TEXT,
  subject TEXT,
  status TEXT,
  messages JSONB NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(messages) = 'array'),
  last_message_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_phone TEXT REFERENCES public.users(phone),
  type TEXT,
  title TEXT,
  message TEXT,
  data JSONB NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(data) = 'object'),
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.store_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE,
  value JSONB,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.store_contents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE,
  type TEXT,
  title TEXT,
  content JSONB NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(content) = 'object'),
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.products
  ALTER COLUMN title SET NOT NULL,
  ALTER COLUMN brand SET DEFAULT 'Apple',
  ALTER COLUMN brand SET NOT NULL,
  ALTER COLUMN sale_price_effective_date TYPE TEXT USING sale_price_effective_date::text;

-- The old stock was stored once per product. Distribute that total across its
-- variants using random weights and the largest-remainder method, preserving
-- the exact product total.
WITH variant_weights AS MATERIALIZED (
  SELECT
    p.item_group_id,
    COALESCE(p.quantity_to_sell_on_facebook, 0)::INTEGER AS total_stock,
    v.ordinality,
    v.value,
    random() AS weight
  FROM public.products AS p
  CROSS JOIN LATERAL jsonb_array_elements(p.variants) WITH ORDINALITY AS v(value, ordinality)
),
weighted AS (
  SELECT
    *,
    SUM(weight) OVER (PARTITION BY item_group_id) AS total_weight
  FROM variant_weights
),
base_allocations AS (
  SELECT
    *,
    FLOOR(total_stock * weight / NULLIF(total_weight, 0))::INTEGER AS base_stock,
    total_stock - SUM(FLOOR(total_stock * weight / NULLIF(total_weight, 0))::INTEGER)
      OVER (PARTITION BY item_group_id) AS remaining_units
  FROM weighted
),
ranked_allocations AS (
  SELECT
    *,
    ROW_NUMBER() OVER (PARTITION BY item_group_id ORDER BY random()) AS random_rank
  FROM base_allocations
),
final_allocations AS (
  SELECT
    item_group_id,
    ordinality,
    base_stock + CASE WHEN random_rank <= remaining_units THEN 1 ELSE 0 END AS stock
  FROM ranked_allocations
),
updated_variants AS (
  SELECT
    p.item_group_id,
    jsonb_agg(
      jsonb_set(v.value, '{quantity_to_sell_on_facebook}', to_jsonb(a.stock), TRUE)
      ORDER BY v.ordinality
    ) AS variants
  FROM public.products AS p
  CROSS JOIN LATERAL jsonb_array_elements(p.variants) WITH ORDINALITY AS v(value, ordinality)
  JOIN final_allocations AS a
    ON a.item_group_id = p.item_group_id
   AND a.ordinality = v.ordinality
  GROUP BY p.item_group_id
)
UPDATE public.products AS p
SET variants = u.variants
FROM updated_variants AS u
WHERE u.item_group_id = p.item_group_id;

ALTER TABLE public.products
  ALTER COLUMN variants SET DEFAULT '[]'::jsonb,
  ALTER COLUMN variants SET NOT NULL;

ALTER TABLE public.products
  DROP CONSTRAINT IF EXISTS products_variants_schema_check;

ALTER TABLE public.products
  ADD CONSTRAINT products_variants_schema_check
  CHECK (
    jsonb_matches_schema(
      '{
        "type":"array",
        "items":{
          "type":"object",
          "additionalProperties":false,
          "required":["id","size","color","price","sale_price","image_link","additional_image_link","quantity_to_sell_on_facebook"],
          "properties":{
            "id":{"type":"string","minLength":1},
            "size":{"type":["string","null"]},
            "color":{"type":["string","null"]},
            "price":{"type":["number","null"]},
            "sale_price":{"type":["number","null"]},
            "image_link":{"type":["string","null"]},
            "additional_image_link":{"type":["array","null"],"items":{"type":"string"}},
            "quantity_to_sell_on_facebook":{"type":"integer","minimum":0}
          }
        }
      }'::json,
      variants
    )
  );

ALTER TABLE public.products
  DROP COLUMN IF EXISTS quantity_to_sell_on_facebook;

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.livechat ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read active store contents" ON public.store_contents;
CREATE POLICY "Public can read active store contents"
  ON public.store_contents
  FOR SELECT
  TO anon, authenticated
  USING (is_active = TRUE);
