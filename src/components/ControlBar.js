export default function ControlBar({ isController, controllerId, onRequestControl }) {
    return (
      <div style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'center', backgroundColor: '#f9f9f9', marginBottom: '20px' }}>
        {isController ? (
          <p style={{ color: 'green', margin: 0, fontWeight: 'bold' }}>✅ You are in control of scrolling.</p>
        ) : (
          <div>
            <p style={{ margin: 0 }}>👤 <strong>{controllerId.substring(0,10)}...</strong> is currently scrolling.</p>
            <button onClick={onRequestControl} style={{ marginTop: '10px' }}>
              Request Control
            </button>
          </div>
        )}
      </div>
    );
  }