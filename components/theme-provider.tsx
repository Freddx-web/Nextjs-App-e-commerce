"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"
// You can extend ThemeProviderProps if you need to add more props
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // You can customize the ThemeProvider here if needed
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
