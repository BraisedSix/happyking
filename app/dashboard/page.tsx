"use client"

import { useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import { useWallet } from "@/contexts/wallet-context"
import { useRouter } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  FlameIcon as Fire,
  MessageSquare,
  Users,
  Award,
  Plus,
  Wallet,
  ArrowUpRight,
  CheckCircle2,
  Clock,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// Mock data for user's projects
const userProjects = [
  {
    id: 1,
    name: "MetaVerse DAO",
    description: "A decentralized autonomous organization for metaverse governance",
    logo: "/placeholder.svg?key=bogbq",
    heatValue: 9823,
    comments: 156,
    participants: 1245,
    tokenReward: "500 MVT",
    category: "DAO",
    isVerified: true,
    joinedAt: "2023-04-16T10:30:00Z",
    tasksCompleted: 2,
    totalTasks: 4,
    earnedRewards: "15 MVT",
  },
  {
    id: 3,
    name: "NFT Marketplace",
    description: "Create, buy, and sell unique digital assets",
    logo: "/placeholder.svg?key=7cpo4",
    heatValue: 7654,
    comments: 98,
    participants: 765,
    tokenReward: "200 NFTM",
    category: "NFT",
    isVerified: false,
    joinedAt: "2023-04-18T14:45:00Z",
    tasksCompleted: 1,
    totalTasks: 3,
    earnedRewards: "5 NFTM",
  },
]

// Mock data for user's created projects
const createdProjects = [
  {
    id: 7,
    name: "Privacy Chain",
    description: "Zero-knowledge proof blockchain for privacy-focused applications",
    logo: "/placeholder.svg?height=80&width=80&query=abstract logo with P letter",
    heatValue: 3210,
    comments: 54,
    participants: 321,
    tokenReward: "100 PRC",
    category: "Privacy",
    isVerified: false,
    createdAt: "2023-04-10T09:15:00Z",
    status: "active",
    dailyRank: 12,
  },
]

// Mock data for user's rewards
const userRewards = [
  {
    id: 1,
    projectName: "MetaVerse DAO",
    projectLogo: "/placeholder.svg?key=bxdm9",
    amount: "15 MVT",
    timestamp: "2023-04-17T16:30:00Z",
    task: "Join Discord community & Participate in governance voting",
  },
  {
    id: 2,
    projectName: "NFT Marketplace",
    projectLogo: "/placeholder.svg?key=8xryf",
    amount: "5 NFTM",
    timestamp: "2023-04-19T11:20:00Z",
    task: "Share project on Twitter",
  },
]

export default function Dashboard() {
  const { t } = useLanguage()
  const { address, connectWallet } = useWallet()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("joined")

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (!address) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
        <Header />

        <main className="container mx-auto flex min-h-[calc(100vh-200px)] flex-col items-center justify-center px-4 py-12">
          <div className="text-center">
            <Wallet className="mx-auto mb-6 h-16 w-16 text-gray-400" />
            <h1 className="mb-4 text-3xl font-bold">Connect Your Wallet</h1>
            <p className="mb-8 max-w-md text-gray-400">
              You need to connect your wallet to access your dashboard and participate in projects.
            </p>
            <Button
              onClick={connectWallet}
              className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white hover:from-cyan-600 hover:to-purple-700"
              size="lg"
            >
              Connect Wallet
            </Button>
          </div>
        </main>

        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-400">Manage your projects and track your rewards</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
          <div>
            <Tabs defaultValue="joined" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="joined">Joined Projects</TabsTrigger>
                <TabsTrigger value="created">Created Projects</TabsTrigger>
                <TabsTrigger value="rewards">Rewards</TabsTrigger>
              </TabsList>

              <TabsContent value="joined" className="mt-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-bold">Projects You've Joined</h2>
                  <Button
                    onClick={() => router.push("/projects")}
                    variant="outline"
                    className="border-gray-700 bg-black/50 text-white hover:bg-gray-900"
                  >
                    Explore More Projects
                  </Button>
                </div>

                {userProjects.length > 0 ? (
                  <div className="grid gap-6 sm:grid-cols-2">
                    {userProjects.map((project) => (
                      <Link href={`/projects/${project.id}`} key={project.id}>
                        <Card className="h-full overflow-hidden border-gray-800 bg-black/50 transition-all duration-200 hover:border-cyan-900 hover:shadow-lg hover:shadow-cyan-900/20">
                          <CardHeader className="pb-2">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center space-x-3">
                                <Image
                                  src={project.logo || "/placeholder.svg"}
                                  alt={project.name}
                                  width={40}
                                  height={40}
                                  className="rounded-md"
                                />
                                <div>
                                  <CardTitle className="flex items-center text-lg text-white">
                                    {project.name}
                                    {project.isVerified && (
                                      <Badge
                                        variant="outline"
                                        className="ml-2 border-cyan-500 bg-cyan-500/10 text-cyan-400"
                                      >
                                        {t("verified")}
                                      </Badge>
                                    )}
                                  </CardTitle>
                                  <Badge variant="secondary" className="mt-1">
                                    {project.category}
                                  </Badge>
                                </div>
                              </div>
                              <div className="flex items-center space-x-1 rounded-full bg-purple-500/10 px-2 py-1 text-xs font-medium text-purple-400">
                                <Fire className="h-3 w-3" />
                                <span>{project.heatValue.toLocaleString()}</span>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="mt-4">
                              <div className="mb-2 flex items-center justify-between text-sm">
                                <span className="text-gray-400">Tasks Completed</span>
                                <span>
                                  {project.tasksCompleted}/{project.totalTasks}
                                </span>
                              </div>
                              <div className="h-2 overflow-hidden rounded-full bg-gray-800">
                                <div
                                  className="h-full bg-gradient-to-r from-cyan-500 to-purple-600"
                                  style={{ width: `${(project.tasksCompleted / project.totalTasks) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                            <div className="mt-4 flex items-center justify-between">
                              <div className="text-sm text-gray-400">
                                <span>Joined: {formatDate(project.joinedAt)}</span>
                              </div>
                              <div className="flex items-center space-x-1 text-sm font-medium text-green-400">
                                <Award className="h-4 w-4" />
                                <span>Earned: {project.earnedRewards}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Card className="border-gray-800 bg-black/50">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <div className="rounded-full bg-gray-800/50 p-4">
                        <Users className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="mt-4 text-xl font-medium">No Projects Joined Yet</h3>
                      <p className="mt-2 text-center text-gray-400">
                        Explore and join projects to earn rewards and participate in the community.
                      </p>
                      <Button
                        onClick={() => router.push("/projects")}
                        className="mt-6 bg-gradient-to-r from-cyan-500 to-purple-600 text-white hover:from-cyan-600 hover:to-purple-700"
                      >
                        Explore Projects
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="created" className="mt-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-bold">Projects You've Created</h2>
                  <Button
                    onClick={() => router.push("/create")}
                    variant="outline"
                    className="border-gray-700 bg-black/50 text-white hover:bg-gray-900"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Project
                  </Button>
                </div>

                {createdProjects.length > 0 ? (
                  <div className="grid gap-6 sm:grid-cols-2">
                    {createdProjects.map((project) => (
                      <Link href={`/projects/${project.id}`} key={project.id}>
                        <Card className="h-full overflow-hidden border-gray-800 bg-black/50 transition-all duration-200 hover:border-cyan-900 hover:shadow-lg hover:shadow-cyan-900/20">
                          <CardHeader className="pb-2">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center space-x-3">
                                <Image
                                  src={project.logo || "/placeholder.svg"}
                                  alt={project.name}
                                  width={40}
                                  height={40}
                                  className="rounded-md"
                                />
                                <div>
                                  <CardTitle className="flex items-center text-lg text-white">
                                    {project.name}
                                    {project.isVerified && (
                                      <Badge
                                        variant="outline"
                                        className="ml-2 border-cyan-500 bg-cyan-500/10 text-cyan-400"
                                      >
                                        {t("verified")}
                                      </Badge>
                                    )}
                                  </CardTitle>
                                  <Badge variant="secondary" className="mt-1">
                                    {project.category}
                                  </Badge>
                                </div>
                              </div>
                              <Badge variant="outline" className="border-green-500 bg-green-500/10 text-green-400">
                                {project.status}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                              <div className="rounded-lg bg-black/30 p-2">
                                <div className="text-lg font-bold">{project.participants}</div>
                                <div className="text-xs text-gray-400">Participants</div>
                              </div>
                              <div className="rounded-lg bg-black/30 p-2">
                                <div className="text-lg font-bold">{project.comments}</div>
                                <div className="text-xs text-gray-400">Comments</div>
                              </div>
                              <div className="rounded-lg bg-black/30 p-2">
                                <div className="flex items-center justify-center text-lg font-bold text-purple-400">
                                  <Fire className="mr-1 h-4 w-4" />
                                  {project.heatValue}
                                </div>
                                <div className="text-xs text-gray-400">Heat Value</div>
                              </div>
                            </div>
                            <div className="mt-4 flex items-center justify-between">
                              <div className="text-sm text-gray-400">
                                <span>Created: {formatDate(project.createdAt)}</span>
                              </div>
                              <div className="flex items-center space-x-1 rounded-full bg-purple-500/10 px-2 py-1 text-xs font-medium">
                                <span>Daily Rank: #{project.dailyRank}</span>
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter className="border-t border-gray-800 pt-4">
                            <Button
                              className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white hover:from-cyan-600 hover:to-purple-700"
                              size="sm"
                            >
                              Manage Project
                            </Button>
                          </CardFooter>
                        </Card>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Card className="border-gray-800 bg-black/50">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <div className="rounded-full bg-gray-800/50 p-4">
                        <Plus className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="mt-4 text-xl font-medium">No Projects Created Yet</h3>
                      <p className="mt-2 text-center text-gray-400">
                        Create your first project to start building your community and offering rewards.
                      </p>
                      <Button
                        onClick={() => router.push("/create")}
                        className="mt-6 bg-gradient-to-r from-cyan-500 to-purple-600 text-white hover:from-cyan-600 hover:to-purple-700"
                      >
                        Create Project
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="rewards" className="mt-6">
                <div className="mb-4">
                  <h2 className="text-xl font-bold">Your Rewards</h2>
                  <p className="text-gray-400">Tokens earned from participating in projects</p>
                </div>

                {userRewards.length > 0 ? (
                  <Card className="border-gray-800 bg-black/50">
                    <CardContent className="py-6">
                      <div className="space-y-4">
                        {userRewards.map((reward) => (
                          <div
                            key={reward.id}
                            className="flex items-center justify-between border-b border-gray-800 pb-4 last:border-0 last:pb-0"
                          >
                            <div className="flex items-center space-x-3">
                              <Image
                                src={reward.projectLogo || "/placeholder.svg"}
                                alt={reward.projectName}
                                width={32}
                                height={32}
                                className="rounded-md"
                              />
                              <div>
                                <p className="font-medium">{reward.projectName}</p>
                                <p className="text-sm text-gray-400">{reward.task}</p>
                                <p className="text-xs text-gray-500">{formatDate(reward.timestamp)}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-1 rounded-full bg-green-500/10 px-3 py-1 text-sm font-medium text-green-400">
                              <Award className="mr-1 h-4 w-4" />
                              <span>{reward.amount}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="border-gray-800 bg-black/50">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <div className="rounded-full bg-gray-800/50 p-4">
                        <Award className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="mt-4 text-xl font-medium">No Rewards Yet</h3>
                      <p className="mt-2 text-center text-gray-400">
                        Complete tasks in projects you've joined to earn token rewards.
                      </p>
                      <Button
                        onClick={() => router.push("/projects")}
                        className="mt-6 bg-gradient-to-r from-cyan-500 to-purple-600 text-white hover:from-cyan-600 hover:to-purple-700"
                      >
                        Explore Projects
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            {/* Wallet Card */}
            <Card className="border-gray-800 bg-black/50">
              <CardHeader>
                <CardTitle>Your Wallet</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg bg-gradient-to-r from-cyan-900/20 to-purple-900/20 p-4">
                  <p className="mb-1 text-sm text-gray-400">Connected Address</p>
                  <p className="font-mono text-sm">
                    {address.substring(0, 6)}...{address.substring(address.length - 4)}
                  </p>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">ETH Balance</span>
                      <span className="font-bold">0.5 ETH</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">MVT Tokens</span>
                      <span className="font-bold text-green-400">15 MVT</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">NFTM Tokens</span>
                      <span className="font-bold text-green-400">5 NFTM</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-700 bg-black/50 text-white hover:bg-gray-900"
                  >
                    View on Etherscan
                    <ArrowUpRight className="ml-2 h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Activity Card */}
            <Card className="border-gray-800 bg-black/50">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="rounded-full bg-green-500/10 p-1">
                      <CheckCircle2 className="h-4 w-4 text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Task Completed</p>
                      <p className="text-xs text-gray-400">You completed a task in MetaVerse DAO</p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="rounded-full bg-purple-500/10 p-1">
                      <MessageSquare className="h-4 w-4 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Comment Posted</p>
                      <p className="text-xs text-gray-400">You commented on NFT Marketplace</p>
                      <p className="text-xs text-gray-500">5 hours ago</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="rounded-full bg-cyan-500/10 p-1">
                      <Users className="h-4 w-4 text-cyan-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Project Joined</p>
                      <p className="text-xs text-gray-400">You joined NFT Marketplace</p>
                      <p className="text-xs text-gray-500">1 day ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Daily Ranking Card */}
            <Card className="border-gray-800 bg-black/50">
              <CardHeader>
                <CardTitle>Daily Rankings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-lg bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 p-3">
                    <div className="flex items-center space-x-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-500 text-xs font-bold text-black">
                        1
                      </div>
                      <span>MetaVerse DAO</span>
                    </div>
                    <div className="flex items-center space-x-1 text-yellow-400">
                      <Fire className="h-4 w-4" />
                      <span>9823</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-lg bg-gradient-to-r from-gray-400/10 to-gray-500/10 p-3">
                    <div className="flex items-center space-x-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-400 text-xs font-bold text-black">
                        2
                      </div>
                      <span>DeFi Pulse</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-400">
                      <Fire className="h-4 w-4" />
                      <span>8756</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-lg bg-gradient-to-r from-amber-600/10 to-amber-700/10 p-3">
                    <div className="flex items-center space-x-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-600 text-xs font-bold text-black">
                        3
                      </div>
                      <span>NFT Marketplace</span>
                    </div>
                    <div className="flex items-center space-x-1 text-amber-400">
                      <Fire className="h-4 w-4" />
                      <span>7654</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between rounded-lg border border-gray-800 bg-black/30 p-3">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">Resets in 8h 23m</span>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 text-xs">
                    View All
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
