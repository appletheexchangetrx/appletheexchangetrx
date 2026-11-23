# Supabase database schema

Project: `axednjikcambzbkxyqpp`

The approved database design is applied to the connected Supabase project. The corresponding migration is tracked at:

- `supabase/migrations/20261123004204_implement_approved_eight_table_schema_and_random_variant_stock.sql`

## Tables

| Table | Purpose |
| --- | --- |
| `users` | Phone-first user profile; `phone` is the primary key. Addresses and wishlist are JSONB arrays; preferences and metadata are JSONB objects. |
| `carts` | One JSONB cart per user phone. |
| `orders` | Order header, line items, shipping address, payment and tracking JSONB. |
| `livechat` | Conversation metadata and JSONB message history. |
| `notifications` | User notifications and JSONB data. |
| `store_settings` | Key/value JSONB store configuration. |
| `store_contents` | Keyed content records with JSONB content and active/sort controls. |
| `products` | Product catalog; each variant owns its stock quantity. |

Existing extra columns and unrelated tables were preserved.

## Product variant inventory

Inventory is stored only inside each `products.variants[]` object as:

```json
{
  "id": "iphone-18-pro-max-256-natural",
  "size": "256GB",
  "color": "Natural Titanium",
  "price": 5699,
  "sale_price": 5499,
  "image_link": "https://example.com/natural.jpg",
  "additional_image_link": [],
  "quantity_to_sell_on_facebook": 10
}
```

The migration distributed each product's former stock across its variants randomly while preserving the original total. There is no longer a product-level `quantity_to_sell_on_facebook` column.

The frontend catalog mapper and cart/checkout validation now read and validate stock per variant.

## Access-control status

RLS is enabled on all eight approved tables. Current policies allow public product reads and reads of active store contents. The private tables `carts`, `orders`, `livechat`, `notifications`, and `store_settings` currently have no client policies, so direct anon/authenticated access is blocked by RLS. Do not add broad public CRUD policies to these tables.

**Important existing issue:** `users_public_select` currently has `USING (true)` for `anon` and `authenticated`. Since `users` contains a plaintext `password` column, this policy can expose passwords through the Data API. The existing public insert/update policies are also unrestricted. Remove this exposure and route account operations through a trusted server-side endpoint before enabling public account access. Never select `password` in ordinary profile queries and never put a Supabase service-role key in browser code.

## Remaining integration work

The repository currently integrates the product catalog and per-variant stock. Orders, carts, notifications and live chat remain localStorage-backed in the current frontend. They should be migrated to their Supabase tables only after an owner-scoped trusted backend access pattern is implemented. Phone stored in localStorage alone is not proof of identity and must not be used as an authorization boundary.

The GitHub connector was used to update files, but a local dependency install, TypeScript build and browser smoke test have not yet been run in this environment.
