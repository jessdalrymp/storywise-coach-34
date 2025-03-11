
import { Header } from "../components/Header";
import { DisclaimerBanner } from "../components/ui/DisclaimerBanner";
import { JournalChallengeContent } from "../components/journal/JournalChallengeContent";

const JournalChallenge = () => {
  return (
    <div className="min-h-screen flex flex-col bg-jess-background">
      <Header />
      <main className="flex-1 px-4 sm:px-6 py-3 container mx-auto max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm">
          <JournalChallengeContent />
        </div>
      </main>
      <DisclaimerBanner />
    </div>
  );
};

export default JournalChallenge;
