"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Settings,
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  Eye,
  LogOut,
  Save,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { Brand, Category, Order, Product, ProductVariant, StoreSettings } from "@/types";
import { formatDate, formatPrice } from "@/lib/formatters";

interface Props {
  initialProducts: Product[];
  initialOrders: Order[];
  initialSettings: StoreSettings;
  brands: Brand[];
  categories: Category[];
}

export function AdminDashboardClient({
  initialProducts,
  initialOrders,
  initialSettings,
  brands,
  categories,
}: Props) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState<"overview" | "products" | "orders" | "settings">("overview");

  // Live state
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [settings, setSettings] = useState<StoreSettings>(initialSettings);

  // Product edit modal state
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [isSavingProduct, setIsSavingProduct] = useState(false);

  // Order detail modal state
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Settings save state
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  // Search & filter
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [productSearch, setProductSearch] = useState("");

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: passwordInput }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
      } else {
        setLoginError(data.error || "Contraseña inválida.");
      }
    } catch {
      setLoginError("Error conectando con el servicio de autenticación.");
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setIsAuthenticated(false);
    setPasswordInput("");
  };

  // Calculate actual business metrics (calculated strictly from real records)
  const totalSales = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.total, 0);

  const pendingOrders = orders.filter((o) => o.status === "confirmed" || o.status === "pending");

  const lowStockVariants = products.flatMap((p) =>
    p.variants
      .filter((v) => v.stock <= 5 && v.is_available)
      .map((v) => ({ ...v, productName: p.name, brandName: p.brand_name }))
  );

  // Save product handler
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editingProduct.name) return;

    setIsSavingProduct(true);
    try {
      const isNew = !editingProduct.id;
      const url = isNew ? "/api/products" : `/api/products/${editingProduct.id}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingProduct),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        if (isNew) {
          setProducts([data.product, ...products]);
        } else {
          setProducts(products.map((p) => (p.id === data.product.id ? data.product : p)));
        }
        setProductModalOpen(false);
        setEditingProduct(null);
      } else {
        alert(data.error || "No se pudo guardar el producto.");
      }
    } catch {
      alert("Error de conexión al guardar.");
    } finally {
      setIsSavingProduct(false);
    }
  };

  // Delete product handler
  const handleDeleteProduct = async (id: string) => {
    if (!confirm("¿Confirmas que deseas eliminar esta fragancia del catálogo?")) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProducts(products.filter((p) => p.id !== id));
      } else {
        alert("Error al eliminar el producto.");
      }
    } catch {
      alert("Error de conexión.");
    }
  };

  // Update order status handler
  const handleUpdateOrderStatus = async (
    orderId: string,
    status: Order["status"],
    payment_status?: Order["payment_status"]
  ) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, payment_status }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setOrders(orders.map((o) => (o.id === orderId ? data.order : o)));
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(data.order);
        }
      }
    } catch {
      alert("Error actualizando la orden.");
    }
  };

  // Save settings handler
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    setSettingsSuccess(false);

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSettings(data.settings);
        setSettingsSuccess(true);
        setTimeout(() => setSettingsSuccess(false), 3000);
      }
    } catch {
      alert("Error guardando ajustes.");
    } finally {
      setIsSavingSettings(false);
    }
  };

  // If not logged in, show secure login portal
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-sand/20 py-16 px-4">
        <div className="w-full max-w-sm bg-white rounded-cowboy border border-sand p-8 shadow-md">
          <div className="text-center mb-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/logo-dark.png"
              alt="A&D Parfum"
              className="h-12 w-auto mx-auto object-contain mb-3"
            />
            <p className="text-xs text-taupe font-medium">
              Acceso Administrativo Seguro
            </p>
          </div>

          {loginError && (
            <div className="mb-4 p-3 rounded-cowboy bg-red-50 border border-red-200 text-red-700 text-xs">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-[10px] font-semibold text-espresso uppercase tracking-wider block mb-1">
                Contraseña de Administrador
              </label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Ingresa la contraseña..."
                className="w-full px-3.5 py-2.5 rounded-cowboy border border-sand text-xs text-espresso focus:outline-none focus:border-espresso bg-sand/10"
              />
              <p className="text-[10px] text-taupe mt-1">
                Contraseña para pruebas: <strong className="font-mono text-espresso">ad2026</strong>
              </p>
            </div>

            <button type="submit" className="btn-gold w-full text-xs py-3 justify-center">
              Ingresar al Panel
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 bg-sand/15 min-h-screen">
      <div className="max-w-cowboy mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Admin Header */}
        <div className="bg-white rounded-cowboy border border-sand p-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div>
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/logo-dark.png"
                alt="A&D Parfum"
                className="h-8 w-auto object-contain"
              />
              <span className="font-editorial text-2xl font-normal text-espresso">
                Panel de Control • A&D Parfum
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
            <p className="text-xs text-taupe mt-1 font-light">
              Gestión autónoma de fragancias, pedidos reales, inventario y políticas comerciales de A&D Parfum.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="btn-secondary text-xs py-2 px-3.5 flex items-center gap-1.5"
            >
              <span>Ver Tienda</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={handleLogout}
              className="p-2 text-ash hover:text-charcoal hover:bg-mist rounded-full transition-colors"
              title="Cerrar sesión"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-hairline mb-8 gap-4 sm:gap-8 overflow-x-auto text-xs font-medium">
          <button
            onClick={() => setActiveTab("overview")}
            className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === "overview"
                ? "border-charcoal text-charcoal"
                : "border-transparent text-graphite hover:text-charcoal"
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Métricas & Resumen</span>
          </button>

          <button
            onClick={() => setActiveTab("products")}
            className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === "products"
                ? "border-charcoal text-charcoal"
                : "border-transparent text-graphite hover:text-charcoal"
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Fragancias ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`pb-3 border-b-2 flex items-center gap-2 transition-colors relative ${
              activeTab === "orders"
                ? "border-charcoal text-charcoal"
                : "border-transparent text-graphite hover:text-charcoal"
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Pedidos ({orders.length})</span>
            {pendingOrders.length > 0 && (
              <span className="bg-charcoal text-white text-[9px] px-1.5 py-0.2 rounded-full">
                {pendingOrders.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === "settings"
                ? "border-charcoal text-charcoal"
                : "border-transparent text-graphite hover:text-charcoal"
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Ajustes & Envíos</span>
          </button>
        </div>

        {/* ================= TAB 1: OVERVIEW ================= */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Real Metrics Cards (Calculated directly from database) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-cowboy border border-hairline shadow-sm">
                <span className="text-xs uppercase font-semibold text-ash">Ventas Totales</span>
                <p className="font-editorial text-2xl sm:text-3xl font-medium text-charcoal mt-2">
                  {formatPrice(totalSales)}
                </p>
                <p className="text-[11px] text-smoke mt-1">Calculado sobre órdenes válidas</p>
              </div>

              <div className="bg-white p-6 rounded-cowboy border border-hairline shadow-sm">
                <span className="text-xs uppercase font-semibold text-ash">Pedidos Totales</span>
                <p className="font-editorial text-2xl sm:text-3xl font-medium text-charcoal mt-2">
                  {orders.length}
                </p>
                <p className="text-[11px] text-smoke mt-1">{pendingOrders.length} pendientes de despacho</p>
              </div>

              <div className="bg-white p-6 rounded-cowboy border border-hairline shadow-sm">
                <span className="text-xs uppercase font-semibold text-ash">Perfumes Activos</span>
                <p className="font-editorial text-2xl sm:text-3xl font-medium text-charcoal mt-2">
                  {products.filter((p) => p.is_active).length}
                </p>
                <p className="text-[11px] text-smoke mt-1">{products.length} registrados en catálogo</p>
              </div>

              <div className="bg-white p-6 rounded-cowboy border border-hairline shadow-sm">
                <span className="text-xs uppercase font-semibold text-ash">Alertas de Bajo Stock</span>
                <p className="font-editorial text-2xl sm:text-3xl font-medium text-charcoal mt-2">
                  {lowStockVariants.length}
                </p>
                <p className="text-[11px] text-smoke mt-1">Formatos con ≤ 5 unidades</p>
              </div>
            </div>

            {/* Low stock alert table */}
            {lowStockVariants.length > 0 && (
              <div className="bg-white p-6 rounded-cowboy border border-hairline shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-amber-900 font-semibold text-sm">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Formatos con Bajo Inventario</span>
                </div>
                <div className="divide-y divide-hairline">
                  {lowStockVariants.map((item) => (
                    <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-medium text-charcoal">{item.productName}</span>
                        <span className="text-ash ml-2">({item.brandName})</span>
                        <span className="text-smoke ml-2">• {item.name}</span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 font-semibold">
                        Quedan {item.stock} uds
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Orders Overview */}
            <div className="bg-white p-6 rounded-cowboy border border-hairline shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-editorial text-lg font-medium text-charcoal">
                  Últimos Pedidos Registrados
                </h3>
                <button
                  onClick={() => setActiveTab("orders")}
                  className="text-xs text-smoke hover:text-charcoal font-medium underline"
                >
                  Ver todos los pedidos
                </button>
              </div>

              {orders.length === 0 ? (
                <p className="text-xs text-smoke py-6 text-center">
                  Aún no se han recibido pedidos en la tienda.
                </p>
              ) : (
                <div className="divide-y divide-hairline overflow-x-auto">
                  {orders.slice(0, 5).map((ord) => (
                    <div key={ord.id} className="py-3 flex items-center justify-between text-xs min-w-[500px]">
                      <div>
                        <span className="font-mono font-bold text-charcoal">{ord.reference}</span>
                        <span className="text-graphite ml-3 font-medium">{ord.customer_name}</span>
                        <span className="text-ash ml-2">({ord.shipping_city})</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-semibold text-charcoal">{formatPrice(ord.total)}</span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-semibold bg-mist text-charcoal border border-hairline">
                          {ord.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 2: PRODUCTS ================= */}
        {activeTab === "products" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 text-ash absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Buscar en inventario..."
                  className="w-full pl-10 pr-4 py-2 bg-white border border-hairline rounded-cowboy text-xs text-charcoal focus:outline-none focus:border-charcoal"
                />
              </div>

              <button
                onClick={() => {
                  setEditingProduct({
                    name: "",
                    brand_name: "Lattafa Perfumes",
                    brand_id: "brand-lattafa",
                    category_name: "Perfumes Árabes",
                    category_id: "cat-arabes",
                    concentration: "Eau de Parfum",
                    gender: "Unisex",
                    short_description: "",
                    description: "",
                    olfactory_family: "Ámbar Cálido & Especiado",
                    top_notes: [],
                    heart_notes: [],
                    base_notes: [],
                    longevity: "10 a 14 horas",
                    sillage: "Alta",
                    occasion: "Noche & Citas",
                    season: "Todo el año",
                    primary_image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80",
                    images: ["https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80"],
                    base_price: 35000,
                    featured: false,
                    is_bestseller: false,
                    is_active: true,
                    variants: [
                      {
                        id: `var-new-${Date.now()}-5ml`,
                        name: "Decant 5 ml (Muestra Portátil)",
                        size_ml: 5,
                        price: 35000,
                        stock: 20,
                        sku: `DEC-5-${Math.floor(1000 + Math.random() * 9000)}`,
                        is_available: true,
                      },
                      {
                        id: `var-new-${Date.now()}-10ml`,
                        name: "Decant 10 ml (Atomizador Viaje)",
                        size_ml: 10,
                        price: 65000,
                        stock: 15,
                        sku: `DEC-10-${Math.floor(1000 + Math.random() * 9000)}`,
                        is_available: true,
                      },
                      {
                        id: `var-new-${Date.now()}-100ml`,
                        name: "Botella Sellada 100 ml",
                        size_ml: 100,
                        price: 220000,
                        stock: 8,
                        sku: `BOT-100-${Math.floor(1000 + Math.random() * 9000)}`,
                        is_available: true,
                      },
                    ],
                  });
                  setProductModalOpen(true);
                }}
                className="btn-primary text-xs py-2.5 px-4 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Agregar Fragancia</span>
              </button>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-cowboy border border-hairline overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs divide-y divide-hairline">
                  <thead className="bg-mist/50 text-[10px] uppercase font-semibold text-ash tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Fragancia</th>
                      <th className="py-3 px-4">Casa</th>
                      <th className="py-3 px-4">Categoría</th>
                      <th className="py-3 px-4">Precio Base</th>
                      <th className="py-3 px-4">Formatos & Stock</th>
                      <th className="py-3 px-4">Estado</th>
                      <th className="py-3 px-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-hairline">
                    {products
                      .filter((p) =>
                        p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
                        p.brand_name.toLowerCase().includes(productSearch.toLowerCase())
                      )
                      .map((prod) => (
                        <tr key={prod.id} className="hover:bg-mist/20 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-12 rounded bg-mist overflow-hidden border border-hairline flex-shrink-0">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={prod.primary_image} alt={prod.name} className="w-full h-full object-cover" />
                              </div>
                              <div>
                                <p className="font-medium text-charcoal">{prod.name}</p>
                                <p className="text-[10px] text-ash">{prod.concentration}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-medium text-graphite">{prod.brand_name}</td>
                          <td className="py-3.5 px-4 text-smoke">{prod.category_name}</td>
                          <td className="py-3.5 px-4 font-semibold text-charcoal">
                            {formatPrice(prod.base_price)}
                          </td>
                          <td className="py-3.5 px-4 text-smoke">
                            {prod.variants.map((v) => (
                              <span
                                key={v.id}
                                className={`inline-block mr-1.5 px-2 py-0.5 rounded text-[10px] font-mono ${
                                  v.stock > 0 ? "bg-mist text-charcoal" : "bg-red-50 text-red-700"
                                }`}
                              >
                                {v.size_ml}ml: {v.stock}u
                              </span>
                            ))}
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                                prod.is_active ? "bg-emerald-50 text-emerald-800" : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {prod.is_active ? "Activo" : "Oculto"}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => {
                                  setEditingProduct(JSON.parse(JSON.stringify(prod)));
                                  setProductModalOpen(true);
                                }}
                                className="p-1.5 text-graphite hover:text-charcoal hover:bg-mist rounded transition-colors"
                                title="Editar"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(prod.id)}
                                className="p-1.5 text-ash hover:text-red-600 hover:bg-mist rounded transition-colors"
                                title="Eliminar"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: ORDERS ================= */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 text-ash absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder="Buscar por referencia, cliente o ciudad..."
                  className="w-full pl-10 pr-4 py-2 bg-white border border-hairline rounded-cowboy text-xs text-charcoal focus:outline-none focus:border-charcoal"
                />
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-ash">Filtrar estado:</span>
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="bg-white border border-hairline rounded-cowboy px-3 py-1.5 text-xs text-charcoal focus:outline-none focus:border-charcoal"
                >
                  <option value="all">Todos ({orders.length})</option>
                  <option value="confirmed">Confirmados</option>
                  <option value="processing">En preparación</option>
                  <option value="shipped">Despachados</option>
                  <option value="delivered">Entregados</option>
                  <option value="cancelled">Cancelados</option>
                </select>
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-cowboy border border-hairline overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs divide-y divide-hairline">
                  <thead className="bg-mist/50 text-[10px] uppercase font-semibold text-ash tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Ref. Pedido</th>
                      <th className="py-3 px-4">Cliente & Contacto</th>
                      <th className="py-3 px-4">Ciudad / Dirección</th>
                      <th className="py-3 px-4">Fragancias</th>
                      <th className="py-3 px-4">Total Liquidado</th>
                      <th className="py-3 px-4">Pago</th>
                      <th className="py-3 px-4">Estado</th>
                      <th className="py-3 px-4 text-right">Detalle</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-hairline">
                    {orders
                      .filter((o) => {
                        const matchStatus = orderStatusFilter === "all" || o.status === orderStatusFilter;
                        const matchSearch =
                          !orderSearch ||
                          o.reference.toLowerCase().includes(orderSearch.toLowerCase()) ||
                          o.customer_name.toLowerCase().includes(orderSearch.toLowerCase()) ||
                          o.shipping_city.toLowerCase().includes(orderSearch.toLowerCase()) ||
                          o.customer_phone.includes(orderSearch);
                        return matchStatus && matchSearch;
                      })
                      .map((order) => (
                        <tr key={order.id} className="hover:bg-mist/20 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-charcoal">
                            {order.reference}
                            <span className="block text-[10px] font-sans font-normal text-ash">
                              {formatDate(order.created_at)}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <p className="font-medium text-charcoal">{order.customer_name}</p>
                            <p className="text-[11px] text-smoke font-mono">{order.customer_phone}</p>
                          </td>
                          <td className="py-3.5 px-4 text-smoke">
                            <p className="text-charcoal font-medium">{order.shipping_city}</p>
                            <p className="text-[11px] line-clamp-1">{order.shipping_address}</p>
                          </td>
                          <td className="py-3.5 px-4 text-smoke">
                            {order.items.map((i, idx) => (
                              <span key={idx} className="block text-[11px]">
                                • {i.product_name} ({i.variant_name}) x{i.quantity}
                              </span>
                            ))}
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-charcoal">
                            {formatPrice(order.total)}
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-medium capitalize ${
                                order.payment_status === "paid"
                                  ? "bg-emerald-50 text-emerald-800"
                                  : "bg-amber-50 text-amber-800"
                              }`}
                            >
                              {order.payment_status === "paid" ? "Pagado" : "Pendiente"}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <select
                              value={order.status}
                              onChange={(e) =>
                                handleUpdateOrderStatus(order.id, e.target.value as Order["status"])
                              }
                              className="bg-mist border border-hairline rounded px-2 py-1 text-[11px] text-charcoal focus:outline-none"
                            >
                              <option value="pending">Pendiente</option>
                              <option value="confirmed">Confirmado</option>
                              <option value="processing">En preparación</option>
                              <option value="shipped">Despachado</option>
                              <option value="delivered">Entregado</option>
                              <option value="cancelled">Cancelado</option>
                            </select>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="p-1.5 text-graphite hover:text-charcoal hover:bg-mist rounded transition-colors"
                              title="Ver ficha completa de orden"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 4: SETTINGS ================= */}
        {activeTab === "settings" && (
          <div className="max-w-2xl bg-white rounded-cowboy border border-hairline p-6 sm:p-8 shadow-sm">
            <div className="pb-6 border-b border-hairline mb-6">
              <h2 className="font-editorial text-xl font-medium text-charcoal">
                Configuración General de la Tienda
              </h2>
              <p className="text-xs text-smoke mt-1">
                Ajusta las políticas de despacho, WhatsApp de atención y el cintillo superior de anuncios.
              </p>
            </div>

            {settingsSuccess && (
              <div className="mb-6 p-4 rounded-cowboy bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>¡Ajustes actualizados correctamente en base de datos!</span>
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-6 text-xs">
              <div>
                <label className="font-semibold text-charcoal block mb-1 uppercase text-[10px]">
                  Nombre de la Tienda
                </label>
                <input
                  type="text"
                  value={settings.store_name}
                  onChange={(e) => setSettings({ ...settings, store_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-cowboy border border-hairline text-xs focus:outline-none focus:border-charcoal"
                />
              </div>

              <div>
                <label className="font-semibold text-charcoal block mb-1 uppercase text-[10px]">
                  Lema Oficial / Slogan
                </label>
                <input
                  type="text"
                  value={settings.store_slogan}
                  onChange={(e) => setSettings({ ...settings, store_slogan: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-cowboy border border-hairline text-xs focus:outline-none focus:border-charcoal"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-charcoal block mb-1 uppercase text-[10px]">
                    Número de WhatsApp Oficial (ej. 18091234567 o 18291234567)
                  </label>
                  <input
                    type="text"
                    value={settings.whatsapp_number}
                    onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-cowboy border border-hairline text-xs focus:outline-none focus:border-charcoal"
                  />
                </div>

                <div>
                  <label className="font-semibold text-charcoal block mb-1 uppercase text-[10px]">
                    Usuario de Instagram
                  </label>
                  <input
                    type="text"
                    value={settings.instagram_handle}
                    onChange={(e) => setSettings({ ...settings, instagram_handle: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-cowboy border border-hairline text-xs focus:outline-none focus:border-charcoal"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-charcoal block mb-1 uppercase text-[10px]">
                    Costo de Envío Estándar ($ COP)
                  </label>
                  <input
                    type="number"
                    value={settings.standard_shipping_fee}
                    onChange={(e) =>
                      setSettings({ ...settings, standard_shipping_fee: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2.5 rounded-cowboy border border-hairline text-xs focus:outline-none focus:border-charcoal"
                  />
                </div>

                <div>
                  <label className="font-semibold text-charcoal block mb-1 uppercase text-[10px]">
                    Umbral para Envío Gratis ($ COP)
                  </label>
                  <input
                    type="number"
                    value={settings.free_shipping_threshold}
                    onChange={(e) =>
                      setSettings({ ...settings, free_shipping_threshold: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2.5 rounded-cowboy border border-hairline text-xs focus:outline-none focus:border-charcoal"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-charcoal block mb-1 uppercase text-[10px]">
                  Texto del Cintillo de Anuncios
                </label>
                <input
                  type="text"
                  value={settings.announcement_text}
                  onChange={(e) => setSettings({ ...settings, announcement_text: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-cowboy border border-hairline text-xs focus:outline-none focus:border-charcoal"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSavingSettings}
                  className="btn-primary text-xs py-3 px-6 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavingSettings ? "Guardando..." : "Guardar Configuración"}</span>
                </button>
              </div>
            </form>
          </div>
        )}

      </div>

      {/* Product Edit / Create Modal */}
      {productModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-charcoal/50 backdrop-blur-sm flex items-start justify-center p-4 sm:p-6">
          <div className="bg-white w-full max-w-2xl rounded-cowboy border border-hairline shadow-2xl p-6 sm:p-8 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-hairline mb-6">
              <h3 className="font-editorial text-xl font-medium text-charcoal">
                {editingProduct.id ? "Editar Fragancia" : "Nueva Fragancia"}
              </h3>
              <button
                onClick={() => setProductModalOpen(false)}
                className="p-1.5 text-ash hover:text-charcoal rounded-full"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-charcoal uppercase text-[10px] block mb-1">
                    Nombre del Perfume *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full px-3 py-2 border border-hairline rounded text-xs"
                  />
                </div>

                <div>
                  <label className="font-semibold text-charcoal uppercase text-[10px] block mb-1">
                    Casa Olfativa *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProduct.brand_name || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, brand_name: e.target.value })}
                    className="w-full px-3 py-2 border border-hairline rounded text-xs"
                  />
                </div>

                <div>
                  <label className="font-semibold text-charcoal uppercase text-[10px] block mb-1">
                    Concentración
                  </label>
                  <select
                    value={editingProduct.concentration || "Eau de Parfum"}
                    onChange={(e) => setEditingProduct({ ...editingProduct, concentration: e.target.value })}
                    className="w-full px-3 py-2 border border-hairline rounded text-xs"
                  >
                    <option value="Eau de Parfum">Eau de Parfum</option>
                    <option value="Extrait de Parfum">Extrait de Parfum</option>
                    <option value="Pure Parfum">Pure Parfum</option>
                    <option value="Eau de Toilette">Eau de Toilette</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-charcoal uppercase text-[10px] block mb-1">
                    Familia Olfativa
                  </label>
                  <input
                    type="text"
                    value={editingProduct.olfactory_family || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, olfactory_family: e.target.value as any })}
                    placeholder="Ej. Ámbar Cálido & Especiado"
                    className="w-full px-3 py-2 border border-hairline rounded text-xs"
                  />
                </div>

                <div>
                  <label className="font-semibold text-charcoal uppercase text-[10px] block mb-1">
                    Precio Base Mínimo ($ COP) *
                  </label>
                  <input
                    type="number"
                    required
                    value={editingProduct.base_price || 35000}
                    onChange={(e) => setEditingProduct({ ...editingProduct, base_price: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-hairline rounded text-xs"
                  />
                </div>

                <div>
                  <label className="font-semibold text-charcoal uppercase text-[10px] block mb-1">
                    URL de Fotografía Principal
                  </label>
                  <input
                    type="url"
                    required
                    value={editingProduct.primary_image || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, primary_image: e.target.value })}
                    className="w-full px-3 py-2 border border-hairline rounded text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-charcoal uppercase text-[10px] block mb-1">
                  Resumen Corto para Catálogo
                </label>
                <textarea
                  rows={2}
                  value={editingProduct.short_description || ""}
                  onChange={(e) => setEditingProduct({ ...editingProduct, short_description: e.target.value })}
                  className="w-full px-3 py-2 border border-hairline rounded text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-charcoal uppercase text-[10px] block mb-1">
                  Descripción Detallada
                </label>
                <textarea
                  rows={3}
                  value={editingProduct.description || ""}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full px-3 py-2 border border-hairline rounded text-xs"
                />
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-charcoal">
                  <input
                    type="checkbox"
                    checked={editingProduct.featured || false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, featured: e.target.checked })}
                    className="rounded border-hairline"
                  />
                  <span>Destacar en Portada</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-medium text-charcoal">
                  <input
                    type="checkbox"
                    checked={editingProduct.is_bestseller || false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, is_bestseller: e.target.checked })}
                    className="rounded border-hairline"
                  />
                  <span>Insignia Bestseller</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-medium text-charcoal">
                  <input
                    type="checkbox"
                    checked={editingProduct.is_active !== false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, is_active: e.target.checked })}
                    className="rounded border-hairline"
                  />
                  <span>Activo para Compra</span>
                </label>
              </div>

              <div className="pt-6 border-t border-hairline flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="btn-secondary text-xs py-2 px-4"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSavingProduct}
                  className="btn-primary text-xs py-2 px-6"
                >
                  {isSavingProduct ? "Guardando..." : "Guardar Fragancia"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-charcoal/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-cowboy border border-hairline shadow-2xl p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 border-b border-hairline mb-4">
              <div>
                <h3 className="font-editorial text-lg font-medium text-charcoal">
                  Ficha de Orden {selectedOrder.reference}
                </h3>
                <span className="text-[11px] text-ash">{formatDate(selectedOrder.created_at)}</span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 text-ash hover:text-charcoal rounded-full"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 bg-mist/50 rounded border border-hairline">
                <p className="font-semibold text-charcoal">{selectedOrder.customer_name}</p>
                <p className="text-smoke">WhatsApp: {selectedOrder.customer_phone}</p>
                <p className="text-smoke">Dirección: {selectedOrder.shipping_address}, {selectedOrder.shipping_city}</p>
              </div>

              <div>
                <span className="font-semibold text-charcoal block mb-2 uppercase text-[10px]">
                  Productos en esta orden:
                </span>
                <div className="divide-y divide-hairline">
                  {selectedOrder.items.map((i, idx) => (
                    <div key={idx} className="py-2 flex justify-between">
                      <span>{i.product_name} ({i.variant_name}) x{i.quantity}</span>
                      <span className="font-semibold">{formatPrice(i.total_price)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-hairline flex justify-between font-bold text-sm">
                <span>Total Liquidado</span>
                <span>{formatPrice(selectedOrder.total)}</span>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="btn-primary text-xs py-2 px-5"
                >
                  Cerrar Ficha
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
