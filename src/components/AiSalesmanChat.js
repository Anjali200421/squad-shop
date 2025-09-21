// src/components/AiSalesmanChat.js
import { useState } from 'react';

export default function AiSalesmanChat({ products }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { from: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setInput('');

    // Call our new backend API
    const response = await fetch('/api/ai-salesman', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        message: input,
        productContext: products // Send the product data as context
      }),
    });

    const data = await response.json();
    const aiMessage = { from: 'ai', text: data.reply };
    
    setMessages((prev) => [...prev, aiMessage]);
    setIsLoading(false);
  };

  return (
    <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #9ca3af', borderRadius: '8px' }}>
      <h3 style={{ marginTop: 0 }}>AI Salesman</h3>
      <div style={{ height: '200px', overflowY: 'auto', border: '1px solid #eee', padding: '10px', marginBottom: '10px' }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ textAlign: msg.from === 'user' ? 'right' : 'left', marginBottom: '5px' }}>
            <span style={{ background: msg.from === 'user' ? '#dbeafe' : '#f3f4f6', padding: '5px 10px', borderRadius: '10px' }}>
              {msg.text}
            </span>
          </div>
        ))}
        {isLoading && <div style={{textAlign: 'left'}}><i>AI is typing...</i></div>}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about a product..."
          style={{ width: 'calc(100% - 70px)', padding: '8px', marginRight: '5px' }}
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>Send</button>
      </form>
    </div>
  );
}