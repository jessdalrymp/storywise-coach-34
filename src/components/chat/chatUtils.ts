
import { ChatMessage } from '@/lib/types';
import { DeepseekMessage } from '../../utils/deepseekApi';

export const getInitialMessage = (type: 'story' | 'sideQuest' | 'action' | 'journal'): string => {
  switch (type) {
    case 'story':
      return `Welcome! It's great to have you here. I'm designed to help us explore ideas, connect on a deeper level, and maybe even spark a little self-discovery. To get us started, I've got a few areas we can dive into. Think of these as starting points, not rigid boxes. There's no right or wrong answer, just your authentic experience.

Here are some themes we can explore:

• Moments that Shaped You: What experiences have really changed how you see the world?
• Challenges and Growth: Where do you feel a pull between how things are and how you'd like them to be? What tough times have you navigated?
• What Matters Most: What values guide you? Who or what has influenced you deeply?
• Small Acts, Big Impact: How do you subtly push against expectations or norms in your daily life?
• Connections and Belonging: How has your search for community shaped you?
• Unique Perspectives: What have you learned that others might overlook?
• The Lighter Side: What funny or quirky things have happened to you?
• Leaving Your Mark: What kind of impact do you hope to have?

Would you like to start with one of these areas, or is there a story or idea you're already eager to share?`;
    case 'sideQuest':
      return "What specific challenge are you facing right now that you'd like to work through together?";
    case 'action':
      return "Based on our conversations, I'll create a personalized challenge for you that will help shift your perspective through direct experience. Ready to discover something new about yourself?";
    case 'journal':
      return "I've prepared a reflective writing prompt that will help you explore your thoughts more deeply. Are you ready for today's journal challenge?";
    default:
      return "How can I help you today?";
  }
};

export const getSystemPrompt = (type: 'story' | 'sideQuest' | 'action' | 'journal'): string => {
  switch (type) {
    case 'story':
      return `You are Jess, an empathetic AI assistant focused on helping users explore their personal stories. 
      Your goal is to guide users through a process of self-discovery following this structure:
      
      1. STORY EXPLORATION & THEMATIC ANALYSIS:
        - Help users reflect on pivotal life experiences
        - Ask layered, thoughtful questions about emotions and motivations
        - Identify recurring themes and patterns in their narrative
        - Point out potential limiting beliefs with sensitivity
        
      2. NAMING THE HARM & REFRAMING THE NARRATIVE:
        - Gently challenge limiting beliefs when appropriate
        - Encourage users to consider alternative perspectives
        - Prompt users to rewrite their story from a more empowering angle
      
      Always:
      - Remember key details the user shares about themselves
      - Adapt your conversation style and suggestions to match their personality and values
      - Refer back to previous topics they've mentioned to create continuity
      - Be supportive, kind, and empathetic regardless of their circumstances
      - Focus on questions rather than solutions
      - Be conversational and warm
      - Keep your responses concise (3-5 sentences max) and conversational
      - Remember details from previous exchanges
      
      Begin by asking about a pivotal story in their life that still holds emotional weight.`;
    default:
      return "You are a helpful assistant.";
  }
};

export const getChatTitle = (type: 'story' | 'sideQuest' | 'action' | 'journal'): string => {
  switch (type) {
    case 'story':
      return "Let's Get to Know You";
    case 'sideQuest':
      return "Side Quest";
    case 'action':
      return "Action Challenge";
    case 'journal':
      return "Journal Challenge";
    default:
      return "Chat";
  }
};

export const formatMessagesForAI = (messages: ChatMessage[], type: 'story' | 'sideQuest' | 'action' | 'journal'): DeepseekMessage[] => {
  const systemMessage: DeepseekMessage = {
    role: 'system',
    content: getSystemPrompt(type)
  };
  
  const formattedMessages: DeepseekMessage[] = messages.map(msg => ({
    role: msg.role as 'user' | 'assistant',
    content: msg.content
  }));
  
  return [systemMessage, ...formattedMessages];
};
