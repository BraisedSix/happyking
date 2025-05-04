"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Define translations
const translations = {
  en: {
    // Header
    allProjects: "All Projects",
    createProject: "Create Project",
    dashboard: "Dashboard",
    connectWallet: "Connect Wallet",
    disconnect: "Disconnect",

    // Hero
    heroTitle1: "Discover the Future of",
    heroTitle2: "Web3 Communities",
    heroDescription:
      "Join Happy King, the premier platform for discovering and participating in the most exciting Web3 projects.",
    exploreProjects: "Explore Projects",
    createProject: "Create Project",
    projectsLaunched: "{{count}} Projects Launched",
    activeUsers: "{{count}} Active Users",

    // Projects
    trendingProjects: "Trending Projects",
    trendingProjectsDescription: "The hottest projects based on user engagement",
    recommendedProjects: "Recommended Projects",
    recommendedProjectsDescription: "Curated projects with high potential",
    daily: "Daily",
    weekly: "Weekly",
    monthly: "Monthly",
    verified: "Verified",
    sponsored: "Sponsored",
    viewAllProjects: "View All Projects",

    // Footer
    footerDescription:
      "The premier Web3 community platform for discovering and participating in exciting blockchain projects.",
    platform: "Platform",
    resources: "Resources",
    legal: "Legal",
    documentation: "Documentation",
    faq: "FAQ",
    tutorials: "Tutorials",
    blog: "Blog",
    termsOfService: "Terms of Service",
    privacyPolicy: "Privacy Policy",
    cookiesPolicy: "Cookies Policy",
    leaderboard: "Leaderboard",
    allRightsReserved: "All rights reserved.",

    // Project Creation
    projectName: "Project Name",
    projectDescription: "Project Description",
    projectCategory: "Category",
    tokenAmount: "Token Amount",
    createFee: "Creation Fee: 20 USDT + Tokens",
    connectSmartContract: "Connect to Smart Contract",
    submitProject: "Submit Project",

    // Project Details
    joinProject: "Join Project",
    leaveProject: "Leave Project",
    participants: "Participants",
    comments: "Comments",
    heatValue: "Heat Value",
    tokenReward: "Token Reward",
    tasks: "Tasks",
    writeComment: "Write a comment...",
    postComment: "Post",

    // Project List Page
    discoverAndParticipate: "Discover and participate in exciting Web3 projects",
    searchProjects: "Search projects...",
    filters: "Filters",
    category: "Category",
    allCategories: "All Categories",
    timeframe: "Timeframe",
    allTime: "All Time",
    today: "Today",
    thisWeek: "This Week",
    thisMonth: "This Month",
    verifiedOnly: "Verified Only",
    sortByHeat: "Sort by Heat",
    sortByNewest: "Sort by Newest",
    noProjectsFound: "No Projects Found",
    tryDifferentSearch: "Try a different search term or filter combination",
    clearFilters: "Clear Filters",
    showing: "Showing",
    of: "of",
    projects: "projects",
  },
  zh: {
    // 头部
    allProjects: "所有项目",
    createProject: "创建项目",
    dashboard: "仪表盘",
    connectWallet: "连接钱包",
    disconnect: "断开连接",

    // 首页横幅
    heroTitle1: "探索",
    heroTitle2: "Web3社区的未来",
    heroDescription: "加入Happy King，发现并参与最令人兴奋的Web3项目的首选平台。",
    exploreProjects: "探索项目",
    createProject: "创建项目",
    projectsLaunched: "已启动{{count}}个项目",
    activeUsers: "{{count}}活跃用户",

    // 项目
    trendingProjects: "热门项目",
    trendingProjectsDescription: "基于用户参与度的最热门项目",
    recommendedProjects: "推荐项目",
    recommendedProjectsDescription: "精选的高潜力项目",
    daily: "每日",
    weekly: "每周",
    monthly: "每月",
    verified: "已验证",
    sponsored: "赞助",
    viewAllProjects: "查看所有项目",

    // 页脚
    footerDescription: "发现并参与令人兴奋的区块链项目的首选Web3社区平台。",
    platform: "平台",
    resources: "资源",
    legal: "法律",
    documentation: "文档",
    faq: "常见问题",
    tutorials: "教程",
    blog: "博客",
    termsOfService: "服务条款",
    privacyPolicy: "隐私政策",
    cookiesPolicy: "Cookie政策",
    leaderboard: "排行榜",
    allRightsReserved: "版权所有。",

    // 项目创建
    projectName: "项目名称",
    projectDescription: "项目描述",
    projectCategory: "类别",
    tokenAmount: "代币数量",
    createFee: "创建费用：20 USDT + 代币",
    connectSmartContract: "连接到智能合约",
    submitProject: "提交项目",

    // 项目详情
    joinProject: "加入项目",
    leaveProject: "离开项目",
    participants: "参与者",
    comments: "评论",
    heatValue: "热度值",
    tokenReward: "代币奖励",
    tasks: "任务",
    writeComment: "写评论...",
    postComment: "发布",

    // 项目列表页面
    discoverAndParticipate: "发现并参与令人兴奋的Web3项目",
    searchProjects: "搜索项目...",
    filters: "筛选",
    category: "类别",
    allCategories: "所有类别",
    timeframe: "时间范围",
    allTime: "所有时间",
    today: "今天",
    thisWeek: "本周",
    thisMonth: "本月",
    verifiedOnly: "仅已验证",
    sortByHeat: "按热度排序",
    sortByNewest: "按最新排序",
    noProjectsFound: "未找到项目",
    tryDifferentSearch: "尝试不同的搜索词或筛选组合",
    clearFilters: "清除筛选",
    showing: "显示",
    of: "共",
    projects: "个项目",
  },
}

// Helper function to replace placeholders in translations
const replacePlaceholders = (text: string, values: Record<string, string>) => {
  if (!text) return ""
  return text.replace(/\{\{(\w+)\}\}/g, (_, key) => values[key] || "")
}

// Create context
type LanguageContextType = {
  language: string
  setLanguage: (lang: string) => void
  t: (key: string, values?: Record<string, string>) => string
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: () => "",
})

// Provider component
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState("en")

  // Load saved language preference from localStorage on client side
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language")
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }
  }, [])

  // Save language preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("language", language)
  }, [language])

  // Translation function
  const t = (key: string, values: Record<string, string> = {}) => {
    const translation = translations[language as keyof typeof translations]
    const text = translation[key as keyof typeof translation]
    return replacePlaceholders((text as string) || key, values)
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

// Custom hook to use the language context
export const useLanguage = () => useContext(LanguageContext)
