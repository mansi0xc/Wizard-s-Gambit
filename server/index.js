const { Server } = require("socket.io")
const http = require("http")
const express = require("express")

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for local testing
    methods: ["GET", "POST"],
  },
})

// Game state storage
const rooms = new Map()

// Function to get players in a room
function getPlayersInRoom(roomId) {
  const room = io.sockets.adapter.rooms.get(roomId)
  return room ? Array.from(room) : [] // Convert Set to Array
}

io.on("connection", (socket) => {
  console.log(`New connection: ${socket.id}`)

  // Quick join functionality
  socket.on("quick_join", () => {
    // Find a room with only 1 player waiting
    let availableRoom = null
    for (const [roomId, room] of rooms) {
      if (room.players.length === 1 && !room.started) {
        availableRoom = roomId
        break
      }
    }

    if (availableRoom) {
      joinRoom(socket, availableRoom)
    } else {
      // Create new room
      const newRoomId = `room_${Math.random().toString(36).substr(2, 8)}`
      createRoom(socket, newRoomId)
    }
  })

  // Join specific room
  socket.on("join_room", (roomId) => {
    if (rooms.has(roomId)) {
      joinRoom(socket, roomId)
    } else {
      createRoom(socket, roomId)
    }
  })

  socket.on("player_details",(roomId) => {
    sendPlayerDetails(roomId);
  })
  // Handle game actions
  socket.on("cast_spell", (data) => {
    
    const room = rooms.get(data.roomId)
    if (!room) return

    const player = room.players.find((p) => p.socketId === socket.id)
    if (!player) return

    player.currentAction = {
      element: data.element,
      level: data.level,
      useDefense: data.useDefense,
    }

    // Check if both players have made their move
    if (room.players.every((p) => p.currentAction)) {
      processRound(room)
    }
  })

  // Handle next round
  socket.on("next_round", (data) => {
    const room = rooms.get(data.roomId)
    if (!room) return

    // Reset for next round
    room.round += 1
    room.results = []
    room.players.forEach((p) => {
      p.health = 100
      p.usedDefense = false
      p.currentAction = null
    })

    io.to(room.id).emit("round_start", { round: room.round })
  })

  socket.on("player_details",(roomId) => {
    socket.emit("player_details_response", getPlayerDetails(roomId));
    console.log("players detail:", getPlayerDetails(roomId))
  
  })
  // Handle leaving room
  socket.on("leave_room", (data) => {
    const room = rooms.get(data.roomId)
    if (!room) return

    const playerIndex = room.players.findIndex((p) => p.socketId === socket.id)
    if (playerIndex !== -1) {
      room.players.splice(playerIndex, 1)
      if (room.players.length === 0) {
        rooms.delete(data.roomId)
      } else {
        // Notify remaining player that opponent left
        io.to(data.roomId).emit("opponent_left")
      }
    }

    socket.leave(data.roomId)
  })

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log(`Disconnected: ${socket.id}`)
    // Clean up rooms when players leave
    for (const [roomId, room] of rooms) {
      const playerIndex = room.players.findIndex((p) => p.socketId === socket.id)
      if (playerIndex !== -1) {
        room.players.splice(playerIndex, 1)
        if (room.players.length === 0) {
          rooms.delete(roomId)
        } else {
          // Notify remaining player that opponent left
          io.to(roomId).emit("opponent_left")
        }
      }

      // Remove from spectators if present
      const spectatorIndex = room.spectators.indexOf(socket.id)
      if (spectatorIndex !== -1) {
        room.spectators.splice(spectatorIndex, 1)
        // Update spectator count
        io.to(roomId).emit("spectator_count", room.spectators.length)
      }
    }
  })
})

function createRoom(socket, roomId) {
  const newRoom = {
    id: roomId,
    players: [
      {
        socketId: socket.id,
        type: "player",
        health: 100,
        wins: 0,
        usedDefense: false,
        currentAction: null,
      },
    ],
    spectators: [],
    started: false,
    round: 1,
    results: [],
    currentBattle: 1,
  }

  rooms.set(roomId, newRoom)
  socket.join(roomId)
  socket.emit("room_joined", { roomId, isSpectator: false })

  // Send the current players in the room
  io.to(roomId).emit("room-players", getPlayersInRoom(roomId))

  console.log(`Room created: ${roomId}`)
}

