// src/pages/index.js
import { useEffect } from 'react';
import { io } from 'socket.io-client';

export default function HomePage() {
  // On page load, generate a simple user ID if we don't have one.
  useEffect(() => {
    if (!localStorage.getItem('userId')) {
      const randomId = `user_${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem('userId', randomId);
    }
  }, []);

  const createRoom = () => {
    const socket = io('http://localhost:3001');
    socket.on('connect', () => {
      socket.emit('create_room', { userId: localStorage.getItem('userId') });
    });
    socket.on('room_created', ({ roomId }) => {
      window.location.href = `/session/${roomId}`;
    });
  };

  return (
    <div>
      <h1>Control Feature Test</h1>
      <button onClick={createRoom}>Create New Room</button>
    </div>
  );
}