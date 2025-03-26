import createMiddleware from "next-intl/middleware"
import { locales, defaultLocale } from "@/app/config/i18n"

export default createMiddleware({
  // A list of all locales that are supported
  locales,
  // The default locale to use when visiting a non-localized route
  defaultLocale,
  // Redirect to the default locale if no locale is detected
  localeDetection: true,
})

export const config = {
  // Match all pathnames except for
  // - files with extensions (e.g. static files)
  // - api routes
  // - _next paths (Next.js internals)
  matcher: ["/((?!api|_next|.*\\..*).*)"],
}

