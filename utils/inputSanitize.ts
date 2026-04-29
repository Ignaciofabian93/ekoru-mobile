export const sanitizeInput = (input: string): string => {
  // Strip non-printable / control characters (safe at every keystroke).
  let sanitized = input.replace(/[\x00-\x1F\x7F]/g, "");

  // Collapse runs of 2+ spaces into one (keeps a trailing space so the user
  // can still type "First Last" without the space being eaten mid-entry).
  sanitized = sanitized.replace(/ {2,}/g, " ");

  // Remove only leading whitespace; trailing trim happens at submit time so
  // we don't block the user from typing a space between words.
  sanitized = sanitized.replace(/^\s+/, "");

  return sanitized;
};

export const sanitizeEmail = (email: string): string => {
  // Trim whitespace, collapse internal spaces, and normalise to lowercase.
  // Intentionally does NOT validate format — the field shows an inline error
  // via isEmailValid() so the user can keep typing without a thrown exception.
  return email.trim().replace(/\s+/g, "").toLowerCase();
};

/**
 * Final trim applied at submit time (not during typing) so trailing spaces
 * entered mid-word don't get stripped while the user is still composing.
 */
export const sanitizeOnSubmit = (input: string): string => input.trim().replace(/\s+/g, " ");
