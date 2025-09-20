// components/ReactionButtons.js
export default function ReactionButtons({ onSelectReaction }) {
    const reactions = ['❤', '👍', '😂', '🎉', '😮'];
  
    const buttonStyle = {
      fontSize: '24px',
      padding: '10px',
      border: 'none',
      background: 'rgba(255, 255, 255, 0.8)',
      borderRadius: '50%',
      cursor: 'pointer',
      boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
      marginLeft: '10px',
    };
  
    return (
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 100,
      }}>
        {reactions.map((emoji) => (
          <button key={emoji} onClick={() => onSelectReaction(emoji)} style={buttonStyle}>
            {emoji}
          </button>
        ))}
      </div>
    );
  }