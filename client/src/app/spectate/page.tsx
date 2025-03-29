"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Shield,
  Zap,
  Flame,
  Snowflake,
  Wind,
  ArrowLeft,
  Heart,
  Users,
  Coins,
  Trophy,
  Clock,
  Filter,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { ConnectWallet } from "@/components/connect-wallet"

export default function SpectatePage() {
  // State for active battles and betting
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const [activeBattles, setActiveBattles] = useState([
    {
      id: 1,
      player1: {
        name: "Archmage Lumina",
        level: 42,
        avatar: "/placeholder.svg?height=80&width=80",
        health: 85,
        hearts: 2,
        odds: 1.8,
      },
      player2: {
        name: "Sorcerer Malachai",
        level: 40,
        avatar: "/placeholder.svg?height=80&width=80",
        health: 65,
        hearts: 2,
        odds: 2.2,
      },
      spectatorCount: 12,
      totalBets: 250,
      timeRemaining: "04:32",
      round: 2,
    },
    {
      id: 2,
      player1: {
        name: "Enchantress Elara",
        level: 38,
        avatar: "/placeholder.svg?height=80&width=80",
        health: 70,
        hearts: 1,
        odds: 2.5,
      },
      player2: {
        name: "Warlock Thorne",
        level: 45,
        avatar: "/placeholder.svg?height=80&width=80",
        health: 90,
        hearts: 2,
        odds: 1.5,
      },
      spectatorCount: 24,
      totalBets: 420,
      timeRemaining: "08:15",
      round: 3,
    },
    {
      id: 3,
      player1: {
        name: "Illusionist Zephyr",
        level: 50,
        avatar: "/placeholder.svg?height=80&width=80",
        health: 55,
        hearts: 1,
        odds: 3.0,
      },
      player2: {
        name: "Mystic Orion",
        level: 48,
        avatar: "/placeholder.svg?height=80&width=80",
        health: 40,
        hearts: 1,
        odds: 1.4,
      },
      spectatorCount: 36,
      totalBets: 680,
      timeRemaining: "02:47",
      round: 5,
    },
  ])
  const [selectedBattle, setSelectedBattle] = useState<number | null>(null)
  const [betAmount, setBetAmount] = useState("")
  const [selectedPlayer, setSelectedPlayer] = useState<1 | 2 | null>(null)

  // Simulate battle progression
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveBattles((battles) =>
        battles.map((battle) => {
          // Update time remaining
          const [mins, secs] = battle.timeRemaining.split(":").map(Number)
          let newSecs = secs - 1
          let newMins = mins

          if (newSecs < 0) {
            newSecs = 59
            newMins = Math.max(0, newMins - 1)
          }

          const newTimeRemaining = `${String(newMins).padStart(2, "0")}:${String(newSecs).padStart(2, "0")}`

          // Randomly update health
          const player1Health = Math.max(
            0,
            battle.player1.health + (Math.random() > 0.7 ? Math.floor(Math.random() * 20) - 10 : 0),
          )
          const player2Health = Math.max(
            0,
            battle.player2.health + (Math.random() > 0.7 ? Math.floor(Math.random() * 20) - 10 : 0),
          )

          // Update hearts if health drops too low
          let player1Hearts = battle.player1.hearts
          let player2Hearts = battle.player2.hearts

          if (player1Health < 20 && battle.player1.health >= 20) {
            player1Hearts = Math.max(0, player1Hearts - 1)
          }

          if (player2Health < 20 && battle.player2.health >= 20) {
            player2Hearts = Math.max(0, player2Hearts - 1)
          }

          // Randomly update spectator count and bet amount
          const spectatorChange = Math.random() > 0.8 ? Math.floor(Math.random() * 3) - 1 : 0
          const betChange = Math.random() > 0.8 ? Math.floor(Math.random() * 50) - 25 : 0

          return {
            ...battle,
            timeRemaining: newTimeRemaining,
            player1: {
              ...battle.player1,
              health: player1Health,
              hearts: player1Hearts,
            },
            player2: {
              ...battle.player2,
              health: player2Health,
              hearts: player2Hearts,
            },
            spectatorCount: Math.max(0, battle.spectatorCount + spectatorChange),
            totalBets: Math.max(0, battle.totalBets + betChange),
          }
        }),
      )
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Handle placing a bet
  const placeBet = () => {
    if (!selectedBattle || !selectedPlayer || !betAmount) return

    alert(
      `Bet of ${betAmount} WIZ placed on ${
        selectedPlayer === 1
          ? activeBattles.find((b) => b.id === selectedBattle)?.player1.name
          : activeBattles.find((b) => b.id === selectedBattle)?.player2.name
      }`,
    )

    setBetAmount("")
    setSelectedPlayer(null)
  }

  // Get the selected battle
  const battle = selectedBattle ? activeBattles.find((b) => b.id === selectedBattle) : null

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-gray-100 pt-16 relative overflow-hidden">
      {/* Background magical symbols */}
      <div className="absolute inset-0 z-0 opacity-5">
        <div className="absolute top-1/4 left-1/5 w-32 h-32 border border-purple-500 rounded-full"></div>
        <div className="absolute top-1/3 right-1/4 w-48 h-16 border border-blue-500 rotate-45"></div>
        <div className="absolute bottom-1/4 left-1/3 w-24 h-64 border border-indigo-500 rotate-12"></div>
        <div className="absolute top-2/3 right-1/5 w-40 h-40 border border-violet-500 rounded-lg rotate-12"></div>
      </div>

      <header className="container mx-auto pt-4 px-4 z-10 relative flex justify-between items-center">
        <Link href="/battle" className="text-gray-400 hover:text-white transition-colors flex items-center">
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span className="text-sm">Return to Battle</span>
        </Link>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2 bg-gray-900/50 border border-gray-800 rounded-full px-3 py-1">
            <Users className="h-4 w-4 text-blue-400" />
            <span className="text-sm font-medium">
              {activeBattles.reduce((sum, battle) => sum + battle.spectatorCount, 0)} Spectators
            </span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-4 z-10 relative">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Battle List */}
          <div className="w-full md:w-1/3 lg:w-1/4">
            <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-serif text-xl">Live Duels</h2>
                <Button variant="outline" size="sm" className="bg-transparent border-gray-700 hover:bg-gray-800">
                  <Filter className="h-4 w-4 mr-1" />
                  Filter
                </Button>
              </div>

              <div className="space-y-3">
                {activeBattles.map((battle) => (
                  <div
                    key={battle.id}
                    className={`border rounded-lg p-3 cursor-pointer transition-all hover:border-purple-500/30 hover:bg-purple-900/10 ${
                      selectedBattle === battle.id
                        ? "border-purple-500 bg-purple-900/20"
                        : "border-gray-800 bg-gray-900/50"
                    }`}
                    onClick={() => setSelectedBattle(battle.id)}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 text-blue-400 mr-1" />
                        <span className="text-xs">{battle.spectatorCount}</span>
                      </div>
                      <div className="flex items-center">
                        <Coins className="h-4 w-4 text-yellow-400 mr-1" />
                        <span className="text-xs">{battle.totalBets} WIZ</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-purple-400 mr-1" />
                        <span className="text-xs">{battle.timeRemaining}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                          <Image
                            src={battle.player1.avatar || "/placeholder.svg"}
                            alt={battle.player1.name}
                            width={32}
                            height={32}
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-xs font-medium">{battle.player1.name}</p>
                          <p className="text-[10px] text-gray-400">Lvl {battle.player1.level}</p>
                        </div>
                      </div>

                      <div className="text-xs text-gray-400">vs</div>

                      <div className="flex items-center text-right">
                        <div>
                          <p className="text-xs font-medium">{battle.player2.name}</p>
                          <p className="text-[10px] text-gray-400">Lvl {battle.player2.level}</p>
                        </div>
                        <div className="w-8 h-8 rounded-full overflow-hidden ml-2">
                          <Image
                            src={battle.player2.avatar || "/placeholder.svg"}
                            alt={battle.player2.name}
                            width={32}
                            height={32}
                            className="object-cover"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-2 flex justify-between items-center">
                      <div className="flex">
                        {[...Array(2)].map((_, i) => (
                          <Heart
                            key={i}
                            className={`h-3 w-3 ${i < battle.player1.hearts ? "text-red-500 fill-red-500" : "text-gray-600"} mr-1`}
                          />
                        ))}
                      </div>

                      <Badge className="text-[10px] py-0 px-1 h-4 bg-purple-900/20 border-purple-500/30 text-purple-300">
                        Round {battle.round}
                      </Badge>

                      <div className="flex justify-end">
                        {[...Array(2)].map((_, i) => (
                          <Heart
                            key={i}
                            className={`h-3 w-3 ${i < battle.player2.hearts ? "text-red-500 fill-red-500" : "text-gray-600"} ml-1`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {!isWalletConnected ? (
              <ConnectWallet onConnect={() => setIsWalletConnected(true)} />
            ) : (
              <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-4">
                <h3 className="font-medium text-sm mb-3">Your Active Bets</h3>
                <div className="text-center text-gray-400 text-sm py-4">No active bets</div>
                <Button className="w-full bg-purple-600 hover:bg-purple-700">View Betting History</Button>
              </div>
            )}
          </div>

          {/* Battle Viewer */}
          <div className="w-full md:w-2/3 lg:w-3/4">
            {selectedBattle ? (
              <div className="space-y-4">
                <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      <Badge className="bg-green-900/20 border-green-500/30 text-green-300 mr-2">Live</Badge>
                      <h2 className="font-serif text-xl">Magical Duel</h2>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 text-blue-400 mr-1" />
                        <span className="text-sm">{battle?.spectatorCount}</span>
                      </div>
                      <div className="flex items-center">
                        <Coins className="h-4 w-4 text-yellow-400 mr-1" />
                        <span className="text-sm">{battle?.totalBets} WIZ</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-purple-400 mr-1" />
                        <span className="text-sm">{battle?.timeRemaining}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                    {/* Player 1 */}
                    <div className="md:col-span-2 bg-gray-900/50 border border-gray-800 rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-900/50 to-indigo-900/50 rounded-full mr-2 flex items-center justify-center border border-purple-500/30">
                            <Image
                              src={battle?.player1.avatar || "/placeholder.svg"}
                              alt={battle?.player1.name || "Player 1"}
                              width={40}
                              height={40}
                              className="rounded-full"
                            />
                          </div>
                          <div>
                            <h3 className="font-serif text-sm">{battle?.player1.name}</h3>
                            <p className="text-xs text-purple-400">Level {battle?.player1.level}</p>
                          </div>
                        </div>

                        <div className="flex">
                          {[...Array(2)].map((_, i) => (
                            <Heart
                              key={i}
                              className={`h-5 w-5 ${i < (battle?.player1.hearts || 0) ? "text-red-500 fill-red-500" : "text-gray-600"} mr-1`}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2 mb-2">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Health</span>
                            <span>{battle?.player1.health}/100</span>
                          </div>
                          <Progress
                            value={battle?.player1.health}
                            className="h-2 bg-gray-800"
                            indicatorClassName="bg-gradient-to-r from-green-500 to-emerald-500"
                          />
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <Badge className="bg-gray-800 border-0">Odds: {battle?.player1.odds}x</Badge>

                        <Button
                          size="sm"
                          className={`${
                            selectedPlayer === 1 ? "bg-purple-600 hover:bg-purple-700" : "bg-gray-800 hover:bg-gray-700"
                          }`}
                          onClick={() => setSelectedPlayer(1)}
                          disabled={!isWalletConnected}
                        >
                          Bet on {battle?.player1.name.split(" ")[0]}
                        </Button>
                      </div>
                    </div>

                    {/* Battle Visualization */}
                    <div className="md:col-span-3 bg-gray-900/30 border border-gray-800 rounded-lg p-4 relative">
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-purple-900/10 rounded-lg pointer-events-none"></div>

                      <div className="flex justify-center items-center h-40 relative">
                        <div className="absolute left-0 w-24 h-24 opacity-30">
                          <Image
                            src="/placeholder.svg?height=100&width=100"
                            alt="Player 1 Patronus"
                            width={100}
                            height={100}
                            className="object-contain"
                          />
                        </div>

                        <div className="w-16 h-16 bg-purple-500/10 border border-purple-500/20 rounded-full flex items-center justify-center relative">
                          <div className="absolute inset-0 rounded-full bg-purple-500/5 animate-ping"></div>
                          <span className="text-2xl">⚡</span>
                        </div>

                        <div className="absolute right-0 w-24 h-24 opacity-30">
                          <Image
                            src="/placeholder.svg?height=100&width=100"
                            alt="Player 2 Patronus"
                            width={100}
                            height={100}
                            className="object-contain"
                          />
                        </div>
                      </div>

                      <div className="mt-4 text-center">
                        <Badge className="bg-purple-900/20 border-purple-500/30 text-purple-300">
                          Round {battle?.round}
                        </Badge>
                      </div>

                      <div className="mt-4 text-center text-xs text-gray-400">
                        {battle?.player1.name} vs {battle?.player2.name}
                      </div>
                    </div>

                    {/* Player 2 */}
                    <div className="md:col-span-2 bg-gray-900/50 border border-gray-800 rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-red-900/50 to-orange-900/50 rounded-full mr-2 flex items-center justify-center border border-red-500/30">
                            <Image
                              src={battle?.player2.avatar || "/placeholder.svg"}
                              alt={battle?.player2.name || "Player 2"}
                              width={40}
                              height={40}
                              className="rounded-full"
                            />
                          </div>
                          <div>
                            <h3 className="font-serif text-sm">{battle?.player2.name}</h3>
                            <p className="text-xs text-red-400">Level {battle?.player2.level}</p>
                          </div>
                        </div>

                        <div className="flex">
                          {[...Array(2)].map((_, i) => (
                            <Heart
                              key={i}
                              className={`h-5 w-5 ${i < (battle?.player2.hearts || 0) ? "text-red-500 fill-red-500" : "text-gray-600"} mr-1`}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2 mb-2">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Health</span>
                            <span>{battle?.player2.health}/100</span>
                          </div>
                          <Progress
                            value={battle?.player2.health}
                            className="h-2 bg-gray-800"
                            indicatorClassName="bg-gradient-to-r from-red-500 to-rose-500"
                          />
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <Badge className="bg-gray-800 border-0">Odds: {battle?.player2.odds}x</Badge>

                        <Button
                          size="sm"
                          className={`${
                            selectedPlayer === 2 ? "bg-red-600 hover:bg-red-700" : "bg-gray-800 hover:bg-gray-700"
                          }`}
                          onClick={() => setSelectedPlayer(2)}
                          disabled={!isWalletConnected}
                        >
                          Bet on {battle?.player2.name.split(" ")[0]}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Battle Log and Betting */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2 bg-gray-900/30 border border-gray-800 rounded-lg p-4">
                    <Tabs defaultValue="log">
                      <TabsList className="grid w-full grid-cols-2 bg-gray-900/50 border border-gray-800">
                        <TabsTrigger value="log" className="data-[state=active]:bg-gray-800">
                          Battle Log
                        </TabsTrigger>
                        <TabsTrigger value="spells" className="data-[state=active]:bg-gray-800">
                          Recent Spells
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent
                        value="log"
                        className="mt-4 h-64 overflow-y-auto space-y-2 text-sm font-mono battle-log"
                      >
                        <p className="text-gray-400">• Battle begins! Prepare your spells...</p>
                        <p className="text-purple-400">
                          • {battle?.player1.name} cast <span className="text-white">Protego</span>. Shield active for 2
                          rounds.
                        </p>
                        <p className="text-red-400">
                          • {battle?.player2.name} cast <span className="text-white">Incendio</span>. Shield absorbed 15
                          damage.
                        </p>
                        <p className="text-gray-400">• Round 1 complete. Round 2 beginning...</p>
                        <p className="text-purple-400">
                          • {battle?.player1.name} cast <span className="text-white">Stupefy</span>.{" "}
                          {battle?.player2.name} takes 18 damage.
                        </p>
                        <p className="text-red-400">
                          • {battle?.player2.name} cast <span className="text-white">Ventus</span>.{" "}
                          {battle?.player1.name} takes 10 damage.
                        </p>
                        <p className="text-purple-400">• {battle?.player1.name} summons Phoenix Patronus!</p>
                        <p className="text-red-400">
                          • {battle?.player2.name} cast <span className="text-white">Glacius</span>.{" "}
                          {battle?.player1.name} takes 12 damage.
                        </p>
                      </TabsContent>

                      <TabsContent value="spells" className="mt-4 h-64 overflow-y-auto">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                            <div className="flex items-center">
                              <Flame className="h-4 w-4 text-red-400 mr-2" />
                              <span className="text-sm">Incendio</span>
                            </div>
                            <div className="text-xs text-gray-400">Cast by {battle?.player2.name}</div>
                          </div>

                          <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                            <div className="flex items-center">
                              <Shield className="h-4 w-4 text-purple-400 mr-2" />
                              <span className="text-sm">Protego</span>
                            </div>
                            <div className="text-xs text-gray-400">Cast by {battle?.player1.name}</div>
                          </div>

                          <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                            <div className="flex items-center">
                              <Zap className="h-4 w-4 text-yellow-400 mr-2" />
                              <span className="text-sm">Stupefy</span>
                            </div>
                            <div className="text-xs text-gray-400">Cast by {battle?.player1.name}</div>
                          </div>

                          <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                            <div className="flex items-center">
                              <Wind className="h-4 w-4 text-emerald-400 mr-2" />
                              <span className="text-sm">Ventus</span>
                            </div>
                            <div className="text-xs text-gray-400">Cast by {battle?.player2.name}</div>
                          </div>

                          <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                            <div className="flex items-center">
                              <Snowflake className="h-4 w-4 text-blue-400 mr-2" />
                              <span className="text-sm">Glacius</span>
                            </div>
                            <div className="text-xs text-gray-400">Cast by {battle?.player2.name}</div>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>

                  <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-4">
                    <h3 className="font-medium text-lg mb-4">Place Your Bet</h3>

                    {isWalletConnected ? (
                      <>
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium mb-1 block">Bet Amount (WIZ)</label>
                            <Input
                              type="number"
                              placeholder="Enter amount"
                              className="bg-gray-800/50 border-gray-700"
                              value={betAmount}
                              onChange={(e) => setBetAmount(e.target.value)}
                            />
                          </div>

                          <div>
                            <label className="text-sm font-medium mb-1 block">Selected Wizard</label>
                            <div className="grid grid-cols-2 gap-2">
                              <Button
                                variant="outline"
                                className={`${
                                  selectedPlayer === 1
                                    ? "bg-purple-900/30 border-purple-500/30"
                                    : "bg-transparent border-gray-700"
                                }`}
                                onClick={() => setSelectedPlayer(1)}
                              >
                                {battle?.player1.name.split(" ")[0]}
                              </Button>
                              <Button
                                variant="outline"
                                className={`${
                                  selectedPlayer === 2
                                    ? "bg-red-900/30 border-red-500/30"
                                    : "bg-transparent border-gray-700"
                                }`}
                                onClick={() => setSelectedPlayer(2)}
                              >
                                {battle?.player2.name.split(" ")[0]}
                              </Button>
                            </div>
                          </div>

                          {selectedPlayer && (
                            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-3">
                              <div className="flex justify-between text-sm mb-1">
                                <span>Potential Winnings:</span>
                                <span className="text-green-400">
                                  {betAmount && selectedPlayer
                                    ? `${(Number.parseFloat(betAmount) * (selectedPlayer === 1 ? battle?.player1.odds || 0 : battle?.player2.odds || 0)).toFixed(2)} WIZ`
                                    : "0.00 WIZ"}
                                </span>
                              </div>
                              <div className="flex justify-between text-xs text-gray-400">
                                <span>Odds:</span>
                                <span>{selectedPlayer === 1 ? battle?.player1.odds : battle?.player2.odds}x</span>
                              </div>
                            </div>
                          )}

                          <Button
                            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                            onClick={placeBet}
                            disabled={!selectedPlayer || !betAmount || Number.parseFloat(betAmount) <= 0}
                          >
                            Place Bet
                          </Button>
                        </div>

                        <div className="mt-4 text-xs text-gray-400">
                          <p>• Bets can only be placed before Round 3</p>
                          <p>• Minimum bet: 5 WIZ</p>
                          <p>• Winner takes the entire betting pool</p>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-400 mb-4">Connect your wallet to place bets</p>
                        <ConnectWallet onConnect={() => setIsWalletConnected(true)} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-8 flex flex-col items-center justify-center h-96">
                <Trophy className="h-16 w-16 text-purple-400 mb-4 opacity-50" />
                <h2 className="font-serif text-2xl mb-2">Select a Battle</h2>
                <p className="text-gray-400 text-center max-w-md">
                  Choose a live magical duel from the list to watch the battle and place your bets.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

