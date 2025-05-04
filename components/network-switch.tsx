"use client"

import React from "react"

import { useState } from "react"
import { useWallet } from "@/contexts/wallet-context"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface NetworkSwitchProps {
  children: React.ReactNode
  onNetworkSwitched?: () => void
}

export default function NetworkSwitch({ children, onNetworkSwitched }: NetworkSwitchProps) {
  const { isCorrectNetwork, switchToPharosNetwork } = useWallet()
  const [showDialog, setShowDialog] = useState(false)

  const handleClick = async () => {
    if (!isCorrectNetwork) {
      setShowDialog(true)
      return
    }

    // 如果已经在正确的网络上，直接执行子组件的操作
    if (typeof children === "function") {
      children()
    }
  }

  const handleSwitchNetwork = async () => {
    const success = await switchToPharosNetwork()
    if (success) {
      setShowDialog(false)
      if (onNetworkSwitched) {
        onNetworkSwitched()
      }
    }
  }

  // 如果子组件是一个函数，则传递 handleClick 作为参数
  if (typeof children === "function") {
    return (
      <>
        {children(handleClick)}
        <NetworkSwitchDialog open={showDialog} onOpenChange={setShowDialog} onSwitchNetwork={handleSwitchNetwork} />
      </>
    )
  }

  // 否则，克隆子组件并添加 onClick 处理程序
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        onClick: handleClick,
      })
    }
    return child
  })

  return (
    <>
      {childrenWithProps}
      <NetworkSwitchDialog open={showDialog} onOpenChange={setShowDialog} onSwitchNetwork={handleSwitchNetwork} />
    </>
  )
}

interface NetworkSwitchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSwitchNetwork: () => void
}

function NetworkSwitchDialog({ open, onOpenChange, onSwitchNetwork }: NetworkSwitchDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-gray-800 bg-gray-950 text-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Switch Network</DialogTitle>
          <DialogDescription className="text-gray-400">
            You need to switch to Pharos Devnet to continue.
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
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white hover:from-cyan-600 hover:to-purple-700"
            onClick={onSwitchNetwork}
          >
            Switch Network
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
