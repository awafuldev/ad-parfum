import { NextRequest, NextResponse } from "next/server";
import { getAllProductsAdmin, getProducts, upsertProduct } from "@/lib/storage";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const isAdmin = searchParams.get("admin") === "true";

    const products = isAdmin
      ? await getAllProductsAdmin()
      : await getProducts({
          category: searchParams.get("category") || undefined,
          brand: searchParams.get("brand") || undefined,
          family: searchParams.get("family") || undefined,
          search: searchParams.get("search") || undefined,
          featuredOnly: searchParams.get("featured") === "true",
          bestsellerOnly: searchParams.get("bestseller") === "true",
        });

    return NextResponse.json({ success: true, products });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Error al obtener productos" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name || !body.brand_name || !body.base_price) {
      return NextResponse.json(
        { success: false, error: "Nombre, marca y precio base son obligatorios." },
        { status: 400 }
      );
    }

    const created = await upsertProduct(body);
    return NextResponse.json({ success: true, product: created }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Error al crear producto" },
      { status: 500 }
    );
  }
}
