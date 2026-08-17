// Visitors type phone numbers freely ("07734 217299", "+44 7734-217299"), so
// strip everything a tel: URI can't carry while keeping a leading +.
export function telHref(phone: string): string {
  const cleaned = phone.replace(/[^\d+]/g, "");
  const normalised = cleaned.startsWith("+")
    ? `+${cleaned.slice(1).replace(/\+/g, "")}`
    : cleaned.replace(/\+/g, "");

  return `tel:${normalised}`;
}
