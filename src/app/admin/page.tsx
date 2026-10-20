import React from "react";
import { getAllProductsAdmin, getBrands, getCategories, getOrders, getStoreSettings } from "@/lib/storage";
import { AdminDashboardClient } from "@/components/admin/AdminDashboardClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Panel de Control Administrativo | A&D Parfum",
  description: "Panel de administración y gestión de inventario y pedidos de A&D Parfum.",
};

export default async function AdminPage() {
  const [products, orders, settings, brands, categories] = await Promise.all([
    getAllProductsAdmin(),
    getOrders(),
    getStoreSettings(),
    getBrands(),
    getCategories(),
  ]);

  return (
    <AdminDashboardClient
      initialProducts={products}
      initialOrders={orders}
      initialSettings={settings}
      brands={brands}
      categories={categories}
    />
  );
}
