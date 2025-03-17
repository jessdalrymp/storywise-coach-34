
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

export const Hero = () => {
  return (
    <section className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-jess-foreground">
          Your Personal AI Journaling Coach
        </h1>
        <p className="text-xl text-jess-muted max-w-3xl mx-auto mb-8">
          JESS guides you through Journaling, Exploration, Storytelling, and Self-Discovery 
          to help you understand your narrative and grow.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/dashboard">
            <Button size="lg" className="w-full sm:w-auto bg-jess-primary hover:bg-jess-primary/90">
              Start Your Journey
              <ChevronRight className="ml-2" size={18} />
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button size="lg" variant="outline" className="w-full sm:w-auto border-jess-primary text-jess-primary hover:bg-jess-primary/10">
              Login to Continue
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
