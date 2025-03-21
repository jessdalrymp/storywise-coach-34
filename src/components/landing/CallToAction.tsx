
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export const CallToAction = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-jess-subtle to-jess-subtle/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold mb-6">Start Your Self-Discovery Journey Today</h2>
        <p className="text-xl text-jess-muted max-w-2xl mx-auto mb-8">
          Join thousands who are using JESS to better understand themselves and shape their futures.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/dashboard">
            <Button size="lg" className="px-8 w-full sm:w-auto">
              Begin Your Story
            </Button>
          </Link>
          <Link to="/free-journal-prompts">
            <Button size="lg" variant="outline" className="px-8 w-full sm:w-auto">
              Try Free Prompts
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
