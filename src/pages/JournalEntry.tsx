import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Header } from "../components/Header";
import { DisclaimerBanner } from "../components/ui/DisclaimerBanner";
import { ArrowLeft } from "lucide-react";
import { ActionButton } from "../components/ui/ActionButton";
import { JournalEntry as JournalEntryType } from "../lib/types";
import { useUserData } from "../context/UserDataContext";

const JournalEntry = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { journalEntries } = useUserData();
  const [entry, setEntry] = useState<JournalEntryType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // First check if entry was passed via location state
    if (location.state?.entry) {
      setEntry(location.state.entry);
      setLoading(false);
      return;
    }
    
    // Otherwise, find by ID
    if (id && journalEntries.length > 0) {
      const foundEntry = journalEntries.find(entry => entry.id === id);
      if (foundEntry) {
        setEntry(foundEntry);
      }
      setLoading(false);
    }
  }, [id, location.state, journalEntries]);

  // Function to render content with proper formatting for newlines
  const renderContent = () => {
    if (!entry) return null;
    
    // Split content by newlines and render each paragraph
    return entry.content.split('\n').map((paragraph, index) => {
      // If it's an empty line, render a break
      if (!paragraph.trim()) {
        return <br key={index} />;
      }
      
      return <p key={index}>{paragraph}</p>;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-jess-background">
        <Header />
        <main className="flex-1 py-6 container mx-auto">
          <div className="text-center py-8">Loading...</div>
        </main>
        <DisclaimerBanner />
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="min-h-screen flex flex-col bg-jess-background">
        <Header />
        <main className="flex-1 py-6 container mx-auto">
          <div className="text-center py-8">
            <p className="text-jess-muted mb-2">Entry not found</p>
            <ActionButton 
              type="primary" 
              className="mt-4" 
              onClick={() => navigate('/journal-history')}
            >
              Back to Journal History
            </ActionButton>
          </div>
        </main>
        <DisclaimerBanner />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-jess-background">
      <Header />
      <main className="flex-1 py-6 container mx-auto">
        <div className="flex items-center mb-6">
          <ActionButton 
            type="ghost" 
            className="mr-4" 
            onClick={() => navigate('/journal-history')}
          >
            <ArrowLeft size={18} className="mr-2" />
            Back to Journal
          </ActionButton>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-2xl font-semibold">{entry.title}</h1>
              <span className="text-sm px-3 py-1 bg-jess-subtle rounded-full">
                {entry.type}
              </span>
            </div>
            <p className="text-sm text-jess-muted">
              {new Date(entry.createdAt).toLocaleDateString('en-US', { 
                weekday: 'long',
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          
          <div className="prose max-w-none">
            {renderContent()}
          </div>
        </div>
      </main>
      <DisclaimerBanner />
    </div>
  );
};

export default JournalEntry;
