-- ============================================================================
-- FRAGANCE STOCK RD — PRODUCTION POSTGRESQL & SUPABASE DATABASE SCHEMA
-- Migration: 20261019_init_fragance_stock_rd.sql
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. BRANDS
CREATE TABLE IF NOT EXISTS brands (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  origin TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CATEGORIES
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PRODUCTS
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  brand_id TEXT NOT NULL REFERENCES brands(id) ON UPDATE CASCADE,
  brand_name TEXT NOT NULL,
  category_id TEXT NOT NULL REFERENCES categories(id) ON UPDATE CASCADE,
  category_name TEXT NOT NULL,
  concentration TEXT NOT NULL DEFAULT 'Eau de Parfum',
  gender TEXT NOT NULL DEFAULT 'Unisex',
  description TEXT,
  short_description TEXT,
  olfactory_family TEXT NOT NULL,
  top_notes TEXT[] DEFAULT '{}',
  heart_notes TEXT[] DEFAULT '{}',
  base_notes TEXT[] DEFAULT '{}',
  longevity TEXT DEFAULT '10 a 14 horas',
  sillage TEXT DEFAULT 'Alta',
  occasion TEXT DEFAULT 'Noches & Citas',
  season TEXT DEFAULT 'Todo el año',
  primary_image TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  base_price NUMERIC(12, 2) NOT NULL CHECK (base_price >= 0),
  featured BOOLEAN DEFAULT FALSE,
  is_bestseller BOOLEAN DEFAULT FALSE,
  is_new BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PRODUCT VARIANTS (Decants 5ml, 10ml, Full Bottle 100ml)
CREATE TABLE IF NOT EXISTS product_variants (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  size_ml INTEGER NOT NULL CHECK (size_ml > 0),
  price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
  compare_at_price NUMERIC(12, 2),
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  sku TEXT UNIQUE NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ORDERS
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  reference TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  shipping_address TEXT NOT NULL,
  shipping_city TEXT NOT NULL,
  shipping_department TEXT NOT NULL,
  delivery_notes TEXT,
  shipping_method TEXT NOT NULL CHECK (shipping_method IN ('standard', 'express', 'pickup')),
  shipping_fee NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (shipping_fee >= 0),
  subtotal NUMERIC(12, 2) NOT NULL CHECK (subtotal >= 0),
  total NUMERIC(12, 2) NOT NULL CHECK (total >= 0),
  payment_method TEXT NOT NULL CHECK (payment_method IN ('contra_entrega', 'transferencia', 'online_card')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ORDER ITEMS (Immutable purchase snapshots)
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  variant_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  brand_name TEXT NOT NULL,
  variant_name TEXT NOT NULL,
  size_ml INTEGER NOT NULL,
  unit_price NUMERIC(12, 2) NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  total_price NUMERIC(12, 2) NOT NULL,
  image TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. STORE SETTINGS
CREATE TABLE IF NOT EXISTS store_settings (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  store_name TEXT NOT NULL DEFAULT 'Fragance Stock RD',
  store_slogan TEXT NOT NULL,
  currency_code TEXT NOT NULL DEFAULT 'DOP',
  currency_symbol TEXT NOT NULL DEFAULT 'RD$',
  whatsapp_number TEXT NOT NULL,
  whatsapp_display TEXT NOT NULL,
  instagram_handle TEXT NOT NULL DEFAULT 'fragancestockrd',
  instagram_url TEXT NOT NULL DEFAULT 'https://www.instagram.com/fragancestockrd/',
  email TEXT NOT NULL,
  announcement_text TEXT NOT NULL,
  announcement_enabled BOOLEAN DEFAULT TRUE,
  free_shipping_threshold NUMERIC(12, 2) NOT NULL DEFAULT 200000,
  standard_shipping_fee NUMERIC(12, 2) NOT NULL DEFAULT 15000,
  express_shipping_fee NUMERIC(12, 2) NOT NULL DEFAULT 25000,
  delivery_coverage TEXT NOT NULL,
  address_placeholder TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. INDEXES FOR HIGH-TRAFFIC PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_active_featured ON products(is_active, featured);
CREATE INDEX IF NOT EXISTS idx_variants_product ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_reference ON orders(reference);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);

-- 9. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;

-- Public can read catalog data
CREATE POLICY "Public can view active products" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view variants" ON product_variants FOR SELECT USING (is_available = true);
CREATE POLICY "Public can view brands" ON brands FOR SELECT TO PUBLIC USING (true);
CREATE POLICY "Public can view categories" ON categories FOR SELECT TO PUBLIC USING (true);
CREATE POLICY "Public can view store settings" ON store_settings FOR SELECT TO PUBLIC USING (true);

-- Public can create orders during checkout
CREATE POLICY "Public can place orders" ON orders FOR INSERT TO PUBLIC WITH CHECK (true);
CREATE POLICY "Public can insert order items" ON order_items FOR INSERT TO PUBLIC WITH CHECK (true);

-- Authenticated admins have full read/write
CREATE POLICY "Admins full access brands" ON brands FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins full access categories" ON categories FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins full access products" ON products FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins full access variants" ON product_variants FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins full access orders" ON orders FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins full access order_items" ON order_items FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins full access settings" ON store_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);
