import type React from "react"
import "@/app/globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/contexts/theme-context"
import { Navbar } from "@/components/navbar"
import { AuthProvider } from "@/contexts/auth-context"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "UniTools - All-in-one Developer Toolkit",
  description:
    "Your all-in-one platform for developer productivity tools. Simplify your workflow with our collection of powerful utilities including text formatting, file conversion, and media generation.",
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider defaultTheme="system">
          <AuthProvider>
            <div className="relative flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1 px-4 sm:px-6 lg:px-8">{children}</main>
              <footer className="py-6 px-4 sm:px-6 lg:px-8">
                <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
                  <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                    © 2025 UniTools. All rights reserved.
                  </p>
                </div>
              </footer>
            </div>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'