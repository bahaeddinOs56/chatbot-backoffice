"use client"

// Replace the import from next-intl/client with the correct import for next-intl
import { useTranslations as useNextIntlTranslations, useLocale as useNextIntlLocale } from "next-intl"

// Export the hooks that we can use throughout the application
export const useLocale = useNextIntlLocale
export const useTranslations = useNextIntlTranslations

export function getTranslation(locale: string, namespace: string, key: string, messages: any): string {
  try {
    return messages[namespace][key] || key
  } catch (error) {
    return key
  }
}

