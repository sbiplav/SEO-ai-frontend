import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { FiSend, FiShield } from 'react-icons/fi';
import { ChatMessage } from './components/ChatMessage';
import styles from './styles/App.module.css';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function App() {
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMessage: Message = { role: 'user', content: inputMessage };
    setMessages(prev => [...prev, newMessage]);

    try {
      const response = await axios.post('http://localhost:54608/api/chat', {
        message: inputMessage
      });

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response.data.content
      }]);
    } catch (error) {
      console.error('API Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Error generating response. Please try again.'
      }]);
    }

    setInputMessage('');
  };

  return (
    <div className={styles.appContainer}>
      <header className={styles.appHeader}>
        <FiShield className={styles.shieldIcon} />
        <h1>SEO Content Assistant</h1>
        <p>Ethical AI-powered Content Optimization</p>
      </header>

      <div className={styles.chatWindow}>
        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            content={message.content}
            isUser={message.role === 'user'}
          />
        ))}
        <div ref={chatEndRef} />
      </div>

      <form onSubmit={handleSubmit} className={styles.inputForm}>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Ask about SEO improvements..."
          aria-label="Type your SEO question"
        />
        <button type="submit" aria-label="Send message">
          <FiSend className={styles.sendIcon} />
        </button>
      </form>
    </div>
  );
}