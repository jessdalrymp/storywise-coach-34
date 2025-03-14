
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Pencil, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Header = () => {
  const { user } = useAuth();

  return (
    <header className="w-full py-4 px-6 flex items-center justify-between sticky top-0 z-10 bg-white border-b border-jess-subtle/30">
      <div className="flex items-center">
        <h1 className="text-2xl font-cormorant font-medium tracking-tight text-jess-foreground">
          JESS
        </h1>
      </div>

      <div className="flex items-center space-x-6">
        <Link 
          to="/dashboard"
          className="flex items-center text-jess-foreground hover:text-jess-primary transition-colors"
        >
          <Home size={20} className="mr-2" />
          <span className="font-medium">Home</span>
        </Link>
        
        {user && (
          <Link
            to="/account"
            className="flex items-center text-jess-foreground hover:text-jess-primary transition-colors"
          >
            <Pencil size={20} className="mr-2" />
            <span className="font-medium">Edit Profile</span>
          </Link>
        )}
      </div>
    </header>
  );
};
