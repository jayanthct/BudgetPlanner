// src/lib/formatters.ts

export function formatINR(amount: number): string {
  // Use Intl.NumberFormat for Indian Rupee format
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0, // We want whole numbers usually
  }).format(amount);
}

export function parseINR(value: string): number {
  // Remove all non-numeric characters except maybe decimal point, but we are dealing with integers mostly.
  const numericString = value.replace(/[^0-9]/g, '');
  return parseInt(numericString, 10) || 0;
}
