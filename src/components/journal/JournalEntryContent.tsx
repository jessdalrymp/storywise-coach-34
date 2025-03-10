import { JournalEntry } from "@/lib/types";

interface JournalEntryContentProps {
  entry: JournalEntry;
  parsedContent: { title?: string; summary?: string } | null;
}

export const JournalEntryContent = ({ entry, parsedContent }: JournalEntryContentProps) => {
  // Function to render content with proper formatting for newlines
  const renderContent = () => {
    // If we have parsed JSON content, use the summary
    if (parsedContent && parsedContent.summary) {
      return parsedContent.summary.split('\n').map((paragraph, index) => {
        if (!paragraph.trim()) {
          return <br key={index} />;
        }
        return <p key={index} className="mb-4">{paragraph}</p>;
      });
    }
    
    // Otherwise use the raw content
    return entry.content.split('\n').map((paragraph, index) => {
      if (!paragraph.trim()) {
        return <br key={index} />;
      }
      return <p key={index} className="mb-4">{paragraph}</p>;
    });
  };

  return (
    <div className="prose max-w-none">
      {renderContent()}
    </div>
  );
};
