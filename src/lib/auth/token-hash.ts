import { createHash } from "node:crypto";

/**
 * Deterministic one-way hash of a magic-link token for at-rest storage.
 *
 * The full JWT is emailed to the user; only this SHA-256 digest is persisted
 * in MagicLink.tokenHash. On verify we hash the presented token and compare.
 * Read access to the database therefore never exposes a usable token.
 *
 * (Previously the code stored `token.slice(-32)` — i.e. 32 raw chars of the
 * live JWT — which meant DB read access let an attacker reconstruct/forge the
 * one-time link. This replaces that.)
 */
export function hashToken(token: string): string {
  return createHash("sha256").update(token, "utf8").digest("hex");
}
