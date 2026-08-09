export function normalizarWhatsapp(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10) return digits;
  if (digits.length === 12 && digits.startsWith("57")) return digits.slice(2);
  return null;
}
