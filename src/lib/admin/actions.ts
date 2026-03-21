"use server";

import { redirect } from "next/navigation";
import { verifyPassword, createSession, clearSession } from "./auth";

export async function loginAction(
  _prevState: { error?: string } | null,
  formData: FormData
): Promise<{ error?: string }> {
  const password = formData.get("password") as string;

  if (!password || !verifyPassword(password)) {
    return { error: "Mot de passe incorrect" };
  }

  await createSession();
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  await clearSession();
  redirect("/admin/login");
}
