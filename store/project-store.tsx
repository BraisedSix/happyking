"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

export interface Project {
  id: number
  name: string
  description: string
  logo: string
  heatValue: number
  comments: number
  participants: number
  tokenReward: string
  category: string
  isVerified: boolean
  createdAt: string
  tokenSymbol?: string
}

// 初始项目数据
const initialProjects: Project[] = [
  {
    id: 1,
    name: "MetaVerse DAO",
    description: "A decentralized autonomous organization for metaverse governance",
    logo: "/placeholder.svg?key=x9jj3",
    heatValue: 9823,
    comments: 156,
    participants: 1245,
    tokenReward: "500 MVT",
    category: "DAO",
    isVerified: true,
    createdAt: "2023-04-15T10:30:00Z",
  },
  {
    id: 2,
    name: "DeFi Pulse",
    description: "Real-time analytics and rankings of DeFi protocols",
    logo: "/placeholder.svg?key=5ruu7",
    heatValue: 8756,
    comments: 132,
    participants: 987,
    tokenReward: "300 DFP",
    category: "DeFi",
    isVerified: true,
    createdAt: "2023-04-14T08:45:00Z",
  },
  {
    id: 3,
    name: "NFT Marketplace",
    description: "Create, buy, and sell unique digital assets",
    logo: "/placeholder.svg?key=my0ix",
    heatValue: 7654,
    comments: 98,
    participants: 765,
    tokenReward: "200 NFTM",
    category: "NFT",
    isVerified: false,
    createdAt: "2023-04-13T14:20:00Z",
  },
  {
    id: 4,
    name: "GameFi World",
    description: "Play-to-earn blockchain games ecosystem",
    logo: "/placeholder.svg?key=d70kh",
    heatValue: 6543,
    comments: 87,
    participants: 654,
    tokenReward: "400 GFW",
    category: "GameFi",
    isVerified: true,
    createdAt: "2023-04-12T11:15:00Z",
  },
  {
    id: 5,
    name: "Crypto Exchange",
    description: "Next-generation decentralized exchange with low fees",
    logo: "/placeholder.svg?key=mcat9",
    heatValue: 5432,
    comments: 76,
    participants: 543,
    tokenReward: "250 CEX",
    category: "Exchange",
    isVerified: true,
    createdAt: "2023-04-11T09:30:00Z",
  },
  {
    id: 6,
    name: "AI Protocol",
    description: "Decentralized artificial intelligence marketplace",
    logo: "/placeholder.svg?key=c67zp",
    heatValue: 4321,
    comments: 65,
    participants: 432,
    tokenReward: "150 AIP",
    category: "AI",
    isVerified: false,
    createdAt: "2023-04-10T16:45:00Z",
  },
  {
    id: 7,
    name: "Privacy Chain",
    description: "Zero-knowledge proof blockchain for privacy-focused applications",
    logo: "/placeholder.svg?key=sqbzd",
    heatValue: 3210,
    comments: 54,
    participants: 321,
    tokenReward: "100 PRC",
    category: "Privacy",
    isVerified: false,
    createdAt: "2023-04-09T13:20:00Z",
  },
  {
    id: 8,
    name: "Social Token",
    description: "Tokenized social media platform with creator rewards",
    logo: "/placeholder.svg?key=pv0f3",
    heatValue: 2987,
    comments: 43,
    participants: 298,
    tokenReward: "350 SOT",
    category: "Social",
    isVerified: true,
    createdAt: "2023-04-08T10:15:00Z",
  },
  {
    id: 9,
    name: "Infrastructure Protocol",
    description: "Scalable blockchain infrastructure for Web3 applications",
    logo: "/placeholder.svg?key=k8e23",
    heatValue: 2765,
    comments: 38,
    participants: 276,
    tokenReward: "200 INP",
    category: "Infrastructure",
    isVerified: true,
    createdAt: "2023-04-07T14:30:00Z",
  },
  {
    id: 10,
    name: "Metaverse Land",
    description: "Virtual real estate platform in the metaverse",
    logo: "/placeholder.svg?key=z082t",
    heatValue: 2543,
    comments: 32,
    participants: 254,
    tokenReward: "180 MVL",
    category: "Metaverse",
    isVerified: false,
    createdAt: "2023-04-06T09:45:00Z",
  },
  {
    id: 11,
    name: "DeFi Lending",
    description: "Decentralized lending and borrowing platform",
    logo: "/placeholder.svg?key=bk24e",
    heatValue: 2321,
    comments: 29,
    participants: 232,
    tokenReward: "120 DFL",
    category: "DeFi",
    isVerified: true,
    createdAt: "2023-04-05T11:30:00Z",
  },
  {
    id: 12,
    name: "NFT Gaming",
    description: "Gaming platform with NFT integration and play-to-earn mechanics",
    logo: "/placeholder.svg?key=b948q",
    heatValue: 2109,
    comments: 26,
    participants: 210,
    tokenReward: "150 NFG",
    category: "GameFi",
    isVerified: false,
    createdAt: "2023-04-04T15:20:00Z",
  },
]

// 创建上下文
type ProjectStoreContextType = {
  projects: Project[]
  addProject: (project: Omit<Project, "id" | "heatValue" | "comments" | "participants" | "createdAt">) => void
  getProject: (id: number) => Project | undefined
}

const ProjectStoreContext = createContext<ProjectStoreContextType>({
  projects: initialProjects,
  addProject: () => {},
  getProject: () => undefined,
})

// 本地存储键
const STORAGE_KEY = "happy-king-projects"

// Provider 组件
export function ProjectStoreProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(initialProjects)

  // 从本地存储加载项目
  useEffect(() => {
    const loadProjects = () => {
      if (typeof window !== "undefined") {
        const savedProjects = localStorage.getItem(STORAGE_KEY)
        if (savedProjects) {
          try {
            setProjects(JSON.parse(savedProjects))
          } catch (error) {
            console.error("Failed to parse saved projects:", error)
          }
        }
      }
    }

    loadProjects()
  }, [])

  // 保存项目到本地存储
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects))
    }
  }, [projects])

  // 添加新项目
  const addProject = (project: Omit<Project, "id" | "heatValue" | "comments" | "participants" | "createdAt">) => {
    const newProject: Project = {
      ...project,
      id: projects.length > 0 ? Math.max(...projects.map((p) => p.id)) + 1 : 1,
      heatValue: Math.floor(Math.random() * 3000) + 1000, // 随机热度值
      comments: Math.floor(Math.random() * 50) + 10, // 随机评论数
      participants: Math.floor(Math.random() * 300) + 100, // 随机参与者数量
      createdAt: new Date().toISOString(), // 当前时间
    }

    setProjects((prev) => [newProject, ...prev])
  }

  // 获取指定 ID 的项目
  const getProject = (id: number) => {
    return projects.find((p) => p.id === id)
  }

  return (
    <ProjectStoreContext.Provider value={{ projects, addProject, getProject }}>{children}</ProjectStoreContext.Provider>
  )
}

// 自定义 Hook 以使用项目存储
export const useProjectStore = () => useContext(ProjectStoreContext)
