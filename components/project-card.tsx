"use client"

import { useLanguage } from "@/contexts/language-context"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FlameIcon as Fire, MessageSquare, Users, Award } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface ProjectCardProps {
  project: {
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
    createdAt?: string
  }
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const { t } = useLanguage()

  return (
    <Link href={`/projects/${project.id}`}>
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
                    <Badge variant="outline" className="ml-2 border-cyan-500 bg-cyan-500/10 text-cyan-400">
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
        <CardContent className="pb-2">
          <p className="line-clamp-2 text-sm text-gray-400">{project.description}</p>
        </CardContent>
        <CardFooter className="flex items-center justify-between border-t border-gray-800 pt-4">
          <div className="flex space-x-3 text-xs text-gray-400">
            <div className="flex items-center">
              <MessageSquare className="mr-1 h-3 w-3" />
              {project.comments}
            </div>
            <div className="flex items-center">
              <Users className="mr-1 h-3 w-3" />
              {project.participants}
            </div>
          </div>
          <div className="flex items-center space-x-1 text-xs font-medium text-green-400">
            <Award className="h-3 w-3" />
            <span>{project.tokenReward}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
