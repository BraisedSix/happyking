"use client"

import type React from "react"

import Footer from "@/components/footer"
import Header from "@/components/header"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { useLanguage } from "@/contexts/language-context"
import { useWallet } from "@/contexts/wallet-context"
import { USDTContract } from "@/contracts/usdt-contract"
import { useProjectStore } from "@/store/project-store"
import { AlertCircle, Info, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

// 项目创建费用（USDT）
const PROJECT_CREATION_FEE = "20"

export default function CreateProject() {
  const { t } = useLanguage()
  const { address, connectWallet, isCorrectNetwork, switchToPharosNetwork, provider, signer } = useWallet()
  const router = useRouter()
  const { addProject } = useProjectStore()

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    tokenSymbol: "",
    tokenAmount: "",
    connectToContract: false,
    contractAddress: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [usdtBalance, setUsdtBalance] = useState("0")
  const [isLoadingBalance, setIsLoadingBalance] = useState(false)
  const [showNetworkDialog, setShowNetworkDialog] = useState(false)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "processing" | "wallet-confirm" | "success" | "error">(
    "pending",
  )
  const [paymentTxHash, setPaymentTxHash] = useState("")
  const [showMetaMaskDialog, setShowMetaMaskDialog] = useState(false)
  const [createdProjectId, setCreatedProjectId] = useState<number | null>(null)

  // 获取 USDT 余额
  useEffect(() => {
    const fetchUSDTBalance = async () => {
      if (address && provider && signer && isCorrectNetwork) {
        setIsLoadingBalance(true)
        try {
          const usdtContract = new USDTContract(provider, signer)
          const balance = await usdtContract.getBalance(address)
          setUsdtBalance(balance)
        } catch (error) {
          console.error("Failed to fetch USDT balance:", error)
          setUsdtBalance("0")
        } finally {
          setIsLoadingBalance(false)
        }
      }
    }

    fetchUSDTBalance()
  }, [address, provider, signer, isCorrectNetwork])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      connectToContract: checked,
      contractAddress: checked ? prev.contractAddress : "",
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!address) {
      await connectWallet()
      return
    }

    // 检查是否连接到 Pharos 网络
    if (!isCorrectNetwork) {
      setShowNetworkDialog(true)
      return
    }

    // 显示支付对话框
    setShowPaymentDialog(true)
  }

  // 处理网络切换
  const handleSwitchNetwork = async () => {
    const success = await switchToPharosNetwork()
    if (success) {
      setShowNetworkDialog(false)
    }
  }

  // 处理支付项目创建费用
  const handlePayCreationFee = async () => {
    if (!provider || !signer) return

    // 更新状态为钱包确认中
    setPaymentStatus("wallet-confirm")

    // 显示 MetaMask 对话框
    setShowMetaMaskDialog(true)
  }

  // 模拟确认 MetaMask 交易
  const confirmMetaMaskTransaction = async () => {
    setShowMetaMaskDialog(false)
    setPaymentStatus("processing")

    // 模拟交易处理时间
    setTimeout(async () => {
      try {
        if (!provider || !signer) return

        const usdtContract = new USDTContract(provider, signer)

        // 支付 USDT 费用
        const { success, txHash } = await usdtContract.payCreationFee(PROJECT_CREATION_FEE)

        if (success) {
          setPaymentTxHash(txHash)
          setPaymentStatus("success")

          // 更新 USDT 余额
          const newBalance = await usdtContract.getBalance(address)
          setUsdtBalance(newBalance)

          // 创建新项目并添加到存储中
          const newProject = {
            name: formData.name,
            description: formData.description,
            logo: `/placeholder.svg?height=80&width=80&query=${formData.name.charAt(0)}`,
            tokenReward: `${formData.tokenAmount} ${formData.tokenSymbol}`,
            category: formData.category,
            isVerified: false,
            tokenSymbol: formData.tokenSymbol,
          }

          addProject(newProject)

          // 获取新创建的项目ID（假设是最新添加的项目）
          const newProjectId = 1 // 这里应该是从 addProject 返回的 ID，但我们暂时使用 1
          setCreatedProjectId(newProjectId)

          // 延迟跳转到仪表板
          setTimeout(() => {
            setShowPaymentDialog(false)
            router.push("/dashboard")
          }, 3000)
        } else {
          setPaymentStatus("error")
        }
      } catch (error) {
        console.error("Payment error:", error)
        setPaymentStatus("error")
      }
    }, 2000)
  }

  // 取消 MetaMask 交易
  const cancelMetaMaskTransaction = () => {
    setShowMetaMaskDialog(false)
    setPaymentStatus("pending")
  }

  // 查看项目详情
  const viewProject = () => {
    if (createdProjectId) {
      router.push(`/projects/${createdProjectId}`)
    }
  }

  // 查看所有项目
  const viewAllProjects = () => {
    router.push("/projects")
  }

  const categories = [
    { value: "defi", label: "DeFi" },
    { value: "nft", label: "NFT" },
    { value: "dao", label: "DAO" },
    { value: "gamefi", label: "GameFi" },
    { value: "metaverse", label: "Metaverse" },
    { value: "infrastructure", label: "Infrastructure" },
    { value: "exchange", label: "Exchange" },
    { value: "social", label: "Social" },
    { value: "privacy", label: "Privacy" },
    { value: "ai", label: "AI" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-6 text-3xl font-bold">{t("createProject")}</h1>

          {!address && (
            <Alert className="mb-6 border-yellow-600 bg-yellow-600/10 text-yellow-500">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Wallet not connected</AlertTitle>
              <AlertDescription>You need to connect your wallet to create a project.</AlertDescription>
            </Alert>
          )}

          {address && !isCorrectNetwork && (
            <Alert className="mb-6 border-orange-600 bg-orange-600/10 text-orange-500">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Wrong Network</AlertTitle>
              <AlertDescription>
                Please switch to Pharos Devnet to create a project.
                <Button
                  variant="link"
                  className="ml-2 h-auto p-0 text-orange-500 underline"
                  onClick={handleSwitchNetwork}
                >
                  Switch Network
                </Button>
              </AlertDescription>
            </Alert>
          )}

          <Card className="border-gray-800 bg-black/50">
            <CardHeader>
              <CardTitle>{t("createProject")}</CardTitle>
              <CardDescription>
                Create a new project on Happy King platform. Projects require a creation fee of 20 USDT plus tokens for
                rewards.
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">{t("projectName")}</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter project name"
                    className="border-gray-800 bg-black/50"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">{t("projectDescription")}</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe your project"
                    className="min-h-[120px] border-gray-800 bg-black/50"
                    required
                  />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="category">{t("projectCategory")}</Label>
                    <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                      <SelectTrigger className="border-gray-800 bg-black/50">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tokenSymbol">Token Symbol</Label>
                    <Input
                      id="tokenSymbol"
                      name="tokenSymbol"
                      value={formData.tokenSymbol}
                      onChange={handleChange}
                      placeholder="e.g. BTC, ETH"
                      className="border-gray-800 bg-black/50"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tokenAmount">{t("tokenAmount")}</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="tokenAmount"
                      name="tokenAmount"
                      type="number"
                      value={formData.tokenAmount}
                      onChange={handleChange}
                      placeholder="Amount of tokens for rewards"
                      className="border-gray-800 bg-black/50"
                      required
                    />
                    <span>{formData.tokenSymbol || "TOKEN"}</span>
                  </div>
                  <p className="text-xs text-gray-400">
                    50% of these tokens will be used to incentivize user participation.
                  </p>
                </div>

                <div className="rounded-lg border border-gray-800 bg-gray-900/30 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="connect-contract" className="text-sm font-medium">
                        {t("connectSmartContract")}
                      </Label>
                      <Info className="h-4 w-4 text-gray-400" />
                    </div>
                    <Switch
                      id="connect-contract"
                      checked={formData.connectToContract}
                      onCheckedChange={handleSwitchChange}
                    />
                  </div>

                  {formData.connectToContract && (
                    <div className="mt-4 space-y-2">
                      <Label htmlFor="contractAddress">Contract Address</Label>
                      <Input
                        id="contractAddress"
                        name="contractAddress"
                        value={formData.contractAddress}
                        onChange={handleChange}
                        placeholder="0x..."
                        className="border-gray-800 bg-black/50"
                      />
                    </div>
                  )}
                </div>

                <Alert className="border-cyan-800 bg-cyan-900/10">
                  <Info className="h-4 w-4" />
                  <AlertTitle>{t("createFee")}</AlertTitle>
                  <AlertDescription>
                    Creating a project requires a fee of 20 USDT plus the tokens you allocate for rewards.
                    {address && isCorrectNetwork && (
                      <div className="mt-2">
                        <span className="font-medium">Your USDT Balance: </span>
                        {isLoadingBalance ? (
                          <span className="inline-flex items-center">
                            <Loader2 className="mr-2 h-3 w-3 animate-spin" /> Loading...
                          </span>
                        ) : (
                          <span className={Number.parseFloat(usdtBalance) < 20 ? "text-red-400" : "text-green-400"}>
                            {usdtBalance} USDT
                          </span>
                        )}
                      </div>
                    )}
                  </AlertDescription>
                </Alert>
              </CardContent>

              <CardFooter>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white hover:from-cyan-600 hover:to-purple-700"
                  disabled={
                    isSubmitting ||
                    isLoadingBalance ||
                    (address && isCorrectNetwork && Number.parseFloat(usdtBalance) < 20)
                  }
                >
                  {isSubmitting ? "Processing..." : t("submitProject")}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </main>

      <Footer />

      {/* 网络切换对话框 */}
      <Dialog open={showNetworkDialog} onOpenChange={setShowNetworkDialog}>
        <DialogContent className="border-gray-800 bg-gray-950 text-white sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Switch Network</DialogTitle>
            <DialogDescription className="text-gray-400">
              You need to switch to Pharos Devnet to create a project.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="rounded-lg border border-gray-800 bg-black/30 p-4">
              <h4 className="mb-2 font-medium">Pharos Devnet</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex justify-between">
                  <span>Network Name:</span>
                  <span className="text-white">Pharos Devnet</span>
                </div>
                <div className="flex justify-between">
                  <span>Chain ID:</span>
                  <span className="text-white">50002</span>
                </div>
                <div className="flex justify-between">
                  <span>RPC URL:</span>
                  <span className="text-white">https://devnet.dplabs-internal.com</span>
                </div>
                <div className="flex justify-between">
                  <span>Block Explorer:</span>
                  <span className="text-white">https://pharosscan.xyz</span>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              className="border-gray-700 bg-black/50 text-white hover:bg-gray-900"
              onClick={() => setShowNetworkDialog(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white hover:from-cyan-600 hover:to-purple-700"
              onClick={handleSwitchNetwork}
            >
              Switch Network
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 支付对话框 */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="border-gray-800 bg-gray-950 text-white sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Project Creation Payment</DialogTitle>
            <DialogDescription className="text-gray-400">
              Pay the creation fee to launch your project on Happy King.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {paymentStatus === "pending" && (
              <div className="space-y-4">
                <div className="rounded-lg border border-gray-800 bg-black/30 p-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Creation Fee:</span>
                    <span className="font-medium text-white">{PROJECT_CREATION_FEE} USDT</span>
                  </div>
                  <div className="mt-2 flex justify-between">
                    <span className="text-gray-400">Your Balance:</span>
                    <span className={Number.parseFloat(usdtBalance) < 20 ? "text-red-400" : "text-green-400"}>
                      {usdtBalance} USDT
                    </span>
                  </div>
                </div>

                <Alert className="border-cyan-800 bg-cyan-900/10">
                  <Info className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    This will trigger a transaction on the Pharos Devnet. Please confirm the transaction in your wallet.
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {paymentStatus === "wallet-confirm" && (
              <div className="flex flex-col items-center justify-center py-6">
                <p className="text-lg font-medium">Waiting for Wallet Confirmation</p>
                <p className="text-center text-sm text-gray-400">
                  Please check your wallet and confirm the transaction.
                </p>
                <div className="mt-4">
                  <Loader2 className="h-12 w-12 animate-spin text-cyan-500" />
                </div>
              </div>
            )}

            {paymentStatus === "processing" && (
              <div className="flex flex-col items-center justify-center py-6">
                <Loader2 className="h-12 w-12 animate-spin text-cyan-500" />
                <p className="mt-4 text-lg font-medium">Processing Payment</p>
                <p className="text-sm text-gray-400">Transaction confirmed, processing payment...</p>
              </div>
            )}

            {paymentStatus === "success" && (
              <div className="flex flex-col items-center justify-center py-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="mt-4 text-lg font-medium">Payment Successful!</p>
                <p className="text-center text-sm text-gray-400">Your project has been created successfully.</p>
                {paymentTxHash && (
                  <a
                    href={`https://pharosscan.xyz/tx/${paymentTxHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 text-sm text-cyan-500 hover:underline"
                  >
                    View transaction on Pharos Explorer
                  </a>
                )}

                <div className="mt-6 flex space-x-4">
                  <Button
                    variant="outline"
                    className="border-gray-700 bg-black/50 text-white hover:bg-gray-900"
                    onClick={viewAllProjects}
                  >
                    View All Projects
                  </Button>
                  <Button
                    className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white hover:from-cyan-600 hover:to-purple-700"
                    onClick={() => {
                      setShowPaymentDialog(false)
                      router.push("/dashboard")
                    }}
                  >
                    Go to Dashboard
                  </Button>
                </div>
              </div>
            )}

            {paymentStatus === "error" && (
              <div className="flex flex-col items-center justify-center py-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/20">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-red-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <p className="mt-4 text-lg font-medium">Payment Failed</p>
                <p className="text-center text-sm text-gray-400">
                  There was an error processing your payment. Please try again.
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            {paymentStatus === "pending" && (
              <>
                <Button
                  variant="outline"
                  className="border-gray-700 bg-black/50 text-white hover:bg-gray-900"
                  onClick={() => setShowPaymentDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white hover:from-cyan-600 hover:to-purple-700"
                  onClick={handlePayCreationFee}
                  disabled={Number.parseFloat(usdtBalance) < 20}
                >
                  Pay {PROJECT_CREATION_FEE} USDT
                </Button>
              </>
            )}

            {paymentStatus === "wallet-confirm" && (
              <Button variant="outline" className="border-gray-700 bg-black/50 text-white hover:bg-gray-900" disabled>
                Waiting for confirmation...
              </Button>
            )}

            {paymentStatus === "processing" && (
              <Button variant="outline" className="border-gray-700 bg-black/50 text-white hover:bg-gray-900" disabled>
                Processing...
              </Button>
            )}

            {paymentStatus === "success" && (
              <div className="flex w-full justify-end space-x-2">
                <Button
                  variant="outline"
                  className="border-gray-700 bg-black/50 text-white hover:bg-gray-900"
                  onClick={viewAllProjects}
                >
                  View All Projects
                </Button>
                <Button
                  className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white hover:from-cyan-600 hover:to-purple-700"
                  onClick={() => {
                    setShowPaymentDialog(false)
                    router.push("/dashboard")
                  }}
                >
                  Go to Dashboard
                </Button>
              </div>
            )}

            {paymentStatus === "error" && (
              <>
                <Button
                  variant="outline"
                  className="border-gray-700 bg-black/50 text-white hover:bg-gray-900"
                  onClick={() => setShowPaymentDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white hover:from-cyan-600 hover:to-purple-700"
                  onClick={handlePayCreationFee}
                >
                  Try Again
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MetaMask 交易确认对话框 */}
      <Dialog open={showMetaMaskDialog} onOpenChange={setShowMetaMaskDialog}>
        <DialogContent className="border-gray-800 bg-gray-950 text-white sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Transaction</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex justify-center">
              <img src="/metamask-logo.png" alt="MetaMask" className="h-16 w-16" />
            </div>

            <div className="rounded-lg border border-gray-800 bg-black/30 p-4">
              <h3 className="mb-2 text-center font-medium">MetaMask Transaction Request</h3>

              <div className="space-y-3">
                <div className="flex justify-between border-b border-gray-800 pb-2">
                  <span className="text-sm text-gray-400">From:</span>
                  <span className="text-sm font-mono">
                    {address ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}` : ""}
                  </span>
                </div>

                <div className="flex justify-between border-b border-gray-800 pb-2">
                  <span className="text-sm text-gray-400">To:</span>
                  <span className="text-sm font-mono">Happy King</span>
                </div>

                <div className="flex justify-between border-b border-gray-800 pb-2">
                  <span className="text-sm text-gray-400">Amount:</span>
                  <span className="text-sm font-medium">{PROJECT_CREATION_FEE} USDT</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Network:</span>
                  <span className="text-sm">Pharos Devnet</span>
                </div>
              </div>
            </div>

            <p className="text-center text-sm text-gray-400">
              Confirm this transaction in your wallet to proceed with project creation.
            </p>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              className="border-gray-700 bg-black/50 text-white hover:bg-gray-900"
              onClick={cancelMetaMaskTransaction}
            >
              Reject
            </Button>
            <Button
              className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white hover:from-cyan-600 hover:to-purple-700"
              onClick={confirmMetaMaskTransaction}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
