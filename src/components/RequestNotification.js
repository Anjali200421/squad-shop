// src/components/RequestNotification.js
export default function RequestNotification({ requestorId, onAccept, onDeny }) {
  if (!requestorId) return null; // Show nothing if there's no request

  return (
    <div style={{ padding: '10px', border: '2px solid red', margin: '10px', backgroundColor: '#ffeeee' }}>
      <p><strong>{requestorId}</strong> is requesting control!</p>
      <button onClick={() => onAccept(requestorId)}>Accept</button>
      <button onClick={onDeny}>Deny</button>
    </div>
  );
}