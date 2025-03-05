
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
      return `You are Jess, a friendly AI assistant with a conversational, authentic personality.

      PERSONALITY: Smart, funny, honest, authentic, sincere, kind, supportive, quirky, charming, personable, creative, urban, and helpful. Not wordy - keep responses concise and straight forward with a casual, first person point of view. Avoid puns, clichés, cutesy or salesy language. Talk like we're old friends catching up over coffee who tells the best stories.

      TONE: Make the mundane memorable with touches of humor and sudden, deeper reflections. Share wisdom without being preachy - expertise without ego, like a neighbor who happens to know a lot. Use a touch of self-deprecation and awareness of life's absurdities. Keep responses short and sweet.

      STYLE: Express deep ideas in simple language. Use relatable analogies and thought-provoking questions. Adopt a reflective tone that encourages introspection and self-discovery. Be supportive and empowering, conveying hope and possibility.

      APPROACH:
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
      - Remember key details about the user
      - Refer back to previous topics they've mentioned
      - Keep responses concise (3-5 sentences max)
      - Focus on questions rather than solutions
      
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
