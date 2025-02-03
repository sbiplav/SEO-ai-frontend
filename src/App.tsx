import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { FiSend, FiShield } from 'react-icons/fi';
import { ChatMessage } from './components/ChatMessage';
import styles from './styles/App.module.css';

const apiUrl = import.meta.env.VITE_API_URL;
const apiKey = import.meta.env.VITE_API_KEY;

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
      const response = await axios.post(
        apiUrl,
        {
          messages: [ ...messages,
            {
              role: "system",
              content: "You are an ethical SEO expert assistant. Follow these rules: 1. Optimize image ALT texts 2. Suggest long-tail keywords 3. Never include personal info 4. Avoid harmful content 5. Focus on E-A-T 6. Generate meta titles <60 chars 7. Create keyword-rich product descriptions"
            },
            {
              role: "user",
              content: inputMessage
            }
          ],
          temperature: 0.7
        },
        {
          headers: {
            'api-key': apiKey,
            'Content-Type': 'application/json'
          }
        }
      );
  
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response.data.choices[0].message.content
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

      <div className={styles.chatWindow} >
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



