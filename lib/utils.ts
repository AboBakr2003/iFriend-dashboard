import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format: 23 March,2024
export const formatRegistrationDate = (iso: string): string => {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  const day = d.getDate()
  const month = d.toLocaleString("en-US", { month: "long" })
  const year = d.getFullYear()
  return `${day} ${month},${year}`
}
