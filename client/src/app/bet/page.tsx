"use client"

import { useState, useEffect } from "react"
import { useAccount } from "wagmi"
import { writeContract, waitForTransactionReceipt, readContract } from "@wagmi/core"
import { BetAddress, betAbi } from "../abi/Bets"
import { RuneAbi, RuneAdress } from "../abi/RuneAbi"
import { config } from "../wagmi"
import { Loader2, FlameIcon as Fire, Sparkles, User, RefreshCw } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Address } from "viem"

export default function BetPage() {
  const { address, isConnected } = useAccount()
  const [processingItem, setProcessingItem] = useState<string | null>(null)
  const [runeBalance, setRuneBalance] = useState<bigint>(BigInt(0))

  // Form states
  const [battleId, setBattleId] = useState<number>(0)
  const [playerA, setPlayerA] = useState<string>("")
  const [playerB, setPlayerB] = useState<string>("")
  const [betAmount, setBetAmount] = useState<string>("0")
  const [winner, setWinner] = useState<string>("")

  // Fetch user's Rune balance
  const fetchBalance = async () => {
    if (!address) return

    try {
      const balance = await readContract(config, {
        abi: RuneAbi,
        address: RuneAdress,
        functionName: "balanceOf",
        args: [address],
      })

      setRuneBalance(balance as bigint)
    } catch (error) {
      console.error("Error fetching balance:", error)
    }
  }

  useEffect(() => {
    if (isConnected && address) {
      fetchBalance()
    }
  }, [isConnected, address])

  async function handleRegisterBet() {
    if (!playerA || !playerB) {
      alert("Please enter both player addresses")
      return
    }

    setProcessingItem("register")
    try {
      const result = await writeContract(config, {
        abi: betAbi,
        address: BetAddress,
        functionName: "registerBattle",
        args: [battleId, playerA as Address, playerB as Address],
      })
      await waitForTransactionReceipt(config, { hash: result })
      alert(`Successfully registered Battle #${battleId}`)
    } catch (error) {
      console.error("Error registering bet:", error)
      alert("Failed to register Bet. See console for details.")
    } finally {
      setProcessingItem(null)
    }
  }

  async function handleApproveRune() {
    if (!betAmount || Number.parseFloat(betAmount) <= 0) {
      alert("Please enter a valid bet amount")
      return
    }

    setProcessingItem("approve")
    try {
      // Convert amount to wei (1e18)
      const amountInWei = BigInt(Number.parseFloat(betAmount) * 1e18)

      const result = await writeContract(config, {
        abi: RuneAbi,
        address: RuneAdress,
        functionName: "approve",
        args: [BetAddress as Address, amountInWei],
      })
      await waitForTransactionReceipt(config, { hash: result })
      alert(`Successfully approved ${betAmount} Rune tokens`)
    } catch (error) {
      console.error("Error approving Rune:", error)
      alert("Failed to approve Rune. See console for details.")
    } finally {
      setProcessingItem(null)
    }
  }

  async function handlePlaceBet() {
    if (!playerA || Number.parseFloat(betAmount) <= 0) {
      alert("Please enter player address and bet amount")
      return
    }

    setProcessingItem("placeBet")
    try {
      // Convert amount to wei (1e18)
      const amountInWei = BigInt(Number.parseFloat(betAmount) * 1e18)

      const result = await writeContract(config, {
        abi: betAbi,
        address: BetAddress,
        functionName: "placeBet",
        args: [battleId, playerA as Address, amountInWei],
      })
      await waitForTransactionReceipt(config, { hash: result })
      alert(`Successfully placed bet on Battle #${battleId}`)

      // Refresh balance after placing bet
      fetchBalance()
    } catch (error) {
      console.error("Error placing bet:", error)
      alert("Failed to place bet. See console for details.")
    } finally {
      setProcessingItem(null)
    }
  }

  async function handleSettleBet() {
    if (!winner) {
      alert("Please enter winner address")
      return
    }

    setProcessingItem("settle")
    try {
      const result = await writeContract(config, {
        abi: betAbi,
        address: BetAddress,
        functionName: "settleBets",
        args: [battleId, winner as Address],
      })
      await waitForTransactionReceipt(config, { hash: result })
      alert(`Successfully settled Battle #${battleId}`)

      // Refresh balance after settling
      fetchBalance()
    } catch (error) {
      console.error("Error settling bet:", error)
      alert("Failed to settle bet. See console for details.")
    } finally {
      setProcessingItem(null)
    }
  }

  // Format balance for display
  const formattedBalance = (runeBalance / BigInt(10 ** 18)).toString()

  return (
    <div className="container mx-auto py-8">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Fire className="h-6 w-6 text-red-500" />
            Battle Betting System
          </CardTitle>
          <div className="flex items-center gap-2 text-sm">
            <Badge variant="outline" className="px-2 py-1">
              <User className="h-3 w-3 mr-1" />
              {isConnected ? `${address?.slice(0, 6)}...${address?.slice(-4)}` : "Not Connected"}
            </Badge>
            <Badge variant="secondary" className="px-2 py-1">
              <Sparkles className="h-3 w-3 mr-1" />
              Balance: {formattedBalance} RUNE
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="register" className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="register">Register Battle</TabsTrigger>
              <TabsTrigger value="bet">Place Bet</TabsTrigger>
              <TabsTrigger value="settle">Settle Bet</TabsTrigger>
            </TabsList>

            <TabsContent value="register" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="battleId">Battle ID</Label>
                <Input
                  id="battleId"
                  type="number"
                  placeholder="Enter battle ID"
                  value={battleId}
                  onChange={(e) => setBattleId(Number.parseInt(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="playerA">Player A Address</Label>
                <Input id="playerA" placeholder="0x..." value={playerA} onChange={(e) => setPlayerA(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="playerB">Player B Address</Label>
                <Input id="playerB" placeholder="0x..." value={playerB} onChange={(e) => setPlayerB(e.target.value)} />
              </div>
              <Button className="w-full" onClick={handleRegisterBet} disabled={processingItem === "register"}>
                {processingItem === "register" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Registering...
                  </>
                ) : (
                  "Register Battle"
                )}
              </Button>
            </TabsContent>

            <TabsContent value="bet" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="betBattleId">Battle ID</Label>
                <Input
                  id="betBattleId"
                  type="number"
                  placeholder="Enter battle ID"
                  value={battleId}
                  onChange={(e) => setBattleId(Number.parseInt(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="betPlayerA">Player to Bet On</Label>
                <Input
                  id="betPlayerA"
                  placeholder="0x..."
                  value={playerA}
                  onChange={(e) => setPlayerA(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="betAmount">Bet Amount (RUNE)</Label>
                <Input
                  id="betAmount"
                  type="number"
                  placeholder="0.0"
                  value={betAmount}
                  onChange={(e) => setBetAmount(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Amount will be converted to wei (× 10<sup>18</sup>)
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleApproveRune}
                  disabled={processingItem === "approve"}
                >
                  {processingItem === "approve" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Approving...
                    </>
                  ) : (
                    "1. Approve Tokens"
                  )}
                </Button>
                <Button className="flex-1" onClick={handlePlaceBet} disabled={processingItem === "placeBet"}>
                  {processingItem === "placeBet" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Placing Bet...
                    </>
                  ) : (
                    "2. Place Bet"
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="settle" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="settleBattleId">Battle ID</Label>
                <Input
                  id="settleBattleId"
                  type="number"
                  placeholder="Enter battle ID"
                  value={battleId}
                  onChange={(e) => setBattleId(Number.parseInt(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="winner">Winner Address</Label>
                <Input id="winner" placeholder="0x..." value={winner} onChange={(e) => setWinner(e.target.value)} />
              </div>
              <Button className="w-full" onClick={handleSettleBet} disabled={processingItem === "settle"}>
                {processingItem === "settle" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Settling...
                  </>
                ) : (
                  "Settle Bet"
                )}
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">Current RUNE Balance: {formattedBalance}</div>
          <Button variant="outline" size="sm" onClick={fetchBalance}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh Balance
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}





// "use client"

// import { useState, useEffect } from "react"
// import { useAccount } from "wagmi"
// import { writeContract, waitForTransactionReceipt } from "@wagmi/core"
// import { BetAddress, betAbi } from "../abi/Bets"
// import { RuneAbi, RuneAdress } from "../abi/RuneAbi"
// import { config } from "../wagmi"
// import { Loader2, FlameIcon as Fire, Wand, Sparkles, User } from "lucide-react"
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Badge } from "@/components/ui/badge"
// import { Address } from "viem"

// export default function BetPage() {

//     const { address, isConnected } = useAccount()
//     const [processingItem, setProcessingItem] = useState<string | null>(null)

//     async function handleRegisterBet(battleid: number,PlayerA:Address , PlayerB: Address) {
//         try {
//           const result = await writeContract(config, {
//             abi: betAbi,
//             address: BetAddress,
//             functionName: "registerBattle",
//             args: [battleid,PlayerA,PlayerB],
//           })
//           await waitForTransactionReceipt(config, { hash: result })
//           alert(`Successfully registered Battle #${battleid}`)
//         } catch (error) {
//           console.error("Error registering bet:", error)
//           alert("Failed to register Bet. See console for details.")
//         } finally {
//           setProcessingItem(null)
//         }
//     }

//     async function handleApproveRune(spender:Address,amount:bigint) {
//         try {
//             const result = await writeContract(config, {
//               abi: RuneAbi,
//               address: RuneAdress,
//               functionName: "approve",
//               args: [spender,amount],
//             })
//             await waitForTransactionReceipt(config, { hash: result })
//             alert(`Successfully approved Rune`)
//           } catch (error) {
//             console.error("Error approving Rune:", error)
//             alert("Failed to approve Rune. See console for details.")
//           } finally {
//             setProcessingItem(null)
//           }
//     }

//     async function handlePlaceBet(battleid: number,PlayerA:Address , amount:bigint) {
//         try {
//           const result = await writeContract(config, {
//             abi: betAbi,
//             address: BetAddress,
//             functionName: "placeBet",
//             args: [battleid,PlayerA,amount],
//           })
//           await waitForTransactionReceipt(config, { hash: result })
//           alert(`Successfully placedbet on Battle #${battleid}`)
//         } catch (error) {
//           console.error("Error registering bet:", error)
//           alert("Failed to register Bet. See console for details.")
//         } finally {
//           setProcessingItem(null)
//         }
//     }

//     async function handleSettleBet(battleid: number,winner:Address) {
//         try {
//           const result = await writeContract(config, {
//             abi: betAbi,
//             address: BetAddress,
//             functionName: "placeBet",
//             args: [battleid,winner],
//           })
//           await waitForTransactionReceipt(config, { hash: result })
//           alert(`Successfully placedbet on Battle #${battleid}`)
//         } catch (error) {
//           console.error("Error registering bet:", error)
//           alert("Failed to register Bet. See console for details.")
//         } finally {
//           setProcessingItem(null)
//         }
//     }
           
// }


