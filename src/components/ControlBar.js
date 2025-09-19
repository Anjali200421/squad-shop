// src/components/ControlBar.js
export default function ControlBar({ controllerId, myId, onRequestControl }) {
  const isMeTheController = controllerId === myId;

  return (
    <div style={{ padding: '10px', border: '1px solid black', margin: '10px' }}>
      <h2>Control Status</h2>
      {isMeTheController ? (
        <p><strong>You are in control.</strong></p>
      ) : (
        <div>
          <p><strong>{controllerId}</strong> is in control.</p>
          <button onClick={onRequestControl}>Request Control</button>
        </div>
      )}
    </div>
  );
}