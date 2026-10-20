export type OlfactoryFamily =
  | "Amaderado Oriental"
  | "Ámbar Cálido & Especiado"
  | "Acuático & Cítrico Amaderado"
  | "Frutal Gourmand"
  | "Floral Dulce"
  | "Fresco Aromático"
  | "Cuero & Ahumado";

export type FragranceGender = "Hombre" | "Mujer" | "Unisex";

export interface ProductVariant {
  id: string;
  name: string; // e.g. "Decant 5 ml", "Decant 10 ml", "Botella Sellada 100 ml"
  size_ml: number;
  price: number;
  compare_at_price?: number;
  stock: number;
  sku: string;
  is_available: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand_id: string;
  brand_name: string;
  category_id: string;
  category_name: string;
  concentration: string; // "Eau de Parfum", "Extrait de Parfum"
  gender: FragranceGender;
  description: string;
  short_description: string;
  olfactory_family: OlfactoryFamily;
  top_notes: string[];
  heart_notes: string[];
  base_notes: string[];
  longevity: string; // e.g. "12+ horas"
  sillage: string; // e.g. "Alta / Modo Bestia"
  occasion: string; // e.g. "Noche, Citas, Clima Frío"
  season: string; // e.g. "Otoño / Invierno"
  primary_image: string;
  images: string[];
  base_price: number;
  variants: ProductVariant[];
  featured: boolean;
  is_bestseller: boolean;
  is_new: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  origin: string;
  description: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
}

export interface CartItem {
  product_id: string;
  variant_id: string;
  product_name: string;
  brand_name: string;
  variant_name: string;
  size_ml: number;
  unit_price: number;
  quantity: number;
  image: string;
  max_stock: number;
}

export interface OrderItemSnapshot {
  product_id: string;
  variant_id: string;
  product_name: string;
  brand_name: string;
  variant_name: string;
  size_ml: number;
  unit_price: number;
  quantity: number;
  total_price: number;
  image: string;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentMethod =
  | "contra_entrega"
  | "transferencia"
  | "online_card";

export type PaymentStatus = "pending" | "paid" | "failed";

export type ShippingMethod = "standard" | "express" | "pickup";

export interface Order {
  id: string;
  reference: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  shipping_city: string;
  shipping_department: string;
  delivery_notes?: string;
  shipping_method: ShippingMethod;
  shipping_fee: number;
  subtotal: number;
  total: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  status: OrderStatus;
  items: OrderItemSnapshot[];
  created_at: string;
  updated_at: string;
}

export interface StoreSettings {
  store_name: string;
  store_slogan: string;
  currency_code: string;
  currency_symbol: string;
  whatsapp_number: string;
  whatsapp_display: string;
  instagram_handle: string;
  instagram_url: string;
  email: string;
  announcement_text: string;
  announcement_enabled: boolean;
  free_shipping_threshold: number;
  standard_shipping_fee: number;
  express_shipping_fee: number;
  delivery_coverage: string;
  address_placeholder: string;
}
