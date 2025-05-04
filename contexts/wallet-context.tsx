"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { ethers } from "ethers"

// Pharos Devnet 网络配置
const PHAROS_NETWORK = {
  chainId: "0xC352", // 50002 in hex
  chainName: "Pharos Devnet",
  nativeCurrency: {
    name: "ETH",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: ["https://devnet.dplabs-internal.com"],
  blockExplorerUrls: ["https://pharosscan.xyz"],
}

type WalletContextType = {
  address: string
  balance: string
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  isConnecting: boolean
  error: string | null
  provider: ethers.BrowserProvider | null
  signer: ethers.JsonRpcSigner | null
  switchToPharosNetwork: () => Promise<boolean>
  isCorrectNetwork: boolean
  sendTransaction: (to: string, amount: string) => Promise<ethers.TransactionResponse | null>
}

const WalletContext = createContext<WalletContextType>({
  address: "",
  balance: "0",
  connectWallet: async () => {},
  disconnectWallet: () => {},
  isConnecting: false,
  error: null,
  provider: null,
  signer: null,
  switchToPharosNetwork: async () => false,
  isCorrectNetwork: false,
  sendTransaction: async () => null,
})

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState("")
  const [balance, setBalance] = useState("0")
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null)
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null)
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false)

  // 检查当前网络是否是 Pharos Devnet
  const checkNetwork = async (provider: ethers.BrowserProvider) => {
    try {
      const network = await provider.getNetwork()
      const isCorrect = network.chainId === BigInt(50002)
      setIsCorrectNetwork(isCorrect)
      return isCorrect
    } catch (error) {
      console.error("Error checking network:", error)
      setIsCorrectNetwork(false)
      return false
    }
  }

  // 切换到 Pharos Devnet 网络
  const switchToPharosNetwork = async (): Promise<boolean> => {
    if (!window.ethereum) return false

    try {
      // 尝试切换到 Pharos 网络
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: PHAROS_NETWORK.chainId }],
      })
      return true
    } catch (switchError: any) {
      // 如果网络不存在，则添加网络
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [PHAROS_NETWORK],
          })
          return true
        } catch (addError) {
          console.error("Error adding Pharos network:", addError)
          setError("无法添加 Pharos Devnet 网络")
          return false
        }
      }
      console.error("Error switching to Pharos network:", switchError)
      setError("无法切换到 Pharos Devnet 网络")
      return false
    }
  }

  // 发送交易
  const sendTransaction = async (to: string, amount: string): Promise<ethers.TransactionResponse | null> => {
    if (!signer || !isCorrectNetwork) {
      setError("请先连接到 Pharos Devnet 网络")
      return null
    }

    try {
      const tx = await signer.sendTransaction({
        to,
        value: ethers.parseEther(amount),
      })
      return tx
    } catch (error: any) {
      console.error("Transaction error:", error)
      setError(error.message || "交易失败")
      return null
    }
  }

  // 检查钱包是否已连接
  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window !== "undefined" && window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum)
          const accounts = await provider.listAccounts()

          if (accounts.length > 0) {
            const address = accounts[0].address
            const signer = await provider.getSigner()
            const balanceWei = await provider.getBalance(address)
            const balanceEth = ethers.formatEther(balanceWei)

            setProvider(provider)
            setSigner(signer)
            setAddress(address)
            setBalance(Number.parseFloat(balanceEth).toFixed(4))

            // 检查是否是正确的网络
            await checkNetwork(provider)
          }
        } catch (error) {
          console.error("Error checking wallet connection:", error)
        }
      }
    }

    checkConnection()
  }, [])

  // 处理账户变更
  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      const handleAccountsChanged = async (accounts: string[]) => {
        if (accounts.length === 0) {
          // 用户断开了钱包
          disconnectWallet()
        } else if (accounts[0] !== address) {
          // 用户切换了账户
          try {
            const provider = new ethers.BrowserProvider(window.ethereum)
            const signer = await provider.getSigner()
            const balanceWei = await provider.getBalance(accounts[0])
            const balanceEth = ethers.formatEther(balanceWei)

            setProvider(provider)
            setSigner(signer)
            setAddress(accounts[0])
            setBalance(Number.parseFloat(balanceEth).toFixed(4))

            // 检查是否是正确的网络
            await checkNetwork(provider)
          } catch (error) {
            console.error("Error handling account change:", error)
          }
        }
      }

      const handleChainChanged = async () => {
        // 当链变更时，重新检查网络
        if (provider) {
          await checkNetwork(provider)
        }
      }

      window.ethereum.on("accountsChanged", handleAccountsChanged)
      window.ethereum.on("chainChanged", handleChainChanged)

      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
        window.ethereum.removeListener("chainChanged", handleChainChanged)
      }
    }
  }, [address, provider])

  const connectWallet = async () => {
    if (typeof window !== "undefined" && window.ethereum) {
      setIsConnecting(true)
      setError(null)

      try {
        const provider = new ethers.BrowserProvider(window.ethereum)
        await provider.send("eth_requestAccounts", [])
        const signer = await provider.getSigner()
        const address = await signer.getAddress()
        const balanceWei = await provider.getBalance(address)
        const balanceEth = ethers.formatEther(balanceWei)

        setProvider(provider)
        setSigner(signer)
        setAddress(address)
        setBalance(Number.parseFloat(balanceEth).toFixed(4))

        // 检查是否是正确的网络
        const isCorrect = await checkNetwork(provider)

        // 如果不是正确的网络，尝试切换
        if (!isCorrect) {
          await switchToPharosNetwork()
        }
      } catch (error: any) {
        console.error("Error connecting wallet:", error)
        setError(error.message || "Failed to connect wallet")
      } finally {
        setIsConnecting(false)
      }
    } else {
      setError("MetaMask is not installed")
    }
  }

  const disconnectWallet = () => {
    setAddress("")
    setBalance("0")
    setProvider(null)
    setSigner(null)
    setError(null)
    setIsCorrectNetwork(false)
  }

  return (
    <WalletContext.Provider
      value={{
        address,
        balance,
        connectWallet,
        disconnectWallet,
        isConnecting,
        error,
        provider,
        signer,
        switchToPharosNetwork,
        isCorrectNetwork,
        sendTransaction,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export const useWallet = () => useContext(WalletContext)
