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
      className="-mr-2 -mt-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-button text-ink-500 hover:text-coral focus-visible:outline focus-visible:outline-2 focus-visible:outline-coral"
    >
      <Trash2 className="h-5 w-5" aria-hidden />
    </button>
  );
}