function joinRoom(socket, roomId) {
  const room = rooms.get(roomId)
  if (!room) return

  if (room.players.length < 2) {
    // Join as player
    room.players.push({
      socketId: socket.id,
      type: "opponent",
      health: 100,
      wins: 0,
      usedDefense: false,
      currentAction: null,
    })

    socket.join(roomId)
    socket.emit("room_joined", { roomId, isSpectator: false })

    // Send updated player list to all clients in the room
    io.to(roomId).emit("room-players", getPlayersInRoom(roomId))

    room.started = true

    // Notify both players that game is starting
    io.to(roomId).emit("opponent_joined")
    io.to(roomId).emit("round_start", { round: room.round })
  } else {
    // Join as spectator
    room.spectators.push(socket.id)
    socket.join(roomId)
    socket.emit("room_joined", { roomId, isSpectator: true })
  }

  // Update spectator count
  io.to(roomId).emit("spectator_count", room.spectators.length)
}







function getPlayerDetails(roomId) {
  const room = rooms.get(roomId)
  if (!room) return   
  const [player1, player2] = room.players
  const playerDetails = room.players.map((player) => ({
    socketId: player.socketId,
    type: player.type,
    health: player.health,
    wins: player.wins,
    usedDefense: player.usedDefense,
  }))
  return playerDetails
}








function processRound(room) {
  const [player1, player2] = room.players
  const result = calculateRoundResult(player1.currentAction, player2.currentAction)
  console.log(player1, player2)

  // Update player states
  if (!result.isVoid) {
    if (result.winner === "player") {
      player2.health -= result.damage
    } else if (result.winner === "opponent") {
      player1.health -= result.damage
    }
  }

  if (player1.currentAction.useDefense) player1.usedDefense = true
  if (player2.currentAction.useDefense) player2.usedDefense = true

  // Store result
  room.results.push(result)

  // Send results to clients
  io.to(room.id).emit("round_result", result)

  // Check for round completion (5 results)
  if (room.results.length >= 5) {
    const playerWins = room.results.filter((r) => r.winner === "player").length
    const opponentWins = room.results.filter((r) => r.winner === "opponent").length

    if (playerWins > opponentWins) {
      player1.wins += 1
    } else if (opponentWins > playerWins) {
      player2.wins += 1
    }

    // Check for battle completion (2 wins)
    if (player1.wins >= 2 || player2.wins >= 2) {
      const winner = player1.wins >= 2 ? "player" : "opponent"
      io.to(room.id).emit("battle_result", winner)
      rooms.delete(room.id)
    } else {
      // Prepare for next round
      room.round += 1
      room.currentBattle += 1
      room.results = []
      room.players.forEach((p) => {
        p.health = 100
        p.usedDefense = false
        p.currentAction = null
      })
      io.to(room.id).emit("round_start", { round: room.round })
     
    }
  } else {
    // Clear actions for next turn
    room.players.forEach((p) => (p.currentAction = null))
  }
}

function calculateRoundResult(playerAction, opponentAction) {
  // Element matchup logic
  const getElementOutcome = (playerElement, opponentElement) => {
    if (playerElement === opponentElement) return "draw"

    const winConditions = {
      inferno: "glacius",
      glacius: "ventus",
      ventus: "inferno",
    }

    return winConditions[playerElement] === opponentElement ? "win" : "lose"
  }

  // Calculate damage based on level
  const getLevelDamage = (level) => {
    return level === 1 ? 20 : level === 2 ? 25 : 30
  }

  // Determine outcome based on elements
  const outcome = getElementOutcome(playerAction.element, opponentAction.element)

  // Check if defense is used
  const isVoid = (playerAction.useDefense && outcome === "lose") || (opponentAction.useDefense && outcome === "win")

  let winner = null
  let damage = 0

  if (!isVoid) {
    if (outcome === "win") {
      winner = "player"
      damage = getLevelDamage(playerAction.level)
    } else if (outcome === "lose") {
      winner = "opponent"
      damage = getLevelDamage(opponentAction.level)
    } else {
      // Same element - higher level wins
      if (playerAction.level > opponentAction.level) {
        winner = "player"
        damage = getLevelDamage(playerAction.level) - getLevelDamage(opponentAction.level)
      } else if (opponentAction.level > playerAction.level) {
        winner = "opponent"
        damage = getLevelDamage(opponentAction.level) - getLevelDamage(playerAction.level)
      }
      // If same level, it's a draw (winner remains null)
    }
  }

  return {
    winner,
    playerElement: playerAction.element,
    playerLevel: playerAction.level,
    opponentElement: opponentAction.element,
    opponentLevel: opponentAction.level,
    damage,
    isVoid,
  }
}

const PORT = 3001
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
  // Get local IP address
  const os = require("os")
  const interfaces = os.networkInterfaces()
  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name]) {
      if (net.family === "IPv4" && !net.internal) {
        console.log(`Accessible on your network at: http://${net.address}:${PORT}`)
      }
    }
  }
})

