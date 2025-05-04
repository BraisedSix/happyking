import { ethers } from "ethers"

// USDT 代币 ABI（简化版，仅包含我们需要的函数）
const USDT_ABI = [
  // 查询余额
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
  // 授权支出
  {
    constant: false,
    inputs: [
      { name: "_spender", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    type: "function",
  },
  // 转账
  {
    constant: false,
    inputs: [
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ name: "", type: "bool" }],
    type: "function",
  },
  // 查询授权额度
  {
    constant: true,
    inputs: [
      { name: "_owner", type: "address" },
      { name: "_spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ name: "", type: "uint256" }],
    type: "function",
  },
]

// 假设的 USDT 合约地址（在实际应用中，这应该是 Pharos Devnet 上的真实 USDT 合约地址）
const USDT_CONTRACT_ADDRESS = "0x1234567890123456789012345678901234567890"

// Happy King 平台地址（接收项目创建费用的地址）
const HAPPY_KING_ADDRESS = "0x0987654321098765432109876543210987654321"

// 开发模式标志 - 在开发环境中使用模拟数据
const DEV_MODE = true

export class USDTContract {
  private contract: ethers.Contract | null = null
  private provider: ethers.BrowserProvider
  private signer: ethers.JsonRpcSigner
  private mockBalances: Map<string, string> = new Map()

  constructor(provider: ethers.BrowserProvider, signer: ethers.JsonRpcSigner) {
    this.provider = provider
    this.signer = signer

    // 在开发模式下，不初始化合约，使用模拟数据
    if (!DEV_MODE) {
      try {
        this.contract = new ethers.Contract(USDT_CONTRACT_ADDRESS, USDT_ABI, signer)
      } catch (error) {
        console.warn("Failed to initialize USDT contract:", error)
        this.contract = null
      }
    }

    // 初始化模拟余额数据
    this.initMockBalances()
  }

  // 初始化模拟余额数据
  private initMockBalances() {
    // 为当前连接的钱包设置一个模拟的 USDT 余额（在开发模式下使用）
    this.signer
      .getAddress()
      .then((address) => {
        // 设置余额为 20-30 之间的随机值，确保大于 20
        const randomBalance = (Math.random() * 10 + 20).toFixed(2)
        this.mockBalances.set(address.toLowerCase(), randomBalance)
      })
      .catch((error) => {
        console.warn("Failed to get signer address for mock balance:", error)
      })
  }

  // 获取 USDT 余额
  async getBalance(address: string): Promise<string> {
    // 在开发模式下，返回模拟余额
    if (DEV_MODE) {
      const lowerAddress = address.toLowerCase()
      // 如果没有为该地址设置模拟余额，则设置一个
      if (!this.mockBalances.has(lowerAddress)) {
        const randomBalance = (Math.random() * 90 + 10).toFixed(2)
        this.mockBalances.set(lowerAddress, randomBalance)
      }
      return this.mockBalances.get(lowerAddress) || "0"
    }

    // 在生产模式下，尝试从合约获取余额
    if (!this.contract) return "0"
    try {
      const balance = await this.contract.balanceOf(address)
      // USDT 通常有 6 位小数
      return ethers.formatUnits(balance, 6)
    } catch (error) {
      console.error("Error getting USDT balance:", error)
      return "0"
    }
  }

  // 支付项目创建费用
  async payCreationFee(amount: string): Promise<{ success: boolean; txHash: string }> {
    // 在开发模式下，模拟支付过程
    if (DEV_MODE) {
      // 获取当前用户地址
      const address = await this.signer.getAddress()
      const lowerAddress = address.toLowerCase()

      // 获取当前余额
      const currentBalance = Number.parseFloat(this.mockBalances.get(lowerAddress) || "0")
      const paymentAmount = Number.parseFloat(amount)

      // 检查余额是否足够
      if (currentBalance < paymentAmount) {
        return { success: false, txHash: "" }
      }

      // 模拟交易延迟
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // 更新模拟余额
      const newBalance = (currentBalance - paymentAmount).toFixed(2)
      this.mockBalances.set(lowerAddress, newBalance)

      // 生成一个假的交易哈希
      const fakeTxHash = "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")

      return { success: true, txHash: fakeTxHash }
    }

    // 在生产模式下，尝试从合约发送交易
    if (!this.contract) return { success: false, txHash: "" }
    try {
      // 将金额转换为 USDT 的最小单位（6 位小数）
      const amountInSmallestUnit = ethers.parseUnits(amount, 6)

      // 发送交易
      const tx = await this.contract.transfer(HAPPY_KING_ADDRESS, amountInSmallestUnit)

      // 等待交易确认
      const receipt = await tx.wait()

      return {
        success: true,
        txHash: receipt.hash,
      }
    } catch (error) {
      console.error("Error paying creation fee:", error)
      return { success: false, txHash: "" }
    }
  }
}
