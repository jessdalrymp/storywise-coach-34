
import { ArrowLeft, Home } from 'lucide-react';
import { getChatTitle } from './chatUtils';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

interface ChatHeaderProps {
  type: 'story' | 'sideQuest' | 'action' | 'journal';
  onBack: () => void;
  onEndChat?: () => void;
  onAcceptChallenge?: () => void;
  onNewChallenge?: () => void;
  saveChat?: boolean;
}

export const ChatHeader = ({
  type,
  onBack,
  onEndChat,
  onAcceptChallenge,
  onNewChallenge,
  saveChat
}: ChatHeaderProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="sticky top-0 z-10 bg-white border-b border-jess-subtle py-3 px-4 flex items-center justify-between">
      <div className="flex items-center">
        <button
          onClick={() => navigate('/dashboard')}
          className="p-1 mr-3 rounded-full hover:bg-jess-subtle transition-colors"
          aria-label="Go back to dashboard"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="font-medium text-lg">{getChatTitle(type)}</h2>
      </div>
      
      <Link 
        to="/dashboard"
        className="flex items-center text-jess-foreground hover:text-jess-primary transition-colors"
      >
        <Home size={18} className="mr-1" />
        <span className="text-sm">Home</span>
      </Link>
    </div>
  );
};
