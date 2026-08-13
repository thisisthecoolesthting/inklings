"use client";

import { useState } from "react";
import { KID_CHARACTER_PICKS } from "@/lib/series-bible";
import { createCharacter } from "./actions";

export function CharacterMaker({ childId, childName }: { childId: string; childName: string }) {
  const [species, setSpecies] = useState<string>(KID_CHARACTER_PICKS.species[0].id);
  const [color, setColor] = useState<string>(KID_CHARACTER_PICKS.colors[0].id);
  const [traits, setTraits] = useState<string[]>(["kind"]);
  const [pending, setPending] = useState(false);

  function toggleTrait(id: string) {
    setTraits((cur) => {
      if (cur.includes(id)) return cur.filter((t) => t !== id);
      if (cur.length >= 2) return [cur[1], id];
      return [...cur, id];
    });
  }

  return (
    <form
      action={createCharacter}
      onSubmit={() => setPending(true)}
      className="mx-auto max-w-xl space-y-8"
    >
      <input type="hidden" name="childId" value={childId} />
      <input type="hidden" name="species" value={species} />
      <input type="hidden" name="color" value={color} />
      <input type="hidden" name="personality" value={traits.join(",")} />

      <div>
        <label htmlFor="name" className="block text-xl font-bold text-ink">
          What&apos;s their name?
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          maxLength={30}
          autoComplete="off"
          className="mt-2 w-full rounded-2xl border-2 border-ink-100 bg-white px-5 py-4 text-2xl focus:border-coral focus:outline-none"
          placeholder="Biscuit"
        />
      </div>

      <fieldset>
        <legend className="text-xl font-bold text-ink">What are they?</legend>
        <div className="mt-3 grid grid-cols-4 gap-2">
          {KID_CHARACTER_PICKS.species.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSpecies(s.id)}
              className={
                "flex min-h-[88px] flex-col items-center justify-center rounded-2xl border-2 bg-white text-base font-bold " +
                (species === s.id ? "border-coral bg-coral/10 ring-2 ring-coral" : "border-ink-100")
              }
            >
              <span className="text-3xl" aria-hidden>
                {s.emoji}
              </span>
              {s.label}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-xl font-bold text-ink">Favorite color?</legend>
        <div className="mt-3 flex flex-wrap gap-3">
          {KID_CHARACTER_PICKS.colors.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setColor(c.id)}
              aria-label={c.label}
              className={
                "h-14 w-14 rounded-full border-4 " +
                (color === c.id ? "border-ink scale-110" : "border-white shadow")
              }
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-xl font-bold text-ink">What are they like? (pick 1 or 2)</legend>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {KID_CHARACTER_PICKS.traits.map((t) => {
            const on = traits.includes(t.id);
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => toggleTrait(t.id)}
                className={
                  "flex min-h-[64px] items-center justify-center gap-2 rounded-2xl border-2 text-lg font-bold " +
                  (on ? "border-coral bg-coral/10" : "border-ink-100 bg-white")
                }
              >
                <span aria-hidden>{t.emoji}</span>
                {t.label}
              </button>
            );
          })}
        </div>
      </fieldset>

      <button type="submit" disabled={pending} className="big-button">
        {pending ? "Saving…" : "Save my friend"}
      </button>
      <p className="text-center text-sm text-ink-500">
        A grown-up will peek at {childName}&apos;s new friend. Then they can star in the next book!
      </p>
    </form>
  );
}
