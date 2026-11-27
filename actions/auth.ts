"use server";

import { redirect } from "next/navigation";
import { loginSchema, LoginInput } from "@/lib/validations/auth-schema";
import { authenticateUser, createSession, destroySession, getSession, hasSecureAdminConfiguration, SessionUser } from "@/lib/auth";

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: SessionUser;
}

export async function loginAction(input: LoginInput): Promise<AuthResponse> {
  try {
    if (!hasSecureAdminConfiguration) {
      console.error("Staff sign-in configuration incomplete", {
        adminPassword: (process.env.ADMIN_PASSWORD?.length ?? 0) >= 12 ? "valid length" : "missing or too short",
        sessionSecret: (process.env.SESSION_SECRET?.length ?? 0) >= 32 ? "valid length" : "missing or too short",
      });
      return {
        success: false,
        message: "Staff sign-in is unavailable. Ask your site administrator to check the deployment's sign-in settings.",
      };
    }

    const validated = loginSchema.safeParse(input);
    if (!validated.success) {
      return {
        success: false,
        message: validated.error.errors[0]?.message || "Invalid input data",
      };
    }

    const { email, password, rememberMe } = validated.data;
    const user = await authenticateUser(email, password);

    if (!user) {
      return {
        success: false,
        message: "Invalid email or password. Please check your credentials.",
      };
    }

    await createSession(user, rememberMe);

    return {
      success: true,
      message: `Welcome back, ${user.name}!`,
      user,
    };
  } catch (error) {
    console.error("Login action error:", error);
    return {
      success: false,
      message: "An unexpected error occurred during authentication. Please try again.",
    };
  }
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  return await getSession();
}
