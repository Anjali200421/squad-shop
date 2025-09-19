// server.js
const express = require('express');
const http = require('http');
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } }); // Allow connections from anywhere

// This will store our room information. In a real app, this would be a database.
const ROOMS = {}; 

io.on('connection', (socket) => {
  console.log(`A user connected: ${socket.id}`);

  // --- Simplified work of Developer 1 ---
  socket.on('create_room', ({ userId }) => {
    const roomId = Math.random().toString(36).substring(2, 8); // Generate random room ID
    ROOMS[roomId] = {
      users: { [userId]: socket.id },
      controller_userId: userId // The creator is the first controller
    };
    socket.join(roomId);
    console.log(`Room ${roomId} created by ${userId}`);
    socket.emit('room_created', { roomId, controllerId: userId });
  });

  socket.on('join_room', ({ roomId, userId }) => {
    if (ROOMS[roomId]) {
      ROOMS[roomId].users[userId] = socket.id;
      socket.join(roomId);
      console.log(`User ${userId} joined room ${roomId}`);
      // Tell the new user who is in control
      socket.emit('initial_state', { controllerId: ROOMS[roomId].controller_userId });
    }
  });
  // --- End of Simplified Developer 1 work ---

  // --- YOUR BACKEND WORK STARTS HERE ---
  socket.on('request_control', ({ roomId, requestingUserId }) => {
    const room = ROOMS[roomId];
    if (room) {
      const controllerSocketId = room.users[room.controller_userId];
      console.log(`Control request from ${requestingUserId} forwarded to controller ${room.controller_userId}`);
      // Send a message ONLY to the current controller
      io.to(controllerSocketId).emit('new_control_request', {
        requestingUserId: requestingUserId
      });
    }
  });

  socket.on('grant_control', ({ roomId, newControllerId, currentControllerId }) => {
    const room = ROOMS[roomId];
    // Security Check: Only the current controller can grant control
    if (room && room.controller_userId === currentControllerId) {
      room.controller_userId = newControllerId;
      console.log(`Control of room ${roomId} granted to ${newControllerId}`);
      // Broadcast the change to EVERYONE in the room
      io.to(roomId).emit('controller_changed', {
        newControllerId: newControllerId
      });
    }
  });
  // --- YOUR BACKEND WORK ENDS HERE ---

  socket.on('disconnect', () => {
    console.log(`A user disconnected: ${socket.id}`);
    // Add cleanup logic here in a real app
  });
});

server.listen(3001, () => {
  console.log('Server is listening on port 3001');
});