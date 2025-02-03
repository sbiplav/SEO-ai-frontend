import ReactMarkdown from 'react-markdown';

interface MessageProps {
  content: string;
  isUser: boolean;
}

export const ChatMessage = ({ content, isUser }: MessageProps) => {
  return (
    <div className={`message ${isUser ? 'user' : 'bot'}`}>
      <div className="message-content">
        <ReactMarkdown children={content} />
      </div>
    </div>
  );
};