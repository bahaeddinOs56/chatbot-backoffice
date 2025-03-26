"use client"

import { Globe } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu"
import { useLanguage } from "@/app/contexts/language-context"
import { locales } from "@/app/config/i18n"

const languageNames: Record<string, string> = {
  en: "English",
  fr: "Français",
  es: "Español",
  ar: "العربية",
}

export function LanguageSelector() {
  const { locale, setLocale } = useLanguage()

  const handleLanguageChange = (lang: string) => {
    console.log(`Changing language to: ${lang}`)
    setLocale(lang)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Globe className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Select Language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((lang) => (
          <DropdownMenuItem
            key={lang}
            onClick={() => handleLanguageChange(lang)}
            className={locale === lang ? "bg-muted font-medium" : ""}
          >
            {languageNames[lang] || lang}
            {locale === lang && " ✓"}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

