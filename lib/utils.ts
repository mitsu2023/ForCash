import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Force le montant en négatif pour les dépenses, quelle que soit la valeur stockée. */
export function resolvedAmount(amount: number, type: string): number {
  return type === "EXPENSE" ? -Math.abs(amount) : amount
}
