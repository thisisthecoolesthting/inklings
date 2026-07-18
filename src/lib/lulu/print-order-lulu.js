/**
 * Inklings — Lulu print order adapter (same stack as StoryFawn).
 *
 * Environment variables:
 *   LULU_ENV, LULU_CLIENT_KEY, LULU_CLIENT_SECRET, LULU_SHIPPING_LEVEL (optional)
 */

"use strict";

const LULU_TOKEN_PATH = "/auth/realms/glasstree/protocol/openid-connect/token";
const TOKEN_REFRESH_BUFFER_MS = 60 * 1000;
const DEFAULT_TOKEN_EXPIRES_IN_SECONDS = 3600;
const POD_SQUARE_SOFTCOVER = "0850X0850.FC.PRE.SS.080CW444.GXX";

let cachedAccessToken = null;
let cachedAccessTokenExpiresAt = 0;

function getLuluBaseUrl() {
  return process.env.LULU_ENV === "prod" ? "https://api.lulu.com" : "https://api.sandbox.lulu.com";
}

function requireValue(value, name) {
  if (value === undefined || value === null || value === "") {
    throw new Error(`${name} is required`);
  }
  return value;
}

function responseSnippet(body) {
  return String(body || "").slice(0, 200);
}

async function fetchJson(url, options, label) {
  const res = await fetch(url, options);
  const body = await res.text().catch(() => "");

  if (!res.ok) {
    throw new Error(`${label} HTTP ${res.status}: ${responseSnippet(body)}`);
  }

  if (!body.trim()) return {};

  try {
    return JSON.parse(body);
  } catch {
    throw new Error(`${label} returned invalid JSON: ${responseSnippet(body)}`);
  }
}

function selectPodPackageId(pageCount) {
  const numericPageCount = Number(pageCount);
  if (!Number.isFinite(numericPageCount) || numericPageCount <= 0) {
    throw new Error("pageCount must be a positive number");
  }

  // Always softcover — matches pricing / marketing product promise.
  return POD_SQUARE_SOFTCOVER;
}

function mapShippingAddress(shipping) {
  requireValue(shipping, "shipping");

  return {
    name: requireValue(shipping.name, "shipping.name"),
    street1: requireValue(shipping.line1, "shipping.line1"),
    street2: shipping.line2 || undefined,
    city: requireValue(shipping.city, "shipping.city"),
    state_code: requireValue(shipping.state, "shipping.state"),
    postcode: requireValue(shipping.postal_code, "shipping.postal_code"),
    country_code: requireValue(shipping.country, "shipping.country"),
    phone_number: shipping.phone || undefined,
  };
}

async function getLuluToken() {
  const now = Date.now();
  if (cachedAccessToken && now < cachedAccessTokenExpiresAt - TOKEN_REFRESH_BUFFER_MS) {
    return cachedAccessToken;
  }

  const clientKey = requireValue(process.env.LULU_CLIENT_KEY, "LULU_CLIENT_KEY");
  const clientSecret = requireValue(process.env.LULU_CLIENT_SECRET, "LULU_CLIENT_SECRET");
  const auth = Buffer.from(`${clientKey}:${clientSecret}`).toString("base64");
  const body = new URLSearchParams({ grant_type: "client_credentials" });

  const json = await fetchJson(
    `${getLuluBaseUrl()}${LULU_TOKEN_PATH}`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    },
    "lulu token",
  );

  const accessToken = requireValue(json.access_token, "lulu token access_token");
  const expiresIn = Number(json.expires_in || DEFAULT_TOKEN_EXPIRES_IN_SECONDS);

  cachedAccessToken = accessToken;
  cachedAccessTokenExpiresAt = now + Math.max(0, expiresIn) * 1000;

  return cachedAccessToken;
}

async function submitPrintOrder({
  interiorPdfUrl,
  coverPdfUrl,
  pageCount,
  shipping,
  contactEmail,
  externalId,
  title,
} = {}) {
  requireValue(interiorPdfUrl, "interiorPdfUrl");
  requireValue(coverPdfUrl, "coverPdfUrl");
  requireValue(contactEmail, "contactEmail");
  requireValue(externalId, "externalId");

  const token = await getLuluToken();
  const payload = {
    external_id: externalId,
    contact_email: contactEmail,
    shipping_level: process.env.LULU_SHIPPING_LEVEL || "MAIL",
    line_items: [
      {
        external_id: externalId,
        title: title || "Inklings Storybook",
        quantity: 1,
        printable_normalization: {
          pod_package_id: selectPodPackageId(pageCount),
          cover: { source_url: coverPdfUrl },
          interior: { source_url: interiorPdfUrl },
        },
      },
    ],
    shipping_address: { ...mapShippingAddress(shipping), email: contactEmail },
  };

  const raw = await fetchJson(
    `${getLuluBaseUrl()}/print-jobs/`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
    "lulu print-job create",
  );

  return { jobId: raw.id, status: raw.status, raw };
}

async function getPrintJobStatus(jobId) {
  requireValue(jobId, "jobId");

  const token = await getLuluToken();
  const raw = await fetchJson(
    `${getLuluBaseUrl()}/print-jobs/${encodeURIComponent(jobId)}/`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
    "lulu print-job status",
  );

  return { status: raw.status, raw };
}

module.exports = {
  getLuluToken,
  submitPrintOrder,
  getPrintJobStatus,
};
