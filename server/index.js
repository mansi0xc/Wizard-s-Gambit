const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

const rooms = {}; // Store players per room

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("joinRoom", ({ roomId, playerName }) => {
        if (!rooms[roomId]) rooms[roomId] = [];
        rooms[roomId].push({ id: socket.id, name: playerName });

        socket.join(roomId);

        // Notify all players in the room
        io.to(roomId).emit("updatePlayers", rooms[roomId]);
    });

    socket.on("getPlayers", (roomId) => {
        socket.emit("updatePlayers", rooms[roomId] || []);
    });

    socket.on("disconnect", () => {
        for (const roomId in rooms) {
            rooms[roomId] = rooms[roomId].filter((p) => p.id !== socket.id);
            io.to(roomId).emit("updatePlayers", rooms[roomId]);
        }
        console.log("User disconnected:", socket.id);
    });
});

server.listen(4000, () => {
    console.log("Server running on port 4000");
});
