import fs from "fs";
import path from "path";
import { Brand, Category, Order, Product, StoreSettings } from "@/types";
import {
  initialBrands,
  initialCategories,
  initialProducts,
  initialStoreSettings,
} from "./data/initial-data";
import { generateOrderReference } from "./formatters";

interface DatabaseSchema {
  products: Product[];
  brands: Brand[];
  categories: Category[];
  orders: Order[];
  settings: StoreSettings;
}

const DB_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DB_DIR, "store-db.json");

function ensureDatabase(): DatabaseSchema {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }

    if (!fs.existsSync(DB_FILE)) {
      const initialDb: DatabaseSchema = {
        products: initialProducts,
        brands: initialBrands,
        categories: initialCategories,
        orders: [],
        settings: initialStoreSettings,
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), "utf-8");
      return initialDb;
    }

    const content = fs.readFileSync(DB_FILE, "utf-8");
    const parsed = JSON.parse(content) as DatabaseSchema;
    return parsed;
  } catch (err) {
    console.error("Error accessing local database, using fallback data:", err);
    return {
      products: initialProducts,
      brands: initialBrands,
      categories: initialCategories,
      orders: [],
      settings: initialStoreSettings,
    };
  }
}

function saveDatabase(data: DatabaseSchema): boolean {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("Error writing to database:", err);
    return false;
  }
}

// ================= PRODUCT METHODS =================
export async function getProducts(options?: {
  category?: string;
  brand?: string;
  family?: string;
  search?: string;
  featuredOnly?: boolean;
  bestsellerOnly?: boolean;
}): Promise<Product[]> {
  const db = ensureDatabase();
  let list = db.products.filter((p) => p.is_active);

  if (options?.featuredOnly) {
    list = list.filter((p) => p.featured);
  }
  if (options?.bestsellerOnly) {
    list = list.filter((p) => p.is_bestseller);
  }
  if (options?.category) {
    list = list.filter(
      (p) =>
        p.category_id === options.category ||
        p.category_name.toLowerCase().includes(options.category!.toLowerCase())
    );
  }
  if (options?.brand) {
    list = list.filter(
      (p) =>
        p.brand_id === options.brand ||
        p.brand_name.toLowerCase().includes(options.brand!.toLowerCase())
    );
  }
  if (options?.family) {
    list = list.filter((p) => p.olfactory_family === options.family);
  }
  if (options?.search) {
    const q = options.search.toLowerCase().trim();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand_name.toLowerCase().includes(q) ||
        p.short_description.toLowerCase().includes(q) ||
        p.top_notes.some((n) => n.toLowerCase().includes(q)) ||
        p.heart_notes.some((n) => n.toLowerCase().includes(q)) ||
        p.base_notes.some((n) => n.toLowerCase().includes(q))
    );
  }

  return list;
}

export async function getAllProductsAdmin(): Promise<Product[]> {
  const db = ensureDatabase();
  return db.products;
}

export async function getProductById(id: string): Promise<Product | null> {
  const db = ensureDatabase();
  const prod = db.products.find((p) => p.id === id || p.slug === id);
  return prod || null;
}

