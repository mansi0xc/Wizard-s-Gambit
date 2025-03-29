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
  Cat,
  BookOpen,
  Sparkles,
  HelpCircle,
  Heart,
  Users,
  Coins,
  Trophy,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer"
import { Spellbook } from "@/components/spellbook"
import { ConnectWallet } from "@/components/connect-wallet"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

export default function BattlePage() {
  // State for battle
  const [round, setRound] = useState(1)
  const [playerHealth, setPlayerHealth] = useState(85)
  const [opponentHealth, setOpponentHealth] = useState(65)
  const [playerMana, setPlayerMana] = useState(70)
  const [opponentMana, setOpponentMana] = useState(80)
  const [playerHearts, setPlayerHearts] = useState(2)
  const [opponentHearts, setOpponentHearts] = useState(2)
  const [battleLog, setBattleLog] = useState([
    "• Battle begins! Prepare your spells...",
    "• You cast Protego. Shield active for 2 rounds.",
    "• Opponent cast Incendio. Your shield absorbed 15 damage.",
    "• Round 1 complete. Round 2 beginning...",
  ])
  const [isSpectatorMode, setIsSpectatorMode] = useState(false)
  const [spectatorCount, setSpectatorCount] = useState(12)
  const [totalBetAmount, setTotalBetAmount] = useState(250)
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const [isPatronusActive, setIsPatronusActive] = useState(false)
  const [isProfessorActive, setIsProfessorActive] = useState(false)

  // State for round and battle result pop-ups
  const [showRoundResult, setShowRoundResult] = useState(false)
  const [showBattleResult, setShowBattleResult] = useState(false)
  const [roundWinner, setRoundWinner] = useState<"player" | "opponent" | null>(null)
  const [battleWinner, setBattleWinner] = useState<"player" | "opponent" | null>(null)
  const [battleEnded, setBattleEnded] = useState(false)

  // Simulate battle progression
  useEffect(() => {
    if (battleEnded) return

    const timer = setInterval(() => {
      if (Math.random() > 0.7) {
        // Simulate battle events
        const events = [
          "• You cast Incendio! Opponent takes 12 damage.",
          "• Opponent casts Glacius! You take 10 damage.",
          "• You dodge opponent's attack!",
          "• Opponent's shield absorbs your spell.",
          "• Critical hit! Opponent takes 20 damage.",
        ]
        const newEvent = events[Math.floor(Math.random() * events.length)]
        setBattleLog((prev) => [...prev, newEvent].slice(-8))

        // Update health randomly
        if (newEvent.includes("You take")) {
          setPlayerHealth((prev) => Math.max(prev - Math.floor(Math.random() * 15), 0))
        } else if (newEvent.includes("Opponent takes")) {
          setOpponentHealth((prev) => Math.max(prev - Math.floor(Math.random() * 15), 0))
        }

        // Update mana
        setPlayerMana((prev) => Math.min(prev + 5, 100))
        setOpponentMana((prev) => Math.min(prev + 5, 100))

        // Check if round should end
        if (playerHealth <= 20 || opponentHealth <= 20) {
          // Determine round winner
          const winner = playerHealth <= 20 ? "opponent" : "player"
          setRoundWinner(winner)

          // Update hearts
          if (winner === "player") {
            setOpponentHearts((prev) => Math.max(prev - 1, 0))
            // Check if battle is over
            if (opponentHearts <= 1) {
              setBattleWinner("player")
              setBattleEnded(true)
              setShowBattleResult(true)
            } else {
              setShowRoundResult(true)
            }
          } else {
            setPlayerHearts((prev) => Math.max(prev - 1, 0))
            // Check if battle is over
            if (playerHearts <= 1) {
              setBattleWinner("opponent")
              setBattleEnded(true)
              setShowBattleResult(true)
            } else {
              setShowRoundResult(true)
            }
          }

          // Reset health for next round
          setPlayerHealth(85)
          setOpponentHealth(65)

          // Increment round
          setRound((prev) => prev + 1)
          setBattleLog((prev) => [...prev, • Round ${round} complete! Round ${round + 1} beginning...])
        }
      }

      // Randomly update spectator count and bet amount for realism
      if (Math.random() > 0.8) {
        setSpectatorCount((prev) => prev + Math.floor(Math.random() * 3) - 1)
        setTotalBetAmount((prev) => prev + Math.floor(Math.random() * 50) - 25)
      }
    }, 3000)

    return () => clearInterval(timer)
  }, [round, playerHealth, opponentHealth, playerHearts, opponentHearts, battleEnded])

  // Handle spell casting
  const castSpell = (spellType: string) => {
    if (playerMana < 15) {
      setBattleLog((prev) => [...prev, "• Not enough mana to cast spell!"])
      return
    }

    setPlayerMana((prev) => prev - 15)
    const damage = Math.floor(Math.random() * 15) + 10
    setBattleLog((prev) => [...prev, • You cast ${spellType}! Opponent takes ${damage} damage.])
    setOpponentHealth((prev) => Math.max(prev - damage, 0))
  }

  // Handle patronus summoning
  const summonPatronus = () => {
    if (playerMana < 40) {
      setBattleLog((prev) => [...prev, "• Not enough mana to summon Patronus!"])
      return
    }

    setPlayerMana((prev) => prev - 40)
    setBattleLog((prev) => [
      ...prev,
      "• You summon your Phoenix Patronus! Your spells are 30% more powerful for 2 rounds.",
    ])
    setIsPatronusActive(true)

    setTimeout(() => {
      setIsPatronusActive(false)
      setBattleLog((prev) => [...prev, "• Your Patronus fades away."])
    }, 10000)
  }

  // Handle professor summoning
  const summonProfessor = () => {
    if (playerMana < 30) {
      setBattleLog((prev) => [...prev, "• Not enough mana to summon Professor!"])
      return
    }

    setPlayerMana((prev) => prev - 30)
    setBattleLog((prev) => [
      ...prev,
      "• Professor Dumbledore appears! He provides strategic advice and restores 20 health.",
    ])
    setPlayerHealth((prev) => Math.min(prev + 20, 100))
    setIsProfessorActive(true)

    setTimeout(() => {
      setIsProfessorActive(false)
      setBattleLog((prev) => [...prev, "• Professor Dumbledore disappears with a nod of encouragement."])
    }, 8000)
  }

  // Toggle spectator mode
  const toggleSpectatorMode = () => {
    setIsSpectatorMode(!isSpectatorMode)
  }

  // Handle continuing to next round
  const continueToNextRound = () => {
    setShowRoundResult(false)
  }

  // Handle battle end
  const endBattle = () => {
    setShowBattleResult(false)
  }

  // Reset battle
  const resetBattle = () => {
    setRound(1)
    setPlayerHealth(85)
    setOpponentHealth(65)
    setPlayerMana(70)
    setOpponentMana(80)
    setPlayerHearts(2)
    setOpponentHearts(2)
    setBattleLog([
      "• Battle begins! Prepare your spells...",
      "• You cast Protego. Shield active for 2 rounds.",
      "• Opponent cast Incendio. Your shield absorbed 15 damage.",
      "• Round 1 complete. Round 2 beginning...",
    ])
    setIsPatronusActive(false)
    setIsProfessorActive(false)
    setBattleEnded(false)
    setBattleWinner(null)
    setRoundWinner(null)
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-gray-100 relative overflow-hidden pt-16">
      {/* Magical sigils on the ground */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 border border-purple-900/20 rounded-full"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 border border-purple-900/10 rounded-full"></div>
        <div className="absolute top-1/4 left-1/4 w-128 h-128 border border-purple-900/5 rounded-full"></div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl max-h-4xl">
          <svg viewBox="0 0 100 100" className="w-full h-full opacity-5">
            <path d="M50 0 L100 50 L50 100 L0 50 Z" fill="none" stroke="rgb(139, 92, 246)" strokeWidth="0.2" />
            <path d="M50 10 L90 50 L50 90 L10 50 Z" fill="none" stroke="rgb(139, 92, 246)" strokeWidth="0.2" />
            <circle cx="50" cy="50" r="40" fill="none" stroke="rgb(139, 92, 246)" strokeWidth="0.2" />
            <circle cx="50" cy="50" r="30" fill="none" stroke="rgb(139, 92, 246)" strokeWidth="0.2" />
            <circle cx="50" cy="50" r="20" fill="none" stroke="rgb(139, 92, 246)" strokeWidth="0.2" />
          </svg>
        </div>
      </div>

      <header className="container mx-auto pt-4 px-4 z-10 relative flex justify-between items-center">
        <Link href="/deck" className="text-gray-400 hover:text-white transition-colors flex items-center">
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span className="text-sm">Return to Deck</span>
        </Link>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2 bg-gray-900/50 border border-gray-800 rounded-full px-3 py-1">
            <div className="w-3 h-3 rounded-full bg-purple-500 animate-pulse"></div>
            <span className="text-sm font-medium">
              Round{" "}
              <span id="round-counter" className="text-purple-400">
                {round}
              </span>
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="bg-transparent border-gray-800 hover:bg-gray-800 flex items-center gap-1"
            onClick={toggleSpectatorMode}
          >
            {isSpectatorMode ? "Duel Mode" : "Spectate"}
            <Users className="h-3 w-3 ml-1" />
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-4 z-10 relative">
        {/* Spectator Mode UI */}
        {isSpectatorMode && (
          <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <Users className="h-5 w-5 text-blue-400 mr-2" />
                <span className="font-medium">Spectator Mode</span>
                <Badge variant="outline" className="ml-2 bg-blue-900/20 border-blue-500/30 text-blue-300">
                  {spectatorCount} Watching
                </Badge>
              </div>

              <div className="flex items-center">
                <Coins className="h-5 w-5 text-yellow-400 mr-2" />
                <span className="font-medium">Total Bets: {totalBetAmount} WIZ</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-3">
                <h3 className="text-sm font-medium mb-2 flex items-center">
                  <Image
                    src="/placeholder.svg?height=30&width=30"
                    alt="Player"
                    width={20}
                    height={20}
                    className="rounded-full mr-2"
                  />
                  Archmage Lumina
                </h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-xs text-gray-400 mr-2">Odds:</span>
                    <span className="text-xs text-green-400">1.8x</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xs text-gray-400 mr-2">Bets:</span>
                    <span className="text-xs">{Math.round(totalBetAmount * 0.6)} WIZ</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-3">
                <h3 className="text-sm font-medium mb-2 flex items-center">
                  <Image
                    src="/placeholder.svg?height=30&width=30"
                    alt="Opponent"
                    width={20}
                    height={20}
                    className="rounded-full mr-2"
                  />
                  Sorcerer Malachai
                </h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-xs text-gray-400 mr-2">Odds:</span>
                    <span className="text-xs text-green-400">2.2x</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xs text-gray-400 mr-2">Bets:</span>
                    <span className="text-xs">{Math.round(totalBetAmount * 0.4)} WIZ</span>
                  </div>
                </div>
              </div>
            </div>

            {!isWalletConnected ? (
              <ConnectWallet onConnect={() => setIsWalletConnected(true)} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                  Bet on Archmage Lumina
                </Button>
                <Button className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700">
                  Bet on Sorcerer Malachai
                </Button>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
          {/* Player Side - Styled like the screenshot */}
          <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-4 order-2 lg:order-1 lg:col-span-2">
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-serif text-xl">Your Wizard</h2>
              <div className="text-xs text-gray-400">Level 42</div>
            </div>

            {/* Hearts display */}
            <div className="flex justify-center mb-2">
              {[...Array(2)].map((_, i) => (
                <Heart
                  key={i}
                  className={h-6 w-6 ${i < playerHearts ? "text-red-500 fill-red-500" : "text-gray-600"} mx-1}
                />
              ))}
            </div>

            <div className="flex flex-col items-center mb-4">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-900/50 to-indigo-900/50 rounded-full mb-3 flex items-center justify-center border border-purple-500/30">
                <Image
                  src="/placeholder.svg?height=80&width=80"
                  alt="Player Avatar"
                  width={80}
                  height={80}
                  className="rounded-full"
                />
              </div>
              <div className="text-center">
                <p className="font-medium">Archmage Lumina</p>
                <p className="text-xs text-purple-400">Phoenix Patronus • Elder Wand</p>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Health</span>
                  <span id="player-health">{playerHealth}/100</span>
                </div>
                <Progress
                  value={playerHealth}
                  className="h-2 bg-gray-800"
                  indicatorClassName="bg-gradient-to-r from-purple-500 to-indigo-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Mana</span>
                  <span id="player-mana">{playerMana}/100</span>
                </div>
                <Progress
                  value={playerMana}
                  className="h-2 bg-gray-800"
                  indicatorClassName="bg-gradient-to-r from-blue-500 to-indigo-500"
                />
              </div>
            </div>

            {/* Active Effects */}
            <div className="border-t border-gray-800 pt-3 mb-4">
              <h3 className="text-sm font-medium mb-2">Active Effects:</h3>
              <div className="flex flex-wrap gap-1">
                <div className="bg-blue-900/20 border border-blue-900/30 rounded px-2 py-1 text-xs flex items-center">
                  <Shield className="h-3 w-3 mr-1 text-blue-400" />
                  <span>Shield Charm (2 rounds)</span>
                </div>
                {isPatronusActive && (
                  <div className="bg-blue-900/20 border border-blue-900/30 rounded px-2 py-1 text-xs flex items-center">
                    <Sparkles className="h-3 w-3 mr-1 text-blue-400" />
                    <span>Patronus (2 rounds)</span>
                  </div>
                )}
                {isProfessorActive && (
                  <div className="bg-purple-900/20 border border-purple-900/30 rounded px-2 py-1 text-xs flex items-center">
                    <HelpCircle className="h-3 w-3 mr-1 text-purple-400" />
                    <span>Professor's Aid</span>
                  </div>
                )}
              </div>
            </div>

            {/* Companion Ability */}
            <div>
              <h3 className="text-sm font-medium mb-2">Companion Ability:</h3>
              <Button className="w-full bg-indigo-900/30 border border-indigo-500/30 hover:bg-indigo-900/50 text-white flex items-center justify-center gap-2">
                <Cat className="h-4 w-4" />
                <span>Owl's Foresight</span>
                <span className="text-xs opacity-70">(1 use)</span>
              </Button>
            </div>
          </div>

          {/* Battle Arena - Center */}
          <div className="order-1 lg:order-2 lg:col-span-3">
            {/* Battle Log */}
            <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-3 mb-4">
              <div className="flex justify-between items-center mb-2">
                <div className="text-sm text-gray-400">Battle Log</div>
                <div className="text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-300">Live</div>
              </div>

              <div className="h-28 overflow-y-auto space-y-1 text-sm mb-1 font-mono battle-log">
                {battleLog.map((log, index) => (
                  <p
                    key={index}
                    className={`${
                      log.includes("You cast") || log.includes("Critical hit")
                        ? "text-purple-400"
                        : log.includes("Opponent")
                          ? "text-red-400"
                          : "text-gray-400"
                    }`}
                  >
                    {log}
                  </p>
                ))}
              </div>
            </div>

            {/* Battle Arena */}
            <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-4 mb-4 relative">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-purple-900/10 rounded-lg pointer-events-none"></div>

              {/* Player Hearts and Health */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-900/50 to-indigo-900/50 rounded-full flex items-center justify-center border border-purple-500/30">
                    <Image
                      src="/placeholder.svg?height=30&width=30"
                      alt="Player"
                      width={30}
                      height={30}
                      className="rounded-full"
                    />
                  </div>
                  <Progress
                    value={playerHealth}
                    className="w-24 h-1.5 bg-gray-800 ml-2"
                    indicatorClassName="bg-gradient-to-r from-purple-500 to-indigo-500"
                  />
                </div>

                <div className="flex items-center">
                  <Progress
                    value={opponentHealth}
                    className="w-24 h-1.5 bg-gray-800 mr-2"
                    indicatorClassName="bg-gradient-to-r from-red-500 to-rose-500"
                  />
                  <div className="w-8 h-8 bg-gradient-to-br from-red-900/50 to-orange-900/50 rounded-full flex items-center justify-center border border-red-500/30">
                    <Image
                      src="/placeholder.svg?height=30&width=30"
                      alt="Opponent"
                      width={30}
                      height={30}
                      className="rounded-full"
                    />
                  </div>
                </div>
              </div>

              {/* Battle Visualization */}
              <div className="flex justify-center items-center h-40 relative">
                {isPatronusActive && (
                  <div className="absolute left-0 w-24 h-24 opacity-70 animate-pulse">
                    <Image
                      src="/placeholder.svg?height=100&width=100"
                      alt="Player Patronus"
                      width={100}
                      height={100}
                      className="object-contain"
                    />
                  </div>
                )}

                <div className="w-16 h-16 bg-purple-500/10 border border-purple-500/20 rounded-full flex items-center justify-center relative">
                  <div className="absolute inset-0 rounded-full bg-purple-500/5 animate-ping"></div>
                  <span className="text-2xl">⚡</span>
                </div>

                {isProfessorActive && (
                  <div className="absolute top-0 w-16 h-16 opacity-70">
                    <Image
                      src="/placeholder.svg?height=60&width=60"
                      alt="Professor"
                      width={60}
                      height={60}
                      className="object-contain"
                    />
                  </div>
                )}

                <div className="absolute right-0 w-24 h-24 opacity-30">
                  <Image
                    src="/placeholder.svg?height=100&width=100"
                    alt="Opponent Patronus"
                    width={100}
                    height={100}
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Opponent Side - Styled like the screenshot */}
          <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-4 order-3 lg:col-span-2">
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-serif text-xl">Opponent</h2>
              <div className="text-xs text-gray-400">Level 40</div>
            </div>

            {/* Hearts display */}
            <div className="flex justify-center mb-2">
              {[...Array(2)].map((_, i) => (
                <Heart
                  key={i}
                  className={h-6 w-6 ${i < opponentHearts ? "text-red-500 fill-red-500" : "text-gray-600"} mx-1}
                />
              ))}
            </div>

            <div className="flex flex-col items-center mb-4">
              <div className="w-24 h-24 bg-gradient-to-br from-red-900/50 to-orange-900/50 rounded-full mb-3 flex items-center justify-center border border-red-500/30">
                <Image
                  src="/placeholder.svg?height=80&width=80"
                  alt="Opponent Avatar"
                  width={80}
                  height={80}
                  className="rounded-full"
                />
              </div>
              <div className="text-center">
                <p className="font-medium">Sorcerer Malachai</p>
                <p className="text-xs text-red-400">Wolf Patronus • Dragon Heartstring Wand</p>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Health</span>
                  <span id="opponent-health">{opponentHealth}/100</span>
                </div>
                <Progress
                  value={opponentHealth}
                  className="h-2 bg-gray-800"
                  indicatorClassName="bg-gradient-to-r from-red-500 to-rose-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Mana</span>
                  <span id="opponent-mana">{opponentMana}/100</span>
                </div>
                <Progress
                  value={opponentMana}
                  className="h-2 bg-gray-800"
                  indicatorClassName="bg-gradient-to-r from-orange-500 to-amber-500"
                />
              </div>
            </div>

            {/* Active Effects */}
            <div className="border-t border-gray-800 pt-3">
              <h3 className="text-sm font-medium mb-2">Active Effects:</h3>
              <div className="flex flex-wrap gap-1">
                <div className="bg-red-900/20 border border-red-900/30 rounded px-2 py-1 text-xs flex items-center">
                  <Flame className="h-3 w-3 mr-1 text-red-400" />
                  <span>Fire Aura (1 round)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Spell Casting Taskbar */}
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900/80 backdrop-blur-sm border-t border-gray-800 p-2 z-20">
          <div className="container mx-auto flex items-center justify-between">
            {/* Patronus Summon */}
            <Button
              variant="outline"
              className={bg-transparent ${isPatronusActive ? "border-blue-500 text-blue-400" : "border-blue-900/30 hover:bg-blue-900/20 hover:border-blue-500/30"} flex flex-col items-center py-2 h-auto min-w-[70px]}
              onClick={summonPatronus}
              disabled={isPatronusActive || playerMana < 40}
            >
              <Sparkles className={h-5 w-5 ${isPatronusActive ? "text-blue-400" : "text-blue-500/70"} mb-1} />
              <span className="text-xs">Patronus</span>
              <span className="text-[10px] text-blue-400/70">40 mana</span>
            </Button>

            {/* Spells */}
            <div className="flex-1 flex justify-center gap-1 sm:gap-2">
              <Drawer>
                <DrawerTrigger asChild>
                  <Button
                    variant="outline"
                    className="bg-transparent border-gray-700 hover:bg-gray-800 flex flex-col items-center py-2 h-auto"
                  >
                    <BookOpen className="h-5 w-5 text-purple-400 mb-1" />
                    <span className="text-xs">Spellbook</span>
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="bg-gray-900 border-t border-gray-800">
                  <div className="mx-auto w-full max-w-4xl">
                    <Spellbook />
                  </div>
                </DrawerContent>
              </Drawer>

              <Button
                variant="outline"
                className="bg-transparent border-red-900/30 hover:bg-red-900/20 hover:border-red-500/30 flex flex-col items-center py-2 h-auto min-w-[70px]"
                onClick={() => castSpell("Incendio")}
                disabled={playerMana < 15}
              >
                <Flame className="h-5 w-5 text-red-400 mb-1" />
                <span className="text-xs">Incendio</span>
                <span className="text-[10px] text-red-400/70">15 mana</span>
              </Button>

              <Button
                variant="outline"
                className="bg-transparent border-blue-900/30 hover:bg-blue-900/20 hover:border-blue-500/30 flex flex-col items-center py-2 h-auto min-w-[70px]"
                onClick={() => castSpell("Glacius")}
                disabled={playerMana < 15}
              >
                <Snowflake className="h-5 w-5 text-blue-400 mb-1" />
                <span className="text-xs">Glacius</span>
                <span className="text-[10px] text-blue-400/70">15 mana</span>
              </Button>

              <Button
                variant="outline"
                className="bg-transparent border-emerald-900/30 hover:bg-emerald-900/20 hover:border-emerald-500/30 flex flex-col items-center py-2 h-auto min-w-[70px]"
                onClick={() => castSpell("Ventus")}
                disabled={playerMana < 15}
              >
                <Wind className="h-5 w-5 text-emerald-400 mb-1" />
                <span className="text-xs">Ventus</span>
                <span className="text-[10px] text-emerald-400/70">15 mana</span>
              </Button>

              <Button
                variant="outline"
                className="bg-transparent border-yellow-900/30 hover:bg-yellow-900/20 hover:border-yellow-500/30 flex flex-col items-center py-2 h-auto min-w-[70px]"
                onClick={() => castSpell("Stupefy")}
                disabled={playerMana < 15}
              >
                <Zap className="h-5 w-5 text-yellow-400 mb-1" />
                <span className="text-xs">Stupefy</span>
                <span className="text-[10px] text-yellow-400/70">15 mana</span>
              </Button>

              <Button
                variant="outline"
                className="bg-transparent border-purple-900/30 hover:bg-purple-900/20 hover:border-purple-500/30 flex flex-col items-center py-2 h-auto min-w-[70px]"
                onClick={() => castSpell("Protego")}
                disabled={playerMana < 15}
              >
                <Shield className="h-5 w-5 text-purple-400 mb-1" />
                <span className="text-xs">Protego</span>
                <span className="text-[10px] text-purple-400/70">15 mana</span>
              </Button>
            </div>

            {/* Professor Summon */}
            <Button
              variant="outline"
              className={bg-transparent ${isProfessorActive ? "border-purple-500 text-purple-400" : "border-purple-900/30 hover:bg-purple-900/20 hover:border-purple-500/30"} flex flex-col items-center py-2 h-auto min-w-[70px]}
              onClick={summonProfessor}
              disabled={isProfessorActive || playerMana < 30}
            >
              <HelpCircle className={h-5 w-5 ${isProfessorActive ? "text-purple-400" : "text-purple-500/70"} mb-1} />
              <span className="text-xs">Professor</span>
              <span className="text-[10px] text-purple-400/70">30 mana</span>
            </Button>
          </div>
        </div>
      </main>

      {/* Round Result Dialog */}
      <Dialog open={showRoundResult} onOpenChange={setShowRoundResult}>
        <DialogContent className="bg-gray-900 border border-gray-800 text-gray-100 max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl text-center">Round {round - 1} Complete!</DialogTitle>
            <DialogDescription className="text-center">
              {roundWinner === "player" ? (
                <span className="text-purple-400">You won this round!</span>
              ) : (
                <span className="text-red-400">Your opponent won this round!</span>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-center items-center py-6">
            {roundWinner === "player" ? (
              <div className="w-24 h-24 bg-purple-900/30 rounded-full flex items-center justify-center">
                <Trophy className="h-12 w-12 text-yellow-400" />
              </div>
            ) : (
              <div className="w-24 h-24 bg-red-900/30 rounded-full flex items-center justify-center">
                <Shield className="h-12 w-12 text-red-400" />
              </div>
            )}
          </div>

          <div className="flex justify-between items-center px-4 py-2 bg-gray-800/50 rounded-lg mb-4">
            <div className="flex items-center">
              <div className="flex mr-2">
                {[...Array(2)].map((_, i) => (
                  <Heart
                    key={i}
                    className={h-5 w-5 ${i < playerHearts ? "text-red-500 fill-red-500" : "text-gray-600"} mr-1}
                  />
                ))}
              </div>
              <span>Archmage Lumina</span>
            </div>
            <div className="text-gray-400">vs</div>
            <div className="flex items-center">
              <span>Sorcerer Malachai</span>
              <div className="flex ml-2">
                {[...Array(2)].map((_, i) => (
                  <Heart
                    key={i}
                    className={h-5 w-5 ${i < opponentHearts ? "text-red-500 fill-red-500" : "text-gray-600"} ml-1}
                  />
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              onClick={continueToNextRound}
            >
              Continue to Round {round}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Battle Result Dialog */}
      <Dialog open={showBattleResult} onOpenChange={setShowBattleResult}>
        <DialogContent className="bg-gray-900 border border-gray-800 text-gray-100 max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl text-center">Battle Complete!</DialogTitle>
            <DialogDescription className="text-center">
              {battleWinner === "player" ? (
                <span className="text-purple-400">Victory! You have defeated your opponent!</span>
              ) : (
                <span className="text-red-400">Defeat! Your opponent has bested you!</span>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-center items-center py-8">
            {battleWinner === "player" ? (
              <div className="w-32 h-32 bg-purple-900/30 rounded-full flex items-center justify-center">
                <Trophy className="h-16 w-16 text-yellow-400" />
              </div>
            ) : (
              <div className="w-32 h-32 bg-red-900/30 rounded-full flex items-center justify-center">
                <Shield className="h-16 w-16 text-red-400" />
              </div>
            )}
          </div>

          <div className="text-center mb-6">
            <p className="text-lg font-medium mb-2">
              {battleWinner === "player" ? "Congratulations, Archmage!" : "Better luck next time, Wizard!"}
            </p>
            <p className="text-gray-400">
              {battleWinner === "player"
                ? "Your mastery of the arcane arts has proven superior."
                : "Even the greatest wizards face defeat. Learn and grow stronger."}
            </p>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              className="flex-1 bg-transparent border-gray-700 hover:bg-gray-800"
              onClick={endBattle}
            >
              Return to Deck
            </Button>
            <Button
              className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              onClick={resetBattle}
            >
              Duel Again
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <script
        dangerouslySetInnerHTML={{
          __html: `
          document.addEventListener('DOMContentLoaded', function() {
            // Add subtle hover effects to spell buttons
            const spellButtons = document.querySelectorAll('button');
            spellButtons.forEach(button => {
              button.addEventListener('mouseenter', () => {
                button.style.transform = 'translateY(-2px)';
                button.style.transition = 'all 0.2s ease';
              });
              
              button.addEventListener('mouseleave', () => {
                button.style.transform = 'translateY(0)';
              });
            });
          });
        `,
        }}
      />
    </div>
  )
}