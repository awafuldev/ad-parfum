import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    const envPassword = process.env.ADMIN_PASSWORD;

    const isValid = envPassword
      ? password === envPassword
      : password === "ad2026";

    if (isValid) {
      const response = NextResponse.json({ success: true });
      response.cookies.set("ad_admin_session", "authenticated_token_ad_2026", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      });
      return response;
    }

    return NextResponse.json(
      { success: false, error: "Contraseña administrativa incorrecta." },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Error en el servidor de autenticación" },
      { status: 500 }
    );
  }
}