export async function upsertProduct(product: Partial<Product> & { id?: string }): Promise<Product> {
  const db = ensureDatabase();
  const now = new Date().toISOString();

  if (product.id) {
    const index = db.products.findIndex((p) => p.id === product.id);
    if (index >= 0) {
      const existing = db.products[index];
      const updated: Product = {
        ...existing,
        ...product,
        updated_at: now,
      } as Product;
      db.products[index] = updated;
      saveDatabase(db);
      return updated;
    }
  }

  // Create new product
  const newId = product.id || `prod-${Date.now()}`;
  const slug =
    product.slug ||
    (product.name ? product.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") : `prod-${Date.now()}`);
  
  const newProduct: Product = {
    id: newId,
    name: product.name || "Nuevo Perfume",
    slug,
    brand_id: product.brand_id || "brand-lattafa",
    brand_name: product.brand_name || "Lattafa Perfumes",
    category_id: product.category_id || "cat-arabes",
    category_name: product.category_name || "Perfumes Árabes",
    concentration: product.concentration || "Eau de Parfum",
    gender: product.gender || "Unisex",
    description: product.description || "",
    short_description: product.short_description || "",
    olfactory_family: product.olfactory_family || "Ámbar Cálido & Especiado",
    top_notes: product.top_notes || [],
    heart_notes: product.heart_notes || [],
    base_notes: product.base_notes || [],
    longevity: product.longevity || "10 a 14 horas",
    sillage: product.sillage || "Alta",
    occasion: product.occasion || "Noche & Día",
    season: product.season || "Todo el año",
    primary_image:
      product.primary_image ||
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80",
    images:
      product.images && product.images.length > 0
        ? product.images
        : [
            product.primary_image ||
              "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80",
          ],
    base_price: product.base_price || 35000,
    variants:
      product.variants && product.variants.length > 0
        ? product.variants
        : [
            {
              id: `var-${Date.now()}-5ml`,
              name: "Decant 5 ml",
              size_ml: 5,
              price: product.base_price || 35000,
              stock: 20,
              sku: `DEC-5-${Date.now().toString().slice(-4)}`,
              is_available: true,
            },
          ],
    featured: Boolean(product.featured),
    is_bestseller: Boolean(product.is_bestseller),
    is_new: Boolean(product.is_new),
    is_active: product.is_active !== undefined ? product.is_active : true,
    created_at: now,
    updated_at: now,
  };

  db.products.unshift(newProduct);
  saveDatabase(db);
  return newProduct;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const db = ensureDatabase();
  const index = db.products.findIndex((p) => p.id === id);
  if (index >= 0) {
    db.products.splice(index, 1);
    return saveDatabase(db);
  }
  return false;
}

// ================= BRANDS & CATEGORIES =================
export async function getBrands(): Promise<Brand[]> {
  const db = ensureDatabase();
  return db.brands;
}

export async function getCategories(): Promise<Category[]> {
  const db = ensureDatabase();
  return db.categories;
}

// ================= ORDER METHODS =================
export async function getOrders(): Promise<Order[]> {
  const db = ensureDatabase();
  return db.orders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export async function getOrderById(id: string): Promise<Order | null> {
  const db = ensureDatabase();
  return db.orders.find((o) => o.id === id || o.reference === id) || null;
}

export interface CreateOrderInput {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  shipping_city: string;
  shipping_department: string;
  delivery_notes?: string;
  shipping_method: "standard" | "express" | "pickup";
  payment_method: "contra_entrega" | "transferencia" | "online_card";
  items: {
    product_id: string;
    variant_id: string;
    quantity: number;
  }[];
}

export async function createOrder(input: CreateOrderInput): Promise<{
  success: boolean;
  order?: Order;
  error?: string;
}> {
  const db = ensureDatabase();

  if (!input.customer_name || !input.customer_phone || !input.shipping_address || !input.shipping_city) {
    return { success: false, error: "Faltan datos obligatorios para el envío y facturación." };
  }

  if (!input.items || input.items.length === 0) {
    return { success: false, error: "La orden no contiene fragancias." };
  }

  // Stock validation & snapshot building
  const orderItemSnapshots: Order["items"] = [];
  let subtotal = 0;

  for (const item of input.items) {
    const product = db.products.find((p) => p.id === item.product_id);
    if (!product || !product.is_active) {
      return { success: false, error: `El perfume con ID ${item.product_id} no está disponible.` };
    }

    const variant = product.variants.find((v) => v.id === item.variant_id);
    if (!variant || !variant.is_available) {
      return {
        success: false,
        error: `El formato seleccionado para ${product.name} no se encuentra disponible.`,
      };
    }

    if (variant.stock < item.quantity) {
      return {
        success: false,
        error: `Stock insuficiente para ${product.name} (${variant.name}). Disponibles: ${variant.stock}, solicitados: ${item.quantity}.`,
      };
    }

    // Deduct stock safely
    variant.stock -= item.quantity;
    if (variant.stock <= 0) {
      variant.is_available = false;
    }

    const lineTotal = variant.price * item.quantity;
    subtotal += lineTotal;

    orderItemSnapshots.push({
      product_id: product.id,
      variant_id: variant.id,
      product_name: product.name,
      brand_name: product.brand_name,
      variant_name: variant.name,
      size_ml: variant.size_ml,
      unit_price: variant.price,
      quantity: item.quantity,
      total_price: lineTotal,
      image: product.primary_image,
    });
  }

  // Calculate shipping fee
  let shipping_fee = 0;
  if (input.shipping_method === "standard") {
    shipping_fee =
      subtotal >= db.settings.free_shipping_threshold ? 0 : db.settings.standard_shipping_fee;
  } else if (input.shipping_method === "express") {
    shipping_fee = db.settings.express_shipping_fee;
  } else {
    shipping_fee = 0;
  }

  const total = subtotal + shipping_fee;
  const now = new Date().toISOString();
  const orderId = `ord-${Date.now()}`;
  const reference = generateOrderReference();

  const newOrder: Order = {
    id: orderId,
    reference,
    customer_name: input.customer_name.trim(),
    customer_email: input.customer_email.trim(),
    customer_phone: input.customer_phone.trim(),
    shipping_address: input.shipping_address.trim(),
    shipping_city: input.shipping_city.trim(),
    shipping_department: input.shipping_department.trim(),
    delivery_notes: input.delivery_notes?.trim() || undefined,
    shipping_method: input.shipping_method,
    shipping_fee,
    subtotal,
    total,
    payment_method: input.payment_method,
    payment_status: input.payment_method === "online_card" ? "paid" : "pending",
    status: "confirmed",
    items: orderItemSnapshots,
    created_at: now,
    updated_at: now,
  };

  db.orders.unshift(newOrder);
  saveDatabase(db);

  return { success: true, order: newOrder };
}

export async function updateOrderStatus(
  orderId: string,
  status: Order["status"],
  payment_status?: Order["payment_status"]
): Promise<Order | null> {
  const db = ensureDatabase();
  const order = db.orders.find((o) => o.id === orderId);
  if (!order) return null;

  order.status = status;
  if (payment_status) {
    order.payment_status = payment_status;
  }
  order.updated_at = new Date().toISOString();

  saveDatabase(db);
  return order;
}

// ================= STORE SETTINGS =================
export async function getStoreSettings(): Promise<StoreSettings> {
  const db = ensureDatabase();
  return db.settings;
}

export async function updateStoreSettings(settings: Partial<StoreSettings>): Promise<StoreSettings> {
  const db = ensureDatabase();
  db.settings = {
    ...db.settings,
    ...settings,
  };
  saveDatabase(db);
  return db.settings;
}
