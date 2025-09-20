import { useMemo } from 'react';

export default function ChatMessage({ message, isMe }) {
    const audioUrl = useMemo(() => {
        if (message.type === 'audio' && message.content instanceof Blob) {
            return URL.createObjectURL(message.content);
        }
        return null;
    }, [message]);

    const messageStyle = {
        alignSelf: isMe ? 'flex-end' : 'flex-start',
        backgroundColor: isMe ? '#dcf8c6' : '#fff',
        padding: '8px 12px',
        borderRadius: '12px',
        maxWidth: '70%',
        marginBottom: '10px',
        border: '1px solid #eee',
        wordWrap: 'break-word',
    };

    return (
        <div style={messageStyle}>
            <div style={{ fontWeight: 'bold', marginBottom: '4px', fontSize: '0.8em' }}>
                {message.senderId.substring(0, 10)}...
            </div>
            {message.type === 'text' ? (
                <span>{message.content}</span>
            ) : (
                <audio src={audioUrl} controls style={{ width: '250px' }} />
            )}
            <div style={{ fontSize: '0.7em', color: '#888', textAlign: 'right', marginTop: '4px' }}>
                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
        </div>
    );
}