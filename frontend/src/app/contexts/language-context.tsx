"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { locales, defaultLocale } from "@/app/config/i18n"

// Import all translation files statically
import enMessages from "@/app/messages/en.json"
import frMessages from "@/app/messages/fr.json"
import esMessages from "@/app/messages/es.json"
import arMessages from "@/app/messages/ar.json"

// Create a map of all translations
const translationsMap = {
  en: enMessages,
  fr: frMessages,
  es: esMessages,
  ar: arMessages,
}

type LanguageContextType = {
  locale: string
  setLocale: (locale: string) => void
  messages: Record<string, any>
  dir: "ltr" | "rtl"
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({
  children,
  defaultLocale: initialLocale = defaultLocale,
}: {
  children: ReactNode
  defaultLocale?: string
  defaultMessages?: Record<string, any>
}) {
  const [locale, setLocaleState] = useState(initialLocale)
  const [messages, setMessages] = useState(
    translationsMap[initialLocale as keyof typeof translationsMap] || translationsMap.en,
  )
  const [dir, setDir] = useState<"ltr" | "rtl">(initialLocale === "ar" ? "rtl" : "ltr")

  // Initialize locale from localStorage on client side
  useEffect(() => {
    const savedLocale = localStorage.getItem("locale")
    if (savedLocale && locales.includes(savedLocale as any)) {
      console.log(`Loading saved locale from localStorage: ${savedLocale}`)
      setLocaleState(savedLocale)
      setDir(savedLocale === "ar" ? "rtl" : "ltr")
      setMessages(translationsMap[savedLocale as keyof typeof translationsMap] || translationsMap.en)
    }
  }, [])

  const setLocale = (newLocale: string): void => {
    console.log(`Setting locale to: ${newLocale}`)

    if (!locales.includes(newLocale as any)) {
      console.warn(`Invalid locale: ${newLocale}, defaulting to ${defaultLocale}`)
      newLocale = defaultLocale
    }

    try {
      // Get messages for the new locale from our static map
      const newMessages = translationsMap[newLocale as keyof typeof translationsMap]
      if (!newMessages) {
        throw new Error(`No translations found for locale: ${newLocale}`)
      }

      console.log(`Successfully loaded messages for ${newLocale}:`, newMessages)

      // Update state
      setMessages(newMessages)
      setLocaleState(newLocale)
      setDir(newLocale === "ar" ? "rtl" : "ltr")

      // Store the selected locale in localStorage
      localStorage.setItem("locale", newLocale)
      console.log(`Saved locale to localStorage: ${newLocale}`)

      // Force a hard refresh to ensure all components re-render with the new locale
      window.location.href = window.location.pathname
    } catch (error) {
      console.error(`Failed to load messages for locale: ${newLocale}`, error)
    }
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale, messages, dir }}>
      <div dir={dir} lang={locale} className="h-full">
        {children}
      </div>
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

export function useTranslation(namespace: string) {
  const { messages, locale } = useLanguage()

  const t = (key: string, params?: Record<string, string>) => {
    try {
      // Check if the namespace exists
      if (!messages[namespace]) {
        console.warn(`Namespace "${namespace}" not found in translations for locale ${locale}`)
        return key
      }

      // Check if the key exists in the namespace
      let translation = messages[namespace][key]
      if (translation === undefined) {
        console.warn(`Translation key "${key}" not found in namespace "${namespace}" for locale ${locale}`)
        return key
      }

      // Simple parameter replacement
      if (params) {
        Object.entries(params).forEach(([paramKey, paramValue]) => {
          translation = translation.replace(`{{${paramKey}}}`, paramValue)
        })
      }

      return translation
    } catch (error) {
      console.error(`Translation error for key "${key}" in namespace "${namespace}":`, error)
      return key
    }
  }

  return { t, locale }
}

