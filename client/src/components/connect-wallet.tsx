"use client"

import { Button } from "@/components/ui/button"
import { Wallet } from "lucide-react"

interface ConnectWalletProps {
  onConnect: () => void
}

export function ConnectWallet({ onConnect }: ConnectWalletProps) {
  return (
    <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-4">
      <div className="flex flex-col items-center justify-center py-4">
        <Wallet className="h-10 w-10 text-purple-400 mb-3" />
        <h3 className="font-medium text-lg mb-1">Connect Wallet</h3>
        <p className="text-sm text-gray-400 text-center mb-4">Connect your wallet to place bets and earn rewards</p>
        <Button
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
          onClick={onConnect}
        >
          Connect Wallet
        </Button>
      </div>
    </div>
  )
}

