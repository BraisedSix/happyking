"use client"

import type React from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLanguage } from "@/contexts/language-context"
import { useWallet } from "@/contexts/wallet-context"
import { useProjectStore } from "@/store/project-store"
import {
    Award,
    Calendar,
    CheckCircle2,
    Clock,
    FlameIcon as Fire,
    Heart,
    MessageSquare,
    Send,
    Share2,
    ThumbsUp,
    Users,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

// 评论类型定义
interface Comment {
  id: number
  user: {
    address: string
    name: string
    avatar?: string
  }
  text: string
  timestamp: string
  likes: number
  isLiked?: boolean
}

// 任务类型定义
interface Task {
  id: number
  title: string
  description: string
  reward: string
  completed: number
  status: string
}

export default function ProjectDetailClient({ projectId }: { projectId: number }) {
  const { t } = useLanguage()
  const { address, connectWallet } = useWallet()
  const router = useRouter()
  const { getProject } = useProjectStore()

  const [activeTab, setActiveTab] = useState("overview")
  const [isParticipating, setIsParticipating] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [comments, setComments] = useState<Comment[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [projectData, setProjectData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  // 获取项目数据
  useEffect(() => {
    const fetchProject = async () => {
      setIsLoading(true)
      try {
        const project = getProject(projectId)

        if (project) {
          // 设置项目数据
          setProjectData({
            ...project,
            banner: "/placeholder.svg?key=zayuk",
            website: "https://example.com",
            twitter: "https://twitter.com/example",
            discord: "https://discord.gg/example",
            contractAddress: "0x1234567890abcdef1234567890abcdef12345678",
            creator: {
              address: "0xabcdef1234567890abcdef1234567890abcdef12",
              name: "Project Creator",
              avatar: "/abstract-avatar.png",
            },
          })

          // 设置初始点赞数
          setLikeCount(Math.floor(Math.random() * 100) + 10)

          // 生成模拟任务
          const mockTasks = [
            {
              id: 1,
              title: "Join our Discord community",
              description: "Participate in discussions and provide feedback",
              reward: `5 ${project.tokenSymbol || "TOKEN"}`,
              completed: Math.floor(Math.random() * 500) + 100,
              status: "active",
            },
            {
              id: 2,
              title: "Share our project on Twitter",
              description: "Help us spread the word about our project",
              reward: `10 ${project.tokenSymbol || "TOKEN"}`,
              completed: Math.floor(Math.random() * 300) + 50,
              status: "active",
            },
            {
              id: 3,
              title: "Participate in governance voting",
              description: "Vote on the upcoming proposals",
              reward: `15 ${project.tokenSymbol || "TOKEN"}`,
              completed: Math.floor(Math.random() * 200) + 30,
              status: "active",
            },
            {
              id: 4,
              title: "Refer new members",
              description: "Invite friends to join our community",
              reward: `20 ${project.tokenSymbol || "TOKEN"} per referral`,
              completed: Math.floor(Math.random() * 100) + 20,
              status: "active",
            },
          ]
          setTasks(mockTasks)

          // 生成模拟评论
          const mockComments = [
            {
              id: 1,
              user: {
                address: "0x7890abcdef1234567890abcdef1234567890abcd",
                name: "CryptoEnthusiast",
                avatar: "/abstract-avatar-1.png",
              },
              text: "This project has a lot of potential! I'm excited to see how it evolves.",
              timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
              likes: 42,
              isLiked: false,
            },
            {
              id: 2,
              user: {
                address: "0x3456789012abcdef3456789012abcdef34567890",
                name: "BlockchainDev",
                avatar: "/abstract-avatar-2.png",
              },
              text: "Just completed my first task and received the tokens. The process was smooth!",
              timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
              likes: 28,
              isLiked: false,
            },
            {
              id: 3,
              user: {
                address: "0x9012345678abcdef9012345678abcdef90123456",
                name: "Web3Explorer",
                avatar: "/abstract-avatar-3.png",
              },
              text: "The community is very active and helpful. Looking forward to participating more.",
              timestamp: new Date(Date.now() - 3600000 * 5).toISOString(), // 5 hours ago
              likes: 35,
              isLiked: false,
            },
          ]
          setComments(mockComments)
        } else {
          // 如果找不到项目，重定向到项目列表页
          router.push("/projects")
        }
      } catch (error) {
        console.error("Error fetching project:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProject()
  }, [projectId, getProject, router])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const handleParticipate = async () => {
    if (!address) {
      await connectWallet()
      return
    }

    // 切换参与状态
    setIsParticipating(!isParticipating)
  }

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || !address) return

    // 添加新评论
    const newCommentObj: Comment = {
      id: comments.length + 1,
      user: {
        address: address,
        name: address.substring(0, 6) + "..." + address.substring(address.length - 4),
        avatar: undefined,
      },
      text: newComment,
      timestamp: new Date().toISOString(),
      likes: 0,
      isLiked: false,
    }

    setComments([newCommentObj, ...comments])
    setNewComment("")
  }

  const handleLikeComment = (commentId: number) => {
    if (!address) {
      connectWallet()
      return
    }

    setComments(
      comments.map((comment) => {
        if (comment.id === commentId) {
          const newIsLiked = !comment.isLiked
          return {
            ...comment,
            likes: newIsLiked ? comment.likes + 1 : comment.likes - 1,
            isLiked: newIsLiked,
          }
        }
        return comment
      }),
    )
  }

  const handleLikeProject = () => {
    if (!address) {
      connectWallet()
      return
    }

    setIsLiked(!isLiked)
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1)
  }

  if (isLoading || !projectData) {
    return (
      <main className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-8">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent"></div>
          <p className="mt-4 text-lg">Loading project...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Project Banner */}
      <div className="relative mb-8 h-[200px] w-full overflow-hidden rounded-xl sm:h-[300px]">
        <Image
          src={projectData.banner || "/placeholder.svg"}
          alt={projectData.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>

        <div className="absolute bottom-0 left-0 flex w-full items-end p-6">
          <div className="flex items-center">
            <Image
              src={projectData.logo || "/placeholder.svg"}
              alt={projectData.name}
              width={80}
              height={80}
              className="rounded-xl border-2 border-gray-800 bg-black"
            />
            <div className="ml-4">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-white sm:text-3xl">{projectData.name}</h1>
                {projectData.isVerified && (
                  <Badge variant="outline" className="ml-2 border-cyan-500 bg-cyan-500/10 text-cyan-400">
                    {t("verified")}
                  </Badge>
                )}
              </div>
              <div className="mt-1 flex items-center space-x-3">
                <Badge variant="secondary">{projectData.category}</Badge>
                <div className="flex items-center text-sm text-gray-400">
                  <Calendar className="mr-1 h-4 w-4" />
                  {formatDate(projectData.createdAt)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
        <div>
          {/* Project Tabs */}
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              <TabsTrigger value="comments">Comments</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <Card className="border-gray-800 bg-black/50">
                <CardHeader>
                  <CardTitle>About {projectData.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">{projectData.description}</p>

                  <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <div className="flex flex-col items-center rounded-lg border border-gray-800 bg-black/30 p-3">
                      <Fire className="mb-2 h-5 w-5 text-purple-400" />
                      <span className="text-lg font-bold">{projectData.heatValue.toLocaleString()}</span>
                      <span className="text-xs text-gray-400">{t("heatValue")}</span>
                    </div>
                    <div className="flex flex-col items-center rounded-lg border border-gray-800 bg-black/30 p-3">
                      <Users className="mb-2 h-5 w-5 text-cyan-400" />
                      <span className="text-lg font-bold">{projectData.participants.toLocaleString()}</span>
                      <span className="text-xs text-gray-400">{t("participants")}</span>
                    </div>
                    <div className="flex flex-col items-center rounded-lg border border-gray-800 bg-black/30 p-3">
                      <MessageSquare className="mb-2 h-5 w-5 text-green-400" />
                      <span className="text-lg font-bold">{comments.length}</span>
                      <span className="text-xs text-gray-400">{t("comments")}</span>
                    </div>
                    <div className="flex flex-col items-center rounded-lg border border-gray-800 bg-black/30 p-3">
                      <Award className="mb-2 h-5 w-5 text-yellow-400" />
                      <span className="text-lg font-bold">{projectData.tokenReward}</span>
                      <span className="text-xs text-gray-400">{t("tokenReward")}</span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="mb-2 text-lg font-medium">Creator</h3>
                    <div className="flex items-center space-x-3 rounded-lg border border-gray-800 bg-black/30 p-3">
                      <Avatar>
                        <AvatarImage
                          src={projectData.creator.avatar || "/placeholder.svg"}
                          alt={projectData.creator.name}
                        />
                        <AvatarFallback>{projectData.creator.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{projectData.creator.name}</p>
                        <p className="text-xs text-gray-400">
                          {projectData.creator.address.substring(0, 6)}...
                          {projectData.creator.address.substring(projectData.creator.address.length - 4)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="mb-2 text-lg font-medium">Contract Address</h3>
                    <div className="rounded-lg border border-gray-800 bg-black/30 p-3">
                      <p className="break-all font-mono text-sm text-gray-300">{projectData.contractAddress}</p>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    {projectData.website && (
                      <Link
                        href={projectData.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center rounded-full border border-gray-800 bg-black/30 px-4 py-2 text-sm hover:bg-gray-800"
                      >
                        Website
                      </Link>
                    )}
                    {projectData.twitter && (
                      <Link
                        href={projectData.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center rounded-full border border-gray-800 bg-black/30 px-4 py-2 text-sm hover:bg-gray-800"
                      >
                        Twitter
                      </Link>
                    )}
                    {projectData.discord && (
                      <Link
                        href={projectData.discord}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center rounded-full border border-gray-800 bg-black/30 px-4 py-2 text-sm hover:bg-gray-800"
                      >
                        Discord
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tasks" className="mt-6">
              <Card className="border-gray-800 bg-black/50">
                <CardHeader>
                  <CardTitle>{t("tasks")}</CardTitle>
                  <CardDescription>Complete tasks to earn token rewards</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tasks.map((task) => (
                      <div
                        key={task.id}
                        className="rounded-lg border border-gray-800 bg-black/30 p-4 transition-all hover:border-cyan-900 hover:shadow-lg hover:shadow-cyan-900/10"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium">{task.title}</h3>
                            <p className="mt-1 text-sm text-gray-400">{task.description}</p>
                          </div>
                          <Badge variant="outline" className="border-green-500 bg-green-500/10 text-green-400">
                            {task.reward}
                          </Badge>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center space-x-2 text-xs text-gray-400">
                            <CheckCircle2 className="h-3 w-3" />
                            <span>{task.completed} completed</span>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-cyan-800 bg-cyan-900/20 text-cyan-400 hover:bg-cyan-900/30"
                            disabled={!isParticipating}
                          >
                            Complete Task
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="comments" className="mt-6">
              <Card className="border-gray-800 bg-black/50">
                <CardHeader>
                  <CardTitle>{t("comments")}</CardTitle>
                  <CardDescription>Join the discussion about this project</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitComment} className="mb-6">
                    <div className="flex space-x-3">
                      <Avatar>
                        <AvatarFallback>{address ? address.substring(0, 2) : "?"}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <Input
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder={t("writeComment")}
                          className="border-gray-800 bg-black/50"
                          disabled={!isParticipating && !address}
                        />
                        <p className="mt-1 text-xs text-gray-400">
                          {!address
                            ? "Connect your wallet to comment."
                            : !isParticipating
                              ? "You need to join this project to comment."
                              : "A small gas fee will be charged for posting comments."}
                        </p>
                      </div>
                      <Button
                        type="submit"
                        size="icon"
                        disabled={!isParticipating || !newComment.trim() || !address}
                        className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white hover:from-cyan-600 hover:to-purple-700"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </form>

                  <div className="space-y-6">
                    {comments.map((comment) => (
                      <div key={comment.id} className="border-b border-gray-800 pb-6 last:border-0">
                        <div className="flex items-start space-x-3">
                          <Avatar>
                            <AvatarImage src={comment.user.avatar || "/placeholder.svg"} alt={comment.user.name} />
                            <AvatarFallback>{comment.user.name.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">{comment.user.name}</p>
                                <p className="text-xs text-gray-400">{formatDate(comment.timestamp)}</p>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleLikeComment(comment.id)}
                              >
                                {comment.isLiked ? (
                                  <ThumbsUp className="h-4 w-4 text-cyan-400" />
                                ) : (
                                  <ThumbsUp className="h-4 w-4" />
                                )}
                                <span className="ml-1 text-xs">{comment.likes}</span>
                              </Button>
                            </div>
                            <p className="mt-2 text-gray-300">{comment.text}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          {/* Action Card */}
          <Card className="border-gray-800 bg-black/50">
            <CardHeader>
              <CardTitle>Join Project</CardTitle>
              <CardDescription>Participate to earn rewards and contribute to the community</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-lg bg-gradient-to-r from-cyan-900/20 to-purple-900/20 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-300">Token Reward</span>
                    <span className="font-bold text-green-400">{projectData.tokenReward}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-300">Heat Value</span>
                    <div className="flex items-center space-x-1 text-purple-400">
                      <Fire className="h-4 w-4" />
                      <span>{projectData.heatValue.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-300">Participants</span>
                    <span>{projectData.participants.toLocaleString()}</span>
                  </div>
                </div>

                <Button
                  onClick={handleParticipate}
                  className={`w-full ${
                    isParticipating
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700"
                  }`}
                >
                  {isParticipating ? t("leaveProject") : t("joinProject")}
                </Button>

                <div className="flex justify-center space-x-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-white"
                    onClick={handleLikeProject}
                  >
                    {isLiked ? (
                      <Heart className="mr-2 h-4 w-4 text-red-500 fill-red-500" />
                    ) : (
                      <Heart className="mr-2 h-4 w-4" />
                    )}
                    {likeCount}
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Daily Ranking */}
          <Card className="border-gray-800 bg-black/50">
            <CardHeader>
              <CardTitle>Daily Ranking</CardTitle>
              <CardDescription>Current position in today's heat value ranking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center space-x-2 rounded-lg bg-gradient-to-r from-purple-900/20 to-cyan-900/20 p-6">
                <div className="text-center">
                  <p className="text-sm text-gray-400">Current Rank</p>
                  <p className="text-4xl font-bold text-purple-400">#3</p>
                </div>
                <div className="h-12 w-px bg-gray-800"></div>
                <div className="text-center">
                  <p className="text-sm text-gray-400">Time Left</p>
                  <div className="flex items-center text-cyan-400">
                    <Clock className="mr-1 h-4 w-4" />
                    <p className="text-lg font-bold">8h 23m</p>
                  </div>
                </div>
              </div>
              <p className="mt-4 text-center text-sm text-gray-400">
                Projects in the top 3 at the end of the day will automatically distribute token rewards to participants.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
