const express = require('express');
const http = require('http');
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const ROOMS = {};

io.on('connection', (socket) => {
    console.log(`✅ User connected: ${socket.id}`);

    socket.on('join_room', ({ roomId, userId }) => {
        if (!ROOMS[roomId]) {
            ROOMS[roomId] = {
                users: {},
                controller_userId: userId,
                scrollPosition: 0,
            };
            console.log(`🚪 Room ${roomId} created by ${userId}`);
        }
        socket.join(roomId);
        ROOMS[roomId].users[userId] = socket.id;
        socket.roomId = roomId;
        socket.userId = userId;

        socket.emit('joined_room', {
            controllerId: ROOMS[roomId].controller_userId,
            scrollPosition: ROOMS[roomId].scrollPosition
        });
        console.log(`👋 User ${userId} joined room ${roomId}`);
    });

    socket.on('sync_scroll', ({ scrollPosition }) => {
        const { roomId, userId } = socket;
        if (!roomId || !ROOMS[roomId]) return;

        if (ROOMS[roomId].controller_userId === userId) {
            ROOMS[roomId].scrollPosition = scrollPosition;
            socket.to(roomId).emit('scroll_update', { scrollPosition });
        }
    });

    socket.on('request_control', () => {
        const { roomId, userId } = socket;
        if (!roomId || !ROOMS[roomId]) return;
        const room = ROOMS[roomId];

        if (room.controller_userId !== userId) {
            const controllerSocketId = room.users[room.controller_userId];
            if (controllerSocketId) {
                io.to(controllerSocketId).emit('new_control_request', { requestingUserId: userId });
            }
        }
    });

    socket.on('grant_control', ({ newControllerId }) => {
        const { roomId, userId } = socket;
        if (!roomId || !ROOMS[roomId]) return;
        const room = ROOMS[roomId];

        if (room.controller_userId === userId) {
            room.controller_userId = newControllerId;
            io.to(roomId).emit('controller_changed', { newControllerId });
        }
    });
    
    socket.on('send_message', (messageData) => {
        const { roomId } = socket;
        if (!roomId || !ROOMS[roomId]) return;

        io.to(roomId).emit('new_message', {
            ...messageData,
            timestamp: new Date().toISOString(),
        });
    });

    socket.on('send_reaction', ({ reaction }) => {
        const { roomId, userId } = socket;
        if (!roomId || !ROOMS[roomId]) return;
        
        io.to(roomId).emit('new_reaction', {
            reaction: reaction,
            senderId: userId
        });
    });

    socket.on('disconnect', () => {
        console.log(`❌ User disconnected: ${socket.id}`);
        const { roomId, userId } = socket;
        const room = ROOMS[roomId];

        if (room && room.users && userId) {
            delete room.users[userId];

            if (room.controller_userId === userId) {
                const remainingUsers = Object.keys(room.users);
                if (remainingUsers.length > 0) {
                    const newControllerId = remainingUsers[0];
                    room.controller_userId = newControllerId;
                    io.to(roomId).emit('controller_changed', { newControllerId });
                    console.log(`👑 Controller disconnected. New controller is ${newControllerId}`);
                } else {
                    delete ROOMS[roomId];
                    console.log(`💥 Room ${roomId} is empty and has been deleted.`);
                }
            }
        }
    });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`🚀 Server is listening on port ${PORT}`);
});