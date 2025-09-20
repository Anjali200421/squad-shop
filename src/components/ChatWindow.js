import { useState, useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';

export default function ChatWindow({ socket, userId }) {
    const [messages, setMessages] = useState([]);
    const [textInput, setTextInput] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    useEffect(() => {
        if (!socket) return;
        
        const handleNewMessage = (newMessage) => {
            if (newMessage.type === 'audio') {
                newMessage.content = new Blob([newMessage.content], { type: 'audio/webm' });
            }
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        };

        socket.on('new_message', handleNewMessage);
        return () => socket.off('new_message', handleNewMessage);
    }, [socket]);

    const handleSendText = (e) => {
        e.preventDefault();
        if (textInput.trim() && socket) {
            socket.emit('send_message', { type: 'text', content: textInput, senderId: userId });
            setTextInput('');
        }
    };

    const handleToggleRecording = async () => {
        if (isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        } else {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                const recorder = new MediaRecorder(stream);
                mediaRecorderRef.current = recorder;
                audioChunksRef.current = [];
                recorder.ondataavailable = (event) => audioChunksRef.current.push(event.data);
                recorder.onstop = () => {
                    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                    if (socket) {
                        socket.emit('send_message', { type: 'audio', content: audioBlob, senderId: userId });
                    }
                    stream.getTracks().forEach(track => track.stop());
                };
                recorder.start();
                setIsRecording(true);
            } catch (error) {
                console.error("Error accessing microphone:", error);
                alert("Microphone access is required for voice messages.");
            }
        }
    };

    return (
        <div style={{ marginTop: '20px', border: '1px solid #ccc', borderRadius: '8px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ height: '300px', overflowY: 'auto', padding: '10px', display: 'flex', flexDirection: 'column' }}>
                {messages.map((msg, index) => (
                    <ChatMessage key={index} message={msg} isMe={msg.senderId === userId} />
                ))}
            </div>
            <form onSubmit={handleSendText} style={{ display: 'flex', padding: '10px', borderTop: '1px solid #ccc' }}>
                <input
                    type="text"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Type a message..."
                    style={{ flex: 1, padding: '10px', borderRadius: '20px', border: '1px solid #ddd' }}
                />
                <button type="submit" style={{ marginLeft: '10px' }}>Send</button>
                <button
                    type="button"
                    onClick={handleToggleRecording}
                    style={{ marginLeft: '10px', background: isRecording ? 'red' : 'green', color: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer' }}
                >
                    {isRecording ? '■' : '🎤'}
                </button>
            </form>
        </div>
    );
}