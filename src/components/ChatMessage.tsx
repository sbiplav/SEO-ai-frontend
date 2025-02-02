import { SensitiveDataMask } from './SensitiveDataMask';

interface MessageProps {
  content: string;
  isUser: boolean;
}

export const ChatMessage = ({ content, isUser }: MessageProps) => {
  return (
    <div className={`message ${isUser ? 'user' : 'bot'}`}>
      <div className="message-content">
        <SensitiveDataMask text={content} />
      </div>
    </div>
  );
};