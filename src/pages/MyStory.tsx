
import { useState, useEffect, useRef } from "react";
import { Header } from "../components/Header";
import { DisclaimerBanner } from "../components/ui/DisclaimerBanner";
import { ChatInterface } from "../components/chat/ChatInterface";
import { WelcomeModal } from "../components/chat/WelcomeModal";
import { useToast } from "../hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { getInitialMessage } from "@/components/chat/chatUtils";
import { SaveChatDialog } from "@/components/chat/SaveChatDialog";
import { fetchConversation } from "@/services/conversation";
import { clearCurrentConversationFromStorage } from "@/lib/storageUtils";

const MyStory = () => {
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showSaveChatDialog, setShowSaveChatDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingConversations, setIsCheckingConversations] = useState(false);
  const [existingConversationId, setExistingConversationId] = useState<string | null>(null);
  const [validConversation, setValidConversation] = useState<boolean>(false);
  const [authError, setAuthError] = useState<boolean>(false);
  const initializationAttempted = useRef(false);
  const { user, loading: userLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    console.log("MyStory - Auth state:", user ? "Authenticated" : "Not authenticated", "Loading:", userLoading);
    
    // Only proceed after we've determined auth status
    if (userLoading) {
      return;
    }
    
    // If user is not authenticated, mark as error and stop loading
    if (!user) {
      console.log("User is not authenticated");
      setAuthError(true);
      setIsLoading(false);
      return;
    } else {
      // Reset auth error if user is now authenticated
      setAuthError(false);
    }
    
    // Don't re-initialize if we've already tried
    if (initializationAttempted.current) {
      return;
    }
    
    initializationAttempted.current = true;
    
    const hasVisitedStoryPage = localStorage.getItem('hasVisitedStoryPage');
    
    if (!hasVisitedStoryPage) {
      console.log("First visit to story page, showing welcome modal");
      setShowWelcomeModal(true);
      localStorage.setItem('hasVisitedStoryPage', 'true');
      setIsLoading(false);
    } else {
      // Check for existing conversations after we confirm the user is logged in
      checkExistingStoryConversations();
    }
  }, [user, userLoading]);
  
  const checkExistingStoryConversations = async () => {
    if (isCheckingConversations || !user) {
      return;
    }
    
    setIsCheckingConversations(true);
    try {
      console.log("Checking for existing story conversations for user:", user.id);
      const { data, error } = await supabase
        .from('conversations')
        .select('id')
        .eq('profile_id', user.id)
        .eq('type', 'story')
        .order('updated_at', { ascending: false })
        .limit(1);
      
      if (error) {
        console.error('Error checking for existing conversations:', error);
        toast({
          title: "Error loading conversations",
          description: "Could not load your previous conversations.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      if (data && data.length > 0) {
        console.log("Found existing story conversation:", data[0].id);
        
        // Try to load the conversation to make sure it's valid
        try {
          const conversation = await fetchConversation(data[0].id, user.id);
          if (conversation && conversation.messages && conversation.messages.length > 0) {
            console.log("Successfully validated conversation:", data[0].id);
            setExistingConversationId(data[0].id);
            setValidConversation(true);
            
            toast({
              title: "Welcome back!",
              description: "Your previous conversation has been loaded.",
              duration: 3000,
            });
          } else {
            console.log("Conversation found but couldn't be loaded or has no messages, creating new conversation");
            setExistingConversationId(null);
            // Clear any stale conversation data from storage
            clearCurrentConversationFromStorage('story');
          }
        } catch (err) {
          console.error("Error validating conversation:", err);
          setExistingConversationId(null);
          clearCurrentConversationFromStorage('story');
        }
      } else {
        console.log("No existing story conversations found");
      }
    } catch (error) {
      console.error('Error in conversation check:', error);
      toast({
        title: "Error checking conversations",
        description: "Please try refreshing the page.",
        variant: "destructive",
      });
    } finally {
      setIsCheckingConversations(false);
      setIsLoading(false);
    }
  };
  
  const handleCloseWelcomeModal = () => {
    setShowWelcomeModal(false);
    setIsLoading(false);
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  const handleSignIn = () => {
    navigate('/', { state: { openAuth: true } });
  };

  const handleSaveChat = () => {
    setShowSaveChatDialog(true);
  };

  // Force restart with a new conversation if needed
  const handleStartFresh = () => {
    setExistingConversationId(null);
    setValidConversation(false);
    clearCurrentConversationFromStorage('story');
    toast({
      title: "Starting fresh conversation",
      description: "Your previous conversation has been cleared.",
    });
    window.location.reload();
  };

  if (userLoading || isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-jess-background">
        <Header />
        <main className="flex-1 py-6 container mx-auto flex items-center justify-center">
          <div className="animate-pulse flex items-center">
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            Loading...
          </div>
        </main>
        <DisclaimerBanner />
      </div>
    );
  }

  if (!user || authError) {
    return (
      <div className="min-h-screen flex flex-col bg-jess-background">
        <Header />
        <main className="flex-1 py-6 container mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-8 max-w-md mx-auto text-center">
            <h2 className="text-xl font-medium mb-4">Sign In Required</h2>
            <p className="mb-6">Please sign in to access your personal story.</p>
            <div className="flex flex-col gap-3">
              <Button onClick={handleSignIn} className="w-full">
                Sign In
              </Button>
              <Button onClick={handleBack} variant="outline" className="w-full">
                Back to Home
              </Button>
            </div>
          </div>
        </main>
        <DisclaimerBanner />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-jess-background">
      <Header />
      <main className="flex-1 container mx-auto flex flex-col">
        <div className="flex justify-between items-center my-4">
          <h1 className="text-2xl font-medium">Let's Get to Know You</h1>
          {existingConversationId && (
            <Button variant="outline" size="sm" onClick={handleStartFresh}>
              Start Fresh Conversation
            </Button>
          )}
        </div>
        <div className="bg-white rounded-lg shadow-sm flex-1 flex flex-col overflow-hidden">
          <ChatInterface 
            type="story" 
            onBack={handleBack} 
            initialMessage={getInitialMessage('story')} 
            onEndChat={handleSaveChat}
            saveChat
            conversationId={existingConversationId}
          />
        </div>
      </main>
      <DisclaimerBanner />
      
      <WelcomeModal 
        open={showWelcomeModal} 
        onOpenChange={setShowWelcomeModal}
        title="Welcome to Your Story" 
        description="Let's get to know you better"
        buttonText="Let's Begin"
        type="story"
      />

      <SaveChatDialog
        open={showSaveChatDialog}
        onOpenChange={setShowSaveChatDialog}
      />
    </div>
  );
};

export default MyStory;
