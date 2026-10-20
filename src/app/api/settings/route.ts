import { NextRequest, NextResponse } from "next/server";
import { getStoreSettings, updateStoreSettings } from "@/lib/storage";

export async function GET() {
  try {
    const settings = await getStoreSettings();
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Error al obtener configuración" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const updated = await updateStoreSettings(body);
    return NextResponse.json({ success: true, settings: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Error al actualizar configuración" },
      { status: 500 }
    );
  }
}
