import { getTranslations as getNextIntlTranslations, getLocale as getNextIntlLocale } from "next-intl/server"

// Export the functions that we can use in server components
export const getLocale = getNextIntlLocale
export const getTranslations = getNextIntlTranslations

// Add a simple getMessages function for compatibility
export async function getMessages(locale: string) {
  // You can implement custom logic to load messages based on locale
  // For example, dynamic imports of JSON files
  try {
    const messages = await import(`@/app/messages/${locale}.json`)
    return messages.default || messages
  } catch (error) {
    console.error(`Failed to load messages for locale: ${locale}`, error)
    // Fallback to English or empty object
    try {
      const fallbackMessages = await import("@/app/messages/en.json")
      return fallbackMessages.default || fallbackMessages
    } catch {
      return {}
    }
  }
}

// Add a simple formatter function if needed
export function getFormatter() {
  return {
    format: (value: any) => String(value),
  }
}

