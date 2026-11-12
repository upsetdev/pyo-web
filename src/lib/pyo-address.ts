// The reader's own Pyo address, so the docs' examples can use it. Kept only in
// this browser's localStorage: nothing is sent anywhere.
import { useSyncExternalStore } from "react";

const KEY = "pyo-docs-address";
const EVENT = "pyo-address";

const HOST =
  /^(localhost|(\d{1,3}\.){3}\d{1,3}|([a-z0-9]([a-z0-9-]*[a-z0-9])?\.)+[a-z0-9-]*[a-z][a-z0-9-]*)(:\d{1,5})?$/;

/**
 * An origin, like https://pyo.example.com or http://100.64.0.1:8000, from what
 * the reader typed: https:// when no scheme, without a path or a trailing
 * slash. `null` unless it's http or https with a plausible host.
 */
export function normalizeAddress(input: string): string | null {
  let value = input.trim();
  if (!value) return null;
  if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(value)) value = `https://${value}`;
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return null;
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return null;
  if (url.username || url.password) return null;
  const host = url.host.toLowerCase();
  return HOST.test(host) ? `${url.protocol}//${host}` : null;
}

export function getAddress(): string | null {
  try {
    const saved = localStorage.getItem(KEY);
    if (!saved || saved.includes("://")) return saved;
    // Saved before the scheme was kept: a host alone means https.
    const origin = normalizeAddress(saved);
    if (origin) writeAddress(origin);
    else localStorage.removeItem(KEY);
    return origin;
  } catch {
    return null;
  }
}

function writeAddress(origin: string | null) {
  if (origin) localStorage.setItem(KEY, origin);
  else localStorage.removeItem(KEY);
}

export function setAddress(origin: string | null) {
  writeAddress(origin);
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(onChange: () => void) {
  const onStorage = (e: StorageEvent) => e.key === KEY && onChange();
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onStorage);
  };
}

/** The saved address; `null` on the server and while hydrating. */
export function usePyoAddress(): string | null {
  return useSyncExternalStore(subscribe, getAddress, () => null);
}
