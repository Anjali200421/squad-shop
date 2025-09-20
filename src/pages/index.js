import { useState } from 'react';
import { useRouter } from 'next/router';

export default function HomePage() {
  const [roomId, setRoomId] = useState('');
  const router = useRouter();

  const createRoom = () => {
    const newRoomId = Math.random().toString(36).substring(2, 8);
    router.push(`/session/${newRoomId}`);
  };

  const joinRoom = (e) => {
    e.preventDefault();
    if (roomId) {
      router.push(`/session/${roomId}`);
    } else {
      alert('Please enter a room code.');
    }
  };

  return (
    <div style={{ fontFamily: 'sans-serif', textAlign: 'center', padding: '50px' }}>
      <h1>Collaborative Shopping</h1>
      <button onClick={createRoom} style={{ padding: '10px 20px', fontSize: '1em' }}>
        Create a New Session
      </button>
      <hr style={{ margin: '30px auto', width: '50%' }} />
      <form onSubmit={joinRoom}>
        <input
          type="text"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          placeholder="Enter session code"
          style={{ padding: '10px', marginRight: '10px' }}
        />
        <button type="submit">Join Session</button>
      </form>
    </div>
  );
}