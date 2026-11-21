import { NextRequest, NextResponse } from "next/server";
import { loginAction } from "@/actions/auth";
import type { LoginInput } from "@/lib/validations/auth-schema";

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (origin !== request.nextUrl.origin) {
    return NextResponse.json({ success: false, message: "Reload the sign-in page and try again." }, { status: 403 });
  }

  let input: LoginInput;
  try {
    input = await request.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid sign-in request." }, { status: 400 });
  }

  const { success, message } = await loginAction(input);
  return NextResponse.json({ success, message });
}
