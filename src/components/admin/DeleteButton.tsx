"use client";

import { Trash2 } from "lucide-react";

interface DeleteButtonProps {
  action: (formData: FormData) => Promise<void>;
  id: string;
  label?: string;
}

export default function DeleteButton({ action, id, label = "Supprimer" }: DeleteButtonProps) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm("Etes-vous sur de vouloir supprimer cet element ?")) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="flex items-center gap-1 text-sm text-red-600 hover:text-red-800 transition-colors"
      >
        <Trash2 size={14} />
        {label}
      </button>
    </form>
  );
}
