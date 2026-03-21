"use client";

import { useActionState } from "react";
import { loginAction } from "@/lib/admin/actions";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-moselle-cream p-4">
      <div className="w-full max-w-sm paper-texture bg-moselle-white rounded-2xl p-8 shadow-lg">
        <div className="text-center mb-8">
          <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-moselle-green">
            Taste of Moselle
          </h1>
          <p className="text-moselle-text-light mt-1">Administration</p>
        </div>

        <form action={formAction} className="space-y-4">
          {state?.error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-xl text-sm">
              {state.error}
            </div>
          )}

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-moselle-text mb-1">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              name="password"
              required
              autoFocus
              className="w-full border-2 border-moselle-cream-dark bg-moselle-white rounded-xl px-4 py-3 focus:border-moselle-green focus:ring-2 focus:ring-moselle-green/20 outline-none transition-colors"
              placeholder="Entrez le mot de passe..."
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-moselle-green text-white py-3 rounded-xl font-semibold hover:bg-moselle-green/90 transition-colors disabled:opacity-50"
          >
            {isPending ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
