"use client";

import { Trash2 } from "lucide-react";
import { deleteChild } from "./actions";

export function DeleteChildButton({ id, name }: { id: string; name: string }) {
  async function handleDelete() {
    if (window.confirm(`Are you sure you want to delete ${name}? This will remove all their stories and characters.`)) {
      const formData = new FormData();
      formData.append("id", id);
      await deleteChild(formData);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      aria-label={`Remove ${name}`}
      className="text-ink-500 hover:text-coral"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
