import { NextRequest, NextResponse } from "next/server";
import { createOrder, getOrders } from "@/lib/storage";

export async function GET(req: NextRequest) {
  try {
    const orders = await getOrders();
    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { success: false, error: "Error al recuperar órdenes" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const result = await createOrder({
      customer_name: body.customer_name,
      customer_email: body.customer_email || "",
      customer_phone: body.customer_phone,
      shipping_address: body.shipping_address,
      shipping_city: body.shipping_city,
      shipping_department: body.shipping_department || "Colombia",
      delivery_notes: body.delivery_notes,
      shipping_method: body.shipping_method || "standard",
      payment_method: body.payment_method || "contra_entrega",
      items: body.items || [],
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, order: result.order }, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { success: false, error: "Error interno al procesar el pedido." },
      { status: 500 }
    );
  }
}
