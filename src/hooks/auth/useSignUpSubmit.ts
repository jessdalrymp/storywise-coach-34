
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useSignUp } from './useSignUp';
import { sendCustomVerificationEmail } from '../../utils/emailVerification';

interface UseSignUpSubmitProps {
  onVerificationSent: (email: string) => void;
}

export const useSignUpSubmit = ({ onVerificationSent }: UseSignUpSubmitProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { signUp, loading } = useSignUp();
  const { toast } = useToast();

  const handleSubmit = async (
    e: React.FormEvent,
    email: string,
    password: string, 
    name: string,
    validateForm: () => boolean,
    setError: (error: string | null) => void
  ) => {
    e.preventDefault();
    setError(null);
    
    try {
      if (!validateForm()) {
        return;
      }

      setIsProcessing(true);
      console.log("Attempting to sign up with:", { email, name });
      const result = await signUp(email, password, name);
      
      // Check if user exists
      if (result?.exists) {
        console.log("User already exists");
        setError("An account with this email already exists. Try signing in instead.");
        return;
      }
      
      // If no session was created, assume verification is required
      if (result?.user && result.emailVerificationRequired) {
        console.log("Email verification required, sending verification email");
        
        // Send verification email using our custom sender
        const emailSent = await sendCustomVerificationEmail(email);
        
        if (emailSent) {
          console.log("Verification email sent successfully");
          toast({
            title: "Account created",
            description: "Please check your email to verify your account. If you don't see it, check your spam folder.",
            duration: 6000,
          });
          onVerificationSent(email);
        } else {
          console.log("Failed to send verification email");
          toast({
            title: "Account created, but...",
            description: "We had trouble sending the verification email. Please try signing in after a few minutes or contact support if the issue persists.",
            duration: 8000,
            variant: "destructive",
          });
          onVerificationSent(email);
        }
      } else if (result?.user && result.session) {
        // User was created and logged in immediately (email verification disabled)
        toast({
          title: "Account created successfully",
          description: "You have been logged in automatically.",
          duration: 4000,
        });
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      
      let errorMessage = "An unexpected error occurred. Please try again.";
      
      if (error.message) {
        if (error.message.includes("User already registered")) {
          errorMessage = "An account with this email already exists. Try signing in instead.";
        } else if (error.message.includes("rate limit") || error.message.includes("429")) {
          errorMessage = "Too many attempts. Please try again after a few minutes.";
        } else if (error.message.includes("sending email") || error.message.includes("smtp")) {
          errorMessage = "There was an issue with our email service. Your account has been created, but you may need to try signing in to verify your email.";
        } else {
          errorMessage = error.message;
        }
      }
      
      setError(errorMessage);
      
      toast({
        title: "Registration issue",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    handleSubmit,
    isProcessing,
    loading
  };
};
