"use client"

import type React from "react"
import { ThemeProvider } from "./components/theme-provider"
import { Toaster } from "./components/ui/toaster"
import { LanguageProvider } from "./contexts/language-context"
import { defaultLocale } from "./config/i18n"
import { AuthProvider } from "../lib/auth-context"
import { CompanyProvider } from "./contexts/CompanyContext"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <LanguageProvider defaultLocale={defaultLocale}>
        <AuthProvider>
          <CompanyProvider>
            {children}
            <Toaster />
          </CompanyProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}

