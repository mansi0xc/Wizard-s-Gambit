"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { io, type Socket } from "socket.io-client"
import { Shield, Flame, Snowflake, Wind, ArrowLeft, Heart, Users, Trophy, Wifi } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ConnectWallet } from "@/components/connect-wallet"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BattleCard } from "@/components/battle-card"

// Types for our game state
type Element = "inferno" | "glacius" | "ventus"
type SpellLevel = 1 | 2 | 3
type Player = "player" | "opponent"
type BattleOutcome = "win" | "lose" | "draw"

interface RoundResult {
  winner: Player | null
  playerElement: Element
  playerLevel: SpellLevel
  opponentElement: Element
  opponentLevel: SpellLevel
  damage: number
  isVoid: boolean
}

interface BattleState {
  round: number
  playerHealth: number
  opponentHealth: number
  playerWins: number
  opponentWins: number
  playerUsedDefense: boolean
  opponentUsedDefense: boolean
  currentRoundResults: RoundResult[]
  battleLog: string[]
  currentBattle: number
}

interface PlayerInfo {
  socketId: string
  type: string
}

export default function BattlePage() {
  // WebSocket connection
  const socketRef = useRef<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [roomId, setRoomId] = useState<string | null>(null)
  const [isWaitingForOpponent, setIsWaitingForOpponent] = useState(false)
  const [customServerIp, setCustomServerIp] = useState("")
  const [showConnectionDialog, setShowConnectionDialog] = useState(false)
  const [showRoomDialog, setShowRoomDialog] = useState(false)
  const [roomCodeInput, setRoomCodeInput] = useState("")
  const [mySocketId, setMySocketId] = useState<string | null>(null)
  const [opponentSocketId, setOpponentSocketId] = useState<string | null>(null)
  const [playersInRoom, setPlayersInRoom] = useState<string[]>([])

  // Battle state
  const [battleState, setBattleState] = useState<BattleState>({
    round: 1,
    playerHealth: 100,
    opponentHealth: 100,
    playerWins: 0,
    opponentWins: 0,
    playerUsedDefense: false,
    opponentUsedDefense: false,
    currentRoundResults: [],
    battleLog: ["• Connect to a server to begin"],
    currentBattle: 1,
  })

  // UI state
  const [selectedElement, setSelectedElement] = useState<Element | null>(null)
  const [selectedLevel, setSelectedLevel] = useState<SpellLevel>(1)
  const [isUsingDefense, setIsUsingDefense] = useState(false)
  const [showRoundResult, setShowRoundResult] = useState(false)
  const [showBattleResult, setShowBattleResult] = useState(false)
  const [roundWinner, setRoundWinner] = useState<Player | null>(null)
  const [battleWinner, setBattleWinner] = useState<Player | null>(null)
  const [isSpectatorMode, setIsSpectatorMode] = useState(false)
  const [spectatorCount, setSpectatorCount] = useState(0)
  const [totalBetAmount, setTotalBetAmount] = useState(0)
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const [battleEnded, setBattleEnded] = useState(false)
  const [waitingForOpponentMove, setWaitingForOpponentMove] = useState(false)

  // Initialize WebSocket connection
  useEffect(() => {
    const wsServer = customServerIp
      ? `http://${customServerIp}:3001`
      : process.env.NEXT_PUBLIC_WS_SERVER || "http://localhost:3001"

    // Connect to WebSocket server
    const socket = io(wsServer, {
      autoConnect: false,
      reconnectionAttempts: 3,
      reconnectionDelay: 1000,
    })

    socketRef.current = socket

    // Event listeners
    socket.on("connect", () => {
      setIsConnected(true)
      setMySocketId(socket?.id)
      addBattleLog("• Connected to battle server")
    })

    socket.on("disconnect", () => {
      setIsConnected(false)
      addBattleLog("• Disconnected from battle server")
    })
    
    

    socket.on("room_joined", (data: { roomId: string; isSpectator: boolean }) => {
      setRoomId(data.roomId)
      setIsWaitingForOpponent(!data.isSpectator)
      setIsSpectatorMode(data.isSpectator)
      addBattleLog(`• Joined room ${data.roomId}`)
      if (data.isSpectator) {
        addBattleLog("• Entered spectator mode")
      } else {
        addBattleLog("• Waiting for opponent...")
      }
    })

    socket.on("opponent_joined", () => {
      setIsWaitingForOpponent(false)
      addBattleLog("• Opponent has joined the battle!")
    })

    socket.on("spectator_count", (count: number) => {
      setSpectatorCount(count)
    })

    socket.on("bet_update", (amount: number) => {
      setTotalBetAmount(amount)
    })

    socket.on("room-players", (playerList: string[]) => {
      setPlayersInRoom(playerList)

      // Find opponent socket ID (the one that's not mine)
      if (playerList.length === 2) {
        const opponent = playerList.find((id) => id !== socket.id)
        if (opponent) {
          setOpponentSocketId(opponent)
        }
      }
    })

    socket.on("round_start", () => {
      setWaitingForOpponentMove(false)
      addBattleLog(`• Round ${battleState.round} begins! Choose your spell.`)
    })

    socket.on("round_result", (result: RoundResult) => {
      handleRoundResult(result)
      setWaitingForOpponentMove(false)
    })

    socket.on("battle_result", (winner: Player) => {
      setBattleWinner(winner)
      setBattleEnded(true)
      setShowBattleResult(true)
      addBattleLog(winner === "player" ? "• You won the battle!" : "• You lost the battle!")
    })

    socket.on("opponent_left", () => {
      addBattleLog("• Opponent has left the battle")
      setIsWaitingForOpponent(true)
      setWaitingForOpponentMove(false)
    })

    socket.on("error", (message: string) => {
      addBattleLog(`• Error: ${message}`)
      setWaitingForOpponentMove(false)
    })

    // Connect to server
    socket.connect()

    // Cleanup on unmount
    return () => {
      socket.disconnect()
    }
  }, [customServerIp])

  // Helper function to add messages to battle log
  const addBattleLog = (message: string) => {
    setBattleState((prev) => ({
      ...prev,
      battleLog: [...prev.battleLog.slice(-7), message],
    }))
  }

  // Determine the outcome of an element matchup
  const getElementOutcome = (playerElement: Element, opponentElement: Element): BattleOutcome => {
    if (playerElement === opponentElement) return "draw"

    const winConditions: Record<Element, Element> = {
      inferno: "glacius",
      glacius: "ventus",
      ventus: "inferno",
    }

    return winConditions[playerElement] === opponentElement ? "win" : "lose"
  }

  // Calculate damage based on element matchup and levels
  const calculateDamage = (
    playerElement: Element,
    playerLevel: SpellLevel,
    opponentElement: Element,
    opponentLevel: SpellLevel,
  ): { winner: Player | null; damage: number } => {
    const outcome = getElementOutcome(playerElement, opponentElement)

    if (outcome === "win") {
      return { winner: "player", damage: getLevelDamage(playerLevel) }
    } else if (outcome === "lose") {
      return { winner: "opponent", damage: getLevelDamage(opponentLevel) }
    } else {
      // Same element - higher level wins with damage = difference
      if (playerLevel > opponentLevel) {
        return { winner: "player", damage: getLevelDamage(playerLevel) - getLevelDamage(opponentLevel) }
      } else if (opponentLevel > playerLevel) {
        return { winner: "opponent", damage: getLevelDamage(opponentLevel) - getLevelDamage(playerLevel) }
      } else {
        // Same level - draw
        return { winner: null, damage: 0 }
      }
    }
  }

  // Get damage for a specific level
  const getLevelDamage = (level: SpellLevel): number => {
    return level === 1 ? 20 : level === 2 ? 25 : 30
  }

  // Handle round results from server
  const handleRoundResult = (result: RoundResult) => {
    setBattleState((prev) => {
      const newState = { ...prev }

      // Update health based on damage
      if (!result.isVoid) {
        if (result.winner === "player") {
          newState.opponentHealth = Math.max(0, newState.opponentHealth - result.damage)
        } else if (result.winner === "opponent") {
          newState.playerHealth = Math.max(0, newState.playerHealth - result.damage)
        }
      }

      // Add to round results
      newState.currentRoundResults = [...newState.currentRoundResults, result]

      // Update battle log
      let logMessage = ""
      if (result.isVoid) {
        logMessage = "• Defense card negated the round!"
      } else if (result.winner === null) {
        logMessage = "• Round ended in a draw!"
      } else {
        const winner = result.winner === "player" ? "You" : "Opponent"
        const loser = result.winner === "player" ? "Opponent" : "You"
        logMessage = `• ${winner} dealt ${result.damage} damage to ${loser}`
      }
      newState.battleLog = [...newState.battleLog, logMessage]

      // Check if round is complete (5 rounds)
      if (newState.currentRoundResults.length >= 5) {
        determineRoundWinner(newState)
      }

      return newState
    })
  }

  // Determine the winner of a complete round (5 battles)
  const determineRoundWinner = (state: BattleState) => {
    // Count wins
    const playerWins = state.currentRoundResults.filter((r) => r.winner === "player").length
    const opponentWins = state.currentRoundResults.filter((r) => r.winner === "opponent").length

    // Determine round winner
    let roundWinner: Player | null = null
    if (playerWins > opponentWins) {
      roundWinner = "player"
      state.playerWins += 1
    } else if (opponentWins > playerWins) {
      roundWinner = "opponent"
      state.opponentWins += 1
    }

    // Update UI
    setRoundWinner(roundWinner)
    setShowRoundResult(true)

    // Add to battle log
    if (roundWinner === "player") {
      addBattleLog("• You won this battle!")
    } else if (roundWinner === "opponent") {
      addBattleLog("• Opponent won this battle!")
    } else {
      addBattleLog("• Battle ended in a tie!")
    }

    // Reset for next battle
    state.round += 1
    state.playerHealth = 100
    state.opponentHealth = 100
    state.playerUsedDefense = false
    state.opponentUsedDefense = false
    state.currentRoundResults = []
    state.currentBattle += 1

    // Check if duel is over
    if (state.playerWins >= 2 || state.opponentWins >= 2) {
      setBattleWinner(state.playerWins >= 2 ? "player" : "opponent")
      setBattleEnded(true)
      setShowBattleResult(true)
    }
  }

  // Handle casting a spell
  const castSpell = (element: Element, level: SpellLevel, useDefense = false) => {
    if (!socketRef.current || !roomId) {
      // Fallback to local spell casting if not connected
      if (!isConnected) {
        simulateLocalRound(element, level, useDefense)
      }
      return
    }

    // Send spell to server
    socketRef.current.emit("cast_spell", {
      roomId,
      element,
      level,
      useDefense,
    })

    // Add to battle log
    addBattleLog(`• You cast ${element} level ${level}${useDefense ? " with defense" : ""}`)
    setWaitingForOpponentMove(true)
  }

  // Simulate a local round for offline testing
  const simulateLocalRound = (playerElement: Element, playerLevel: SpellLevel, useDefense: boolean) => {
    // Generate opponent's move
    const elements: Element[] = ["inferno", "glacius", "ventus"]
    const opponentElement = elements[Math.floor(Math.random() * elements.length)]
    const opponentLevel = [1, 2, 3][Math.floor(Math.random() * 3)] as SpellLevel
    const opponentUseDefense = Math.random() > 0.8 && !battleState.opponentUsedDefense

    // Calculate result
    const { winner, damage } = calculateDamage(playerElement, playerLevel, opponentElement, opponentLevel)

    // Check if defense is used
    const isVoid = (useDefense && winner === "opponent") || (opponentUseDefense && winner === "player")

    // Create result object
    const result: RoundResult = {
      winner: isVoid ? null : winner,
      playerElement,
      playerLevel,
      opponentElement,
      opponentLevel,
      damage,
      isVoid,
    }

    // Update battle log
    addBattleLog(
      `• Opponent cast ${opponentElement} level ${opponentLevel}${opponentUseDefense ? " with defense" : ""}`,
    )

    // Update defense used flags
    setBattleState((prev) => ({
      ...prev,
      playerUsedDefense: prev.playerUsedDefense || useDefense,
      opponentUsedDefense: prev.opponentUsedDefense || opponentUseDefense,
    }))

    // Process result
    handleRoundResult(result)
  }

  // Continue to next round
  const continueToNextRound = () => {
    setShowRoundResult(false)
    if (socketRef.current && roomId) {
      socketRef.current.emit("next_round", { roomId })
    }
    addBattleLog(`• Battle ${battleState.currentBattle} starting...`)
  }

  // End battle
  const endBattle = () => {
    setShowBattleResult(false)
    if (socketRef.current && roomId) {
      socketRef.current.emit("leave_room", { roomId })
    }
  }

  // Reset battle
  const resetBattle = () => {
    setBattleState({
      round: 1,
      playerHealth: 100,
      opponentHealth: 100,
      playerWins: 0,
      opponentWins: 0,
      playerUsedDefense: false,
      opponentUsedDefense: false,
      currentRoundResults: [],
      battleLog: ["• Battle begins! Prepare your spells..."],
      currentBattle: 1,
    })
    setBattleEnded(false)
    setBattleWinner(null)
    setRoundWinner(null)
    setShowBattleResult(false)
  }

  // Quick join battle
  const quickJoinBattle = () => {
    if (socketRef.current) {
      socketRef.current.emit("quick_join")
      addBattleLog("• Searching for opponent...")
    }
  }

  // Create a new room
  const createRoom = () => {
    if (socketRef.current) {
      socketRef.current.emit("join_room", `room_${Math.random().toString(36).substr(2, 6)}`)
      addBattleLog("• Creating new battle room...")
    }
  }

  // Join specific room
  const joinRoom = (roomId: string) => {
    if (socketRef.current) {
      socketRef.current.emit("join_room", roomId)
      addBattleLog(`• Joining room ${roomId}...`)
    }
  }

  // Toggle spectator mode
  const toggleSpectatorMode = () => {
    setIsSpectatorMode(!isSpectatorMode)
  }

  // Format socket ID for display (shortened version)
  const formatSocketId = (socketId: string | null) => {
    if (!socketId) return "Unknown"
    return socketId.substring(0, 6) + "..." + socketId.substring(socketId.length - 4)
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
          <Button
            variant="outline"
            size="sm"
            className="bg-transparent border-gray-800 hover:bg-gray-800 flex items-center gap-1"
            onClick={() => setShowConnectionDialog(true)}
          >
            <Wifi className="h-3 w-3" />
            <span>Connect</span>
          </Button>

          <div className="flex items-center space-x-2 bg-gray-900/50 border border-gray-800 rounded-full px-3 py-1">
            <div className={`w-3 h-3 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`}></div>
            <span className="text-sm font-medium">{isConnected ? "Connected" : "Disconnected"}</span>
          </div>

          <div className="flex items-center space-x-2 bg-gray-900/50 border border-gray-800 rounded-full px-3 py-1">
            <div className="w-3 h-3 rounded-full bg-purple-500 animate-pulse"></div>
            <span className="text-sm font-medium">
              Battle {battleState.currentBattle} • Round {battleState.round}
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
        {/* Connection Dialog */}
        <Dialog open={showConnectionDialog} onOpenChange={setShowConnectionDialog}>
          <DialogContent className="bg-gray-900 border border-gray-800 text-gray-100 max-w-md">
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl">Connect to Server</DialogTitle>
              <DialogDescription>Enter the IP address of the server running on your local network</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="ip" className="text-right">
                  Server IP
                </Label>
                <Input
                  id="ip"
                  placeholder="192.168.x.x"
                  className="col-span-3"
                  value={customServerIp}
                  onChange={(e) => setCustomServerIp(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                className="flex-1 bg-transparent border-gray-700 hover:bg-gray-800"
                onClick={() => {
                  setCustomServerIp("localhost")
                  setShowConnectionDialog(false)
                }}
              >
                Localhost
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                onClick={() => setShowConnectionDialog(false)}
              >
                Connect
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Room Dialog */}
        <Dialog open={showRoomDialog} onOpenChange={setShowRoomDialog}>
          <DialogContent className="bg-gray-900 border border-gray-800 text-gray-100 max-w-md">
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl">Join or Create Room</DialogTitle>
              <DialogDescription>Enter a room code or create a new one</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="roomCode" className="text-right">
                  Room Code
                </Label>
                <Input
                  id="roomCode"
                  placeholder="Enter room code"
                  className="col-span-3"
                  value={roomCodeInput}
                  onChange={(e) => setRoomCodeInput(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                className="flex-1 bg-transparent border-gray-700 hover:bg-gray-800"
                onClick={() => {
                  createRoom()
                  setShowRoomDialog(false)
                }}
              >
                Create Room
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                onClick={() => {
                  joinRoom(roomCodeInput)
                  setShowRoomDialog(false)
                }}
                disabled={!roomCodeInput}
              >
                Join Room
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Waiting for connection screen */}
        {!isConnected && !roomId && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 max-w-md text-center">
              <h2 className="text-2xl font-serif mb-4">Welcome to Wizard Battle</h2>
              <p className="text-gray-400 mb-6">Connect to a server to begin</p>

              <div className="grid gap-4">
                <Button
                  className="bg-gradient-to-r from-purple-600 to-indigo-600"
                  onClick={() => setShowConnectionDialog(true)}
                >
                  <Wifi className="h-4 w-4 mr-2" />
                  Connect to Server
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Waiting for room screen */}
        {isConnected && !roomId && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 max-w-md text-center">
              <h2 className="text-2xl font-serif mb-4">Welcome to Wizard Battle</h2>
              <p className="text-gray-400 mb-6">Connected to server at {customServerIp || "localhost"}</p>

              <div className="grid gap-4">
                <Button
                  className="bg-gradient-to-r from-purple-600 to-indigo-600"
                  onClick={() => setShowRoomDialog(true)}
                >
                  Create or Join Room
                </Button>
                <Button
                  variant="outline"
                  className="bg-transparent border-gray-700 hover:bg-gray-800"
                  onClick={quickJoinBattle}
                >
                  Quick Join Battle
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Waiting for opponent screen */}
        {isWaitingForOpponent && roomId && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 max-w-md text-center">
              <h2 className="text-2xl font-serif mb-4">Waiting for Opponent</h2>
              <p className="text-gray-400 mb-6">Your battle room ID: {roomId}</p>
              <div className="animate-pulse flex justify-center mb-6">
                <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full"></div>
              </div>
              <p className="text-sm text-gray-400 mb-4">
                Share this room code with your friend: <span className="font-mono text-purple-400">{roomId}</span>
              </p>
              <Button
                variant="outline"
                className="bg-transparent border-gray-700 hover:bg-gray-800"
                onClick={quickJoinBattle}
              >
                Quick Join Battle
              </Button>
            </div>
          </div>
        )}

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
                  {formatSocketId(mySocketId)}
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
                  {formatSocketId(opponentSocketId) || "Waiting for opponent..."}
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
                  Bet on {formatSocketId(mySocketId)}
                </Button>
                <Button className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700">
                  Bet on {formatSocketId(opponentSocketId) || "Opponent"}
                </Button>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
          {/* Player Side */}
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
                  className={`h-6 w-6 ${i < (2 - battleState.playerWins) ? "text-red-500 fill-red-500" : "text-gray-600"} mx-1`}
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
                <p className="font-medium">{formatSocketId(mySocketId)}</p>
                <p className="text-xs text-purple-400">Phoenix Patronus • Elder Wand</p>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Health</span>
                  <span>{battleState.playerHealth}/100</span>
                </div>
                <Progress
                  value={battleState.playerHealth}
                  className="h-2 bg-gray-800"
                  indicatorClassName="bg-gradient-to-r from-purple-500 to-indigo-500"
                />
              </div>
            </div>

            {/* Active Effects */}
            <div className="border-t border-gray-800 pt-3 mb-4">
              <h3 className="text-sm font-medium mb-2">Active Effects:</h3>
              <div className="flex flex-wrap gap-1">
                {battleState.playerUsedDefense && (
                  <div className="bg-blue-900/20 border border-blue-900/30 rounded px-2 py-1 text-xs flex items-center">
                    <Shield className="h-3 w-3 mr-1 text-blue-400" />
                    <span>Defense Used</span>
                  </div>
                )}
                {!battleState.playerUsedDefense && <div className="text-xs text-gray-400">No active effects</div>}
              </div>
            </div>

            {/* Battle Log */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-3 mb-4">
              <div className="flex justify-between items-center mb-2">
                <div className="text-sm text-gray-400">Battle Log</div>
                <div className="text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-300">Live</div>
              </div>

              <div className="h-28 overflow-y-auto space-y-1 text-sm mb-1 font-mono battle-log">
                {battleState.battleLog.map((log, index) => (
                  <p
                    key={index}
                    className={`${
                      log.includes("You cast") || log.includes("You won")
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
          </div>

          {/* Battle Arena - Center */}
          <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-4 order-1 lg:order-2 lg:col-span-3">
            {/* Battle Arena */}
            <div className="relative">
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
                    value={battleState.playerHealth}
                    className="w-24 h-1.5 bg-gray-800 ml-2"
                    indicatorClassName="bg-gradient-to-r from-purple-500 to-indigo-500"
                  />
                </div>

                <div className="flex items-center">
                  <Progress
                    value={battleState.opponentHealth}
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
                <div className="w-16 h-16 bg-purple-500/10 border border-purple-500/20 rounded-full flex items-center justify-center relative">
                  <div className="absolute inset-0 rounded-full bg-purple-500/5 animate-ping"></div>
                  <span className="text-2xl">⚡</span>
                </div>
              </div>
            </div>

            {/* Spell Cards */}
            <div className="mt-6">
              <h3 className="text-sm font-medium mb-3">Cast Your Spell:</h3>

              {waitingForOpponentMove ? (
                <div className="text-center py-4">
                  <div className="animate-pulse flex justify-center mb-2">
                    <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full"></div>
                  </div>
                  <p className="text-sm text-gray-400">Waiting for opponent's move...</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  <BattleCard
                    element="inferno"
                    name="Inferno"
                    description="Fire beats Ice, loses to Wind"
                    icon={<Flame className="h-5 w-5 text-red-400" />}
                    color="red"
                    onCast={(level, useDefense) => castSpell("inferno", level, useDefense)}
                    canUseDefense={!battleState.playerUsedDefense}
                  />

                  <BattleCard
                    element="glacius"
                    name="Glacius"
                    description="Ice beats Wind, loses to Fire"
                    icon={<Snowflake className="h-5 w-5 text-blue-400" />}
                    color="blue"
                    onCast={(level, useDefense) => castSpell("glacius", level, useDefense)}
                    canUseDefense={!battleState.playerUsedDefense}
                  />

                  <BattleCard
                    element="ventus"
                    name="Ventus"
                    description="Wind beats Fire, loses to Ice"
                    icon={<Wind className="h-5 w-5 text-green-400" />}
                    color="green"
                    onCast={(level, useDefense) => castSpell("ventus", level, useDefense)}
                    canUseDefense={!battleState.playerUsedDefense}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Opponent Side */}
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
                  className={`h-6 w-6 ${i < (2 - battleState.opponentWins) ? "text-red-500 fill-red-500" : "text-gray-600"} mx-1`}
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
                <p className="font-medium">{formatSocketId(opponentSocketId) || "Waiting for opponent..."}</p>
                <p className="text-xs text-red-400">Wolf Patronus • Dragon Heartstring Wand</p>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Health</span>
                  <span>{battleState.opponentHealth}/100</span>
                </div>
                <Progress
                  value={battleState.opponentHealth}
                  className="h-2 bg-gray-800"
                  indicatorClassName="bg-gradient-to-r from-red-500 to-rose-500"
                />
              </div>
            </div>

            {/* Active Effects */}
            <div className="border-t border-gray-800 pt-3">
              <h3 className="text-sm font-medium mb-2">Active Effects:</h3>
              <div className="flex flex-wrap gap-1">
                {battleState.opponentUsedDefense && (
                  <div className="bg-red-900/20 border border-red-900/30 rounded px-2 py-1 text-xs flex items-center">
                    <Shield className="h-3 w-3 mr-1 text-red-400" />
                    <span>Defense Used</span>
                  </div>
                )}
                {!battleState.opponentUsedDefense && <div className="text-xs text-gray-400">No active effects</div>}
              </div>
            </div>

            {/* Game Rules */}
            <div className="mt-6 bg-gray-900/50 border border-gray-800 rounded-lg p-3">
              <h3 className="text-sm font-medium mb-2">Game Rules:</h3>
              <ul className="text-xs text-gray-400 space-y-1">
                <li>• First to win 2 battles wins the duel</li>
                <li>• Each battle consists of 5 rounds</li>
                <li>• Fire beats Ice, Ice beats Wind, Wind beats Fire</li>
                <li>• Level 1: 20 damage, Level 2: 25 damage, Level 3: 30 damage</li>
                <li>• Defense card can be used once per battle</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Round Result Dialog */}
      <Dialog open={showRoundResult} onOpenChange={setShowRoundResult}>
        <DialogContent className="bg-gray-900 border border-gray-800 text-gray-100 max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl text-center">
              Battle {battleState.currentBattle - 1} Complete!
            </DialogTitle>
            <DialogDescription className="text-center">
              {roundWinner === "player" ? (
                <span className="text-purple-400">You won this battle!</span>
              ) : roundWinner === "opponent" ? (
                <span className="text-red-400">Your opponent won this battle!</span>
              ) : (
                <span className="text-yellow-400">Battle ended in a tie!</span>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-center items-center py-6">
            {roundWinner === "player" ? (
              <div className="w-24 h-24 bg-purple-900/30 rounded-full flex items-center justify-center">
                <Trophy className="h-12 w-12 text-yellow-400" />
              </div>
            ) : roundWinner === "opponent" ? (
              <div className="w-24 h-24 bg-red-900/30 rounded-full flex items-center justify-center">
                <Shield className="h-12 w-12 text-red-400" />
              </div>
            ) : (
              <div className="w-24 h-24 bg-yellow-900/30 rounded-full flex items-center justify-center">
                <Shield className="h-12 w-12 text-yellow-400" />
              </div>
            )}
          </div>

          <div className="flex justify-between items-center px-4 py-2 bg-gray-800/50 rounded-lg mb-4">
            <div className="flex items-center">
              <div className="flex mr-2">
                {[...Array(2)].map((_, i) => (
                  <Heart
                    key={i}
                    className={`h-5 w-5 ${i < (2 - battleState.playerWins) ? "text-red-500 fill-red-500" : "text-gray-600"} mr-1`}
                  />
                ))}
              </div>
              <span>{formatSocketId(mySocketId)}</span>
            </div>
            <div className="text-gray-400">vs</div>
            <div className="flex items-center">
              <span>{formatSocketId(opponentSocketId) || "Opponent"}</span>
              <div className="flex ml-2">
                {[...Array(2)].map((_, i) => (
                  <Heart
                    key={i}
                    className={`h-5 w-5 ${i < (2 - battleState.opponentWins) ? "text-red-500 fill-red-500" : "text-gray-600"} ml-1`}
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
              Continue to Battle {battleState.currentBattle}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Battle Result Dialog */}
      <Dialog open={showBattleResult} onOpenChange={setShowBattleResult}>
        <DialogContent className="bg-gray-900 border border-gray-800 text-gray-100 max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl text-center">Duel Complete!</DialogTitle>
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
              {battleWinner === "player" ? "Congratulations, Wizard!" : "Better luck next time, Wizard!"}
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
