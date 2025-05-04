"use client"

import { useLanguage } from "@/contexts/language-context"
import Link from "next/link"
import { Twitter, Github, DiscIcon as Discord } from "lucide-react"

export default function Footer() {
  const { t } = useLanguage()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-gray-800 bg-black py-12">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Happy King</h3>
            <p className="text-sm text-gray-400">{t("footerDescription")}</p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-white">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white">
                <Discord className="h-5 w-5" />
                <span className="sr-only">Discord</span>
              </Link>
            </div>
          </div>

          <div>
            <h4 className="mb-4 font-medium text-white">{t("platform")}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/projects" className="text-gray-400 hover:text-white">
                  {t("allProjects")}
                </Link>
              </li>
              <li>
                <Link href="/create" className="text-gray-400 hover:text-white">
                  {t("createProject")}
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-gray-400 hover:text-white">
                  {t("dashboard")}
                </Link>
              </li>
              <li>
                <Link href="/leaderboard" className="text-gray-400 hover:text-white">
                  {t("leaderboard")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-medium text-white">{t("resources")}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/docs" className="text-gray-400 hover:text-white">
                  {t("documentation")}
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-white">
                  {t("faq")}
                </Link>
              </li>
              <li>
                <Link href="/tutorials" className="text-gray-400 hover:text-white">
                  {t("tutorials")}
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-white">
                  {t("blog")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-medium text-white">{t("legal")}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white">
                  {t("termsOfService")}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white">
                  {t("privacyPolicy")}
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-gray-400 hover:text-white">
                  {t("cookiesPolicy")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
          <p>
            &copy; {currentYear} Happy King. {t("allRightsReserved")}
          </p>
        </div>
      </div>
    </footer>
  )
}
