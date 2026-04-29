export const sanitizeInput = (input: string): string => {
  // Remove leading and trailing whitespace
  let sanitized = input.trim();

  // Replace multiple spaces with a single space
  sanitized = sanitized.replace(/\s+/g, " ");

  // Optionally, you can also remove any non-printable characters
  sanitized = sanitized.replace(/[\x00-\x1F\x7F]/g, "");

  return sanitized;
};

export const sanitizeEmail = (email: string): string => {
  // Trim whitespace and convert to lowercase
  const sanitizedEmail = email.trim().toLowerCase();

  // Check email format (basic validation)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(sanitizedEmail)) {
    throw new Error("Invalid email format");
  }

  return sanitizedEmail;
};
