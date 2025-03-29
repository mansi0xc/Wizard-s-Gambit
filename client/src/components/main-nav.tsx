"use client"

import Link from "next/link"
import { useState } from "react"
import { useAccount,useConfig,useReadContract } from "wagmi"
import { RuneAbi,RuneAdress } from "../app/abi/RuneAbi"
import { usePathname } from "next/navigation"
import { Wand2, BookOpen, Swords, User, Info, Award, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { ConnectButton } from '@rainbow-me/rainbowkit';

export function MainNav() {
  const pathname = usePathname()
  const { isConnected, address } = useAccount()
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useReadContract({
    address: RuneAdress,
    abi: RuneAbi,
    functionName: 'balanceOf',
    args: [address],
  })

  const formatBalance = (rawBalance: bigint | undefined) => {
    if (!rawBalance) return '0'
    const balanceInEther = Number(rawBalance) / 1e18
    return balanceInEther.toFixed(4) // Display 4 decimal places
  }


  const navItems = [
    {
      name: "Collection",
      href: "/collection",
      icon: Wand2,
    },
    {
      name: "Deck",
      href: "/deck",
      icon: BookOpen,
    },
    {
      name: "Battle",
      href: "/battle",
      icon: Swords,
    },
    {
      name: "Spellbook",
      href: "/spellbook",
      icon: BookOpen,
    },
    {
      name: "Spectate",
      href: "/spectate",
      icon: Users,
    },
    {
      name: "Badges",
      href: "/badges",
      icon: Award,
    },
    {
      name: "Profile",
      href: "/profile",
      icon: User,
    },
    {
      name: "About",
      href: "/about",
      icon: Info,
    },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-md border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl">✦</span>
            <span className="font-serif text-lg font-medium hidden sm:inline-block">Wizarding Realms</span>
          </Link>

          <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto scrollbar-hide">
            {navItems.map((item) => {
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center justify-center px-2 py-1 text-xs sm:text-sm rounded-md transition-colors",
                    isActive
                      ? "text-purple-400 bg-purple-900/20"
                      : "text-gray-400 hover:text-purple-300 hover:bg-purple-900/10",
                  )}
                >
                  <item.icon className="h-5 w-5 mb-1" />
                  <span className="hidden sm:inline-block">{item.name}</span>
                </Link>
              )
            })}
          </div>
          <ConnectButton chainStatus="icon" accountStatus="avatar" />
          <span>balance is {formatBalance(data as any)}</span>
        </div>
      </div>
    </nav>
  )
}

