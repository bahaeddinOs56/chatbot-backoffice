export interface QAPair {
  id: number | string
  question: string
  answer: string
  category_id: number | string
  enabled?: boolean
  is_active?: boolean // Add this line to support both property names
  created_at?: string
  updated_at?: string
}

export interface Category {
  id: string | number
  name: string
  description?: string
  qa_pairs_count?: number // Add this property for category management
}

export interface GeneralSettings {
  bot_name: string
  welcome_message: string
  fallback_message: string
}

export interface AppearanceSettings {
  id?: string
  primary_color: string
  logo_url: string | null
  dark_mode: boolean
  position: "bottom-right" | "bottom-left" | "top-right" | "top-left"
}

export interface LanguageSettings {
  default_language: string
  enable_multi_language: boolean
  supported_languages: string[]
}

export interface User {
  id: string
  name: string
  email: string
  is_admin: boolean
  created_at?: string
  updated_at?: string
}

