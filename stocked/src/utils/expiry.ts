const MS_PER_DAY = 24 * 60 * 60 * 1000;

export type ExpiryStatus = "expired" | "soon" | "fresh";

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

/** Dagens dato + `days` dager, som "ÅÅÅÅ-MM-DD" (lokal tid). */
export function addDays(days: number, from: Date = new Date()) {
  const d = new Date(from.getFullYear(), from.getMonth(), from.getDate() + days);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function daysUntilExpiry(expiresAt: string, today: Date = new Date()) {
  const start = Date.UTC(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );

  return Math.round((Date.parse(expiresAt) - start) / MS_PER_DAY);
}

export function expiryStatus(
  expiresAt: string,
  soonDays = 3,
  today: Date = new Date(),
): ExpiryStatus {
  const days = daysUntilExpiry(expiresAt, today);

  if (days < 0) return "expired";
  if (days <= soonDays) return "soon";
  return "fresh";
}

export function expiryLabel(expiresAt: string, today: Date = new Date()) {
  const days = daysUntilExpiry(expiresAt, today);

  if (days < 0) {
    return `Utgått for ${-days} ${days === -1 ? "dag" : "dager"} siden`;
  }
  if (days === 0) return "Går ut i dag";
  if (days === 1) return "Går ut i morgen";
  return `Går ut om ${days} dager`;
}
