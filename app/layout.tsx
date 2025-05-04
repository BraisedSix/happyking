import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/contexts/language-context"
import { WalletProvider } from "@/contexts/wallet-context"
import { ProjectStoreProvider } from "@/store/project-store"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import type React from "react"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Happy King - Web3 社区平台",
  description: "发现和参与最热门的 Web3 项目",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <ProjectStoreProvider>
            <LanguageProvider>
              <WalletProvider>{children}</WalletProvider>
            </LanguageProvider>
          </ProjectStoreProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
