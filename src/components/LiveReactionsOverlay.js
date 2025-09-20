// components/LiveReactionsOverlay.js
import { useState, useEffect } from 'react';

export default function LiveReactionsOverlay({ socket }) {
  const [reactions, setReactions] = useState([]);

  useEffect(() => {
    if (!socket) return;

    const handleNewReaction = (data) => {
      const newReaction = {
        id: Math.random(),
        emoji: data.reaction,
        left: ${Math.random() * 90}%,
      };
      setReactions((prev) => [...prev, newReaction]);

      setTimeout(() => {
        setReactions((prev) => prev.filter((r) => r.id !== newReaction.id));
      }, 3000);
    };

    socket.on('new_reaction', handleNewReaction);
    return () => socket.off('new_reaction', handleNewReaction);
  }, [socket]);

  return (
    <>
      <style jsx>{`
        .reaction-emoji {
          position: fixed;
          bottom: 80px;
          font-size: 48px;
          /* 👇 THE FIX IS HERE: Ensures emojis appear on top of other content 👇 */
          z-index: 101; 
          animation: float-up 3s ease-out forwards;
          pointer-events: none;
        }

        @keyframes float-up {
          from {
            transform: translateY(0);
            opacity: 1;
          }
          to {
            transform: translateY(-500px);
            opacity: 0;
          }
        }
      `}</style>
      
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
        {reactions.map((r) => (
          <span key={r.id} className="reaction-emoji" style={{ left: r.left }}>
            {r.emoji}
          </span>
        ))}
      </div>
    </>
  );
}