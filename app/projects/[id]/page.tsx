import Footer from "@/components/footer"
import Header from "@/components/header"
import ProjectDetailClient from "@/components/project-detail-client"
import { notFound } from "next/navigation"
import { Suspense } from "react"

// 这是一个服务器组件
export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  // 在服务器组件中获取项目数据
  const projectId = Number.parseInt(params.id, 10)

  if (isNaN(projectId)) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
      <Header />
      <Suspense
        fallback={
          <main className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-8">
            <div className="flex flex-col items-center">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent"></div>
              <p className="mt-4 text-lg">Loading project...</p>
            </div>
          </main>
        }
      >
        <ProjectDetailClient projectId={projectId} />
      </Suspense>
      <Footer />
    </div>
  )
}
