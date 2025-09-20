export default function RequestNotification({ requestorId, onAccept, onDeny }) {
    if (!requestorId) return null;
  
    return (
      <div style={{ position: 'fixed', top: '20px', right: '20px', padding: '20px', border: '2px solid blue', borderRadius: '8px', backgroundColor: 'white', zIndex: 100, boxShadow: '0 4px 8px rgba(0,0,0,0.2)' }}>
        <p><strong>{requestorId.substring(0,10)}...</strong> wants to take control!</p>
        <button onClick={() => onAccept(requestorId)} style={{ marginRight: '10px' }}>Accept</button>
        <button onClick={onDeny}>Deny</button>
      </div>
    );
  }