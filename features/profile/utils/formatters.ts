export const formatInitials = (displayName: string): string => {
  const formatted: string = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return formatted;
};
