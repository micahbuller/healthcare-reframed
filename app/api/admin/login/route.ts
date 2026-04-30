import { createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    const adminPassword = process.env.ADMIN_ANALYTICS_PASSWORD;

    if (!adminPassword || !password || password !== adminPassword) {
      // Use constant-time comparison to avoid timing attacks
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    // Hash the password — this becomes the cookie value that middleware validates
    const tokenValue = createHash("sha256").update(adminPassword).digest("hex");

    const response = NextResponse.json({ success: true });
    response.cookies.set("admin_auth", tokenValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
