
import { createContext, useContext, ReactNode } from 'react';
import { User } from '../lib/types';
import { useAuthState } from '../hooks/useAuthState';
import { useAuthActions } from '../hooks/useAuthActions';

// Update the return types of signIn and signUp to match what they actually return
interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, name?: string) => Promise<any>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<boolean>;
}

const defaultAuthContext: AuthContextType = {
  user: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  resetPassword: async () => false,
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { user, loading: stateLoading } = useAuthState();
  const { signIn, signUp, signOut, resetPassword, loading: actionLoading } = useAuthActions();

  const isLoading = stateLoading || actionLoading;
  console.log("AuthProvider loading state:", isLoading);
  console.log("Current user state:", user);

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading: isLoading,
        signIn,
        signUp,
        signOut,
        resetPassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
