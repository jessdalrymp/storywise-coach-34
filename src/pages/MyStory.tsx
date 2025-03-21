
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Header } from "../components/Header";
import { DisclaimerBanner } from "../components/ui/DisclaimerBanner";
import { WelcomeModal } from "../components/chat/WelcomeModal";
import { SaveChatDialog } from "../components/chat/SaveChatDialog";
import { MyStoryLoading } from "../components/my-story/MyStoryLoading";
import { MyStoryUnauthenticated } from "../components/my-story/MyStoryUnauthenticated";
import { MyStoryHeader } from "../components/my-story/MyStoryHeader";
import { MyStoryChatContainer } from "../components/my-story/MyStoryChatContainer";
import { useMyStoryState } from "../components/my-story/useMyStoryState";
import { MyStoryPriorConversations } from "../components/my-story/MyStoryPriorConversations";
import { useToast } from "@/hooks/use-toast";

const MyStory = () => {
  const [searchParams] = useSearchParams();
  const urlConversationId = searchParams.get("conversationId");
  const { toast } = useToast();
  
  const {
    showWelcomeModal,
    setShowWelcomeModal,
    showSaveChatDialog,
    setShowSaveChatDialog,
    isLoading,
    userLoading,
    existingConversationId,
    user,
    handleBack,
    handleSaveChat,
    handleStartFresh,
    refreshDataOnSave,
    priorConversations,
    loadingPriorConversations,
    handleLoadConversation,
    isLoadingConversation
  } = useMyStoryState();
  
  // Load conversation from URL parameter if present
  useEffect(() => {
    if (urlConversationId && user && !isLoading) {
      console.log("Found conversation ID in URL:", urlConversationId);
      handleLoadConversation(urlConversationId);
    }
  }, [urlConversationId, user, isLoading]);
  
  // Refresh prior conversations when loading is complete
  useEffect(() => {
    if (!isLoading && !userLoading && !isLoadingConversation) {
      console.log("MyStory: Loading complete, priorConversations:", priorConversations.length);
    }
  }, [isLoading, userLoading, isLoadingConversation, priorConversations]);
  
  if (userLoading || isLoading || isLoadingConversation) {
    return <MyStoryLoading />;
  }

  if (!user) {
    return <MyStoryUnauthenticated />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-jess-background">
      <Header />
      <main className="flex-1 container mx-auto flex flex-col">
        <MyStoryHeader 
          existingConversationId={existingConversationId} 
          onStartFresh={handleStartFresh} 
        />
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="md:col-span-3">
            <MyStoryChatContainer 
              onBack={handleBack} 
              onSave={handleSaveChat}
              conversationId={existingConversationId}
            />
          </div>
          <div className="md:col-span-1">
            <MyStoryPriorConversations
              conversations={priorConversations}
              loading={loadingPriorConversations}
              onSelectConversation={handleLoadConversation}
              currentConversationId={existingConversationId}
            />
          </div>
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
        refreshData={refreshDataOnSave}
        persistConversation={true}
      />
    </div>
  );
};

export default MyStory;
