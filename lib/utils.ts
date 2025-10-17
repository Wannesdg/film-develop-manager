import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a date string or Date object to day/month/year format
 * @param date - The date to format (string or Date object)
 * @param formatStr - The format string (defaults to 'dd/MM/yyyy')
 * @returns Formatted date string
 */
export function formatDate(date: string | Date, formatStr = 'dd/MM/yyyy'): string {
  return format(new Date(date), formatStr)
}
