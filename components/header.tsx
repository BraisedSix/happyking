"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { useWallet } from "@/contexts/wallet-context"
import { Menu, X, Globe, ChevronDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import NetworkSwitch from "@/components/network-switch"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { language, setLanguage, t } = useLanguage()
  const { address, balance, connectWallet, disconnectWallet, isCorrectNetwork, switchToPharosNetwork } = useWallet()
  const router = useRouter()

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  const formatAddress = (address: string) => {
    if (!address) return ""
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const handleSwitchNetwork = useCallback(() => {
    switchToPharosNetwork()
  }, [switchToPharosNetwork])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-black/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/logo.png" alt="Happy King" width={40} height={40} className="h-10 w-10" />
            <span className="bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-2xl font-bold text-transparent">
              Happy King
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden items-center space-x-6 md:flex">
          <Link href="/projects" className="text-sm font-medium text-gray-200 transition-colors hover:text-white">
            {t("allProjects")}
          </Link>
          <Link href="/create" className="text-sm font-medium text-gray-200 transition-colors hover:text-white">
            {t("createProject")}
          </Link>
          <Link href="/dashboard" className="text-sm font-medium text-gray-200 transition-colors hover:text-white">
            {t("dashboard")}
          </Link>
        </nav>

        <div className="hidden items-center space-x-4 md:flex">
          {/* Language Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                <Globe className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setLanguage("en")}>English {language === "en" && "✓"}</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage("zh")}>中文 {language === "zh" && "✓"}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Wallet Connection */}
          {address ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "h-9 border-cyan-800/50 bg-black/50",
                    isCorrectNetwork ? "text-cyan-400" : "text-orange-400",
                  )}
                >
                  <span className="mr-2">{formatAddress(address)}</span>
                  {!isCorrectNetwork && <span className="mr-2 h-2 w-2 rounded-full bg-orange-500"></span>}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="text-xs">{balance} ETH</DropdownMenuItem>
                {!isCorrectNetwork && (
                  <DropdownMenuItem className="text-orange-400" onClick={handleSwitchNetwork}>
                    Switch to Pharos Network
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => router.push("/dashboard")}>{t("dashboard")}</DropdownMenuItem>
                <DropdownMenuItem onClick={disconnectWallet}>{t("disconnect")}</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <NetworkSwitch>
              <Button
                onClick={connectWallet}
                className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white hover:from-cyan-600 hover:to-purple-700"
              >
                {t("connectWallet")}
              </Button>
            </NetworkSwitch>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white md:hidden"
          onClick={toggleMenu}
        >
          <span className="sr-only">Open main menu</span>
          {isMenuOpen ? (
            <X className="block h-6 w-6" aria-hidden="true" />
          ) : (
            <Menu className="block h-6 w-6" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={cn("md:hidden", isMenuOpen ? "block" : "hidden")}>
        <div className="space-y-1 px-2 pb-3 pt-2">
          <Link
            href="/projects"
            className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-800 hover:text-white"
            onClick={toggleMenu}
          >
            {t("allProjects")}
          </Link>
          <Link
            href="/create"
            className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-800 hover:text-white"
            onClick={toggleMenu}
          >
            {t("createProject")}
          </Link>
          <Link
            href="/dashboard"
            className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-800 hover:text-white"
            onClick={toggleMenu}
          >
            {t("dashboard")}
          </Link>
          <div className="flex items-center justify-between px-3 py-2">
            <Button variant="ghost" size="sm" onClick={() => setLanguage(language === "en" ? "zh" : "en")}>
              <Globe className="mr-2 h-4 w-4" />
              {language === "en" ? "English" : "中文"}
            </Button>
            {address ? (
              <Button
                variant="outline"
                size="sm"
                className={cn("border-cyan-800/50 bg-black/50", isCorrectNetwork ? "text-cyan-400" : "text-orange-400")}
                onClick={!isCorrectNetwork ? handleSwitchNetwork : disconnectWallet}
              >
                {!isCorrectNetwork ? "Switch Network" : formatAddress(address)}
              </Button>
            ) : (
              <NetworkSwitch>
                <Button
                  size="sm"
                  onClick={connectWallet}
                  className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white hover:from-cyan-600 hover:to-purple-700"
                >
                  {t("connectWallet")}
                </Button>
              </NetworkSwitch>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
