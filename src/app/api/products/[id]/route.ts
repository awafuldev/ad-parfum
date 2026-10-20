import { NextRequest, NextResponse } from "next/server";
import { deleteProduct, getProductById, upsertProduct } from "@/lib/storage";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await getProductById(params.id);
    if (!product) {
      return NextResponse.json(
        { success: false, error: "Producto no encontrado" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, product });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Error al obtener producto" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const updated = await upsertProduct({
      ...body,
      id: params.id,
    });

    return NextResponse.json({ success: true, product: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Error al actualizar producto" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deleted = await deleteProduct(params.id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "No se encontró el producto a eliminar" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Error al eliminar producto" },
      { status: 500 }
    );
  }
}
