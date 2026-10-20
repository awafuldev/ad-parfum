import { NextRequest, NextResponse } from "next/server";
import { getOrderById, updateOrderStatus } from "@/lib/storage";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const order = await getOrderById(params.id);
    if (!order) {
      return NextResponse.json(
        { success: false, error: "Pedido no encontrado" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, order });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Error recuperando el pedido" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { status, payment_status } = body;

    const updated = await updateOrderStatus(params.id, status, payment_status);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "No se pudo actualizar el pedido" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Error al actualizar estado del pedido" },
      { status: 500 }
    );
  }
}
