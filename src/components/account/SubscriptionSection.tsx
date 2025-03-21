
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, AlertCircle, XCircle } from "lucide-react";
import { Button } from "../ui/button";
import { Subscription } from "../../context/types";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "../../integrations/supabase/client";

interface SubscriptionSectionProps {
  subscription: Subscription | null;
}

export const SubscriptionSection = ({ subscription }: SubscriptionSectionProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isCancelling, setIsCancelling] = useState(false);

  const handleCancelSubscription = async () => {
    if (!subscription) return;
    
    setIsCancelling(true);
    try {
      const { error } = await supabase.functions.invoke("cancel-subscription", {
        body: { subscriptionId: subscription.id }
      });

      if (error) throw error;

      toast({
        title: "Subscription cancelled",
        description: "Your subscription has been cancelled successfully",
      });
      
      // Redirect to subscription page to show updated status
      navigate('/subscription');
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      toast({
        title: "Error cancelling subscription",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsCancelling(false);
    }
  };

  if (!subscription) {
    return (
      <div className="p-4 border border-jess-subtle rounded-lg">
        <h3 className="font-medium mb-3 flex items-center">
          <CreditCard size={18} className="mr-2" />
          Subscription
        </h3>
        <p className="text-sm text-jess-muted mb-2">You don't have an active subscription.</p>
        <Button 
          variant="outline" 
          size="sm"
          className="mt-2"
          onClick={() => navigate('/subscription')}
        >
          View Subscription Options
        </Button>
      </div>
    );
  }

  if (subscription.is_unlimited) {
    return (
      <div className="p-4 border border-jess-subtle rounded-lg">
        <h3 className="font-medium mb-3 flex items-center">
          <CreditCard size={18} className="mr-2" />
          Subscription
        </h3>
        <p className="text-sm text-jess-muted mb-2">
          <span className="font-medium text-jess-primary">Unlimited Access</span>
        </p>
        {subscription.coupon_code && (
          <p className="text-xs text-jess-muted">Applied coupon: {subscription.coupon_code}</p>
        )}
        <div className="flex flex-col space-y-2 mt-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/subscription')}
          >
            Manage Subscription
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleCancelSubscription}
            disabled={isCancelling}
            className="flex items-center bg-[#FEC6A1] hover:bg-[#FEC6A1]/80 text-foreground"
          >
            <XCircle size={16} className="mr-1" />
            Cancel Subscription
          </Button>
        </div>
      </div>
    );
  }

  if (subscription.is_trial) {
    const trialEndDate = new Date(subscription.trial_ends_at || '');
    const daysLeft = Math.max(0, Math.ceil((trialEndDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
    
    return (
      <div className="p-4 border border-jess-subtle rounded-lg">
        <h3 className="font-medium mb-3 flex items-center">
          <CreditCard size={18} className="mr-2" />
          Trial Subscription
        </h3>
        <p className="text-sm text-jess-muted mb-2">Your trial ends in {daysLeft} days ({trialEndDate.toLocaleDateString()}).</p>
        {daysLeft <= 2 && (
          <div className="mb-2 flex items-start text-sm text-jess-accent">
            <AlertCircle size={16} className="mr-1 flex-shrink-0 mt-0.5" />
            <span>Your trial is ending soon! Please subscribe to continue using premium features.</span>
          </div>
        )}
        <div className="flex flex-col space-y-2 mt-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/subscription')}
          >
            Manage Subscription
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleCancelSubscription}
            disabled={isCancelling}
            className="flex items-center bg-[#FEC6A1] hover:bg-[#FEC6A1]/80 text-foreground"
          >
            <XCircle size={16} className="mr-1" />
            Cancel Trial
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 border border-jess-subtle rounded-lg">
      <h3 className="font-medium mb-3 flex items-center">
        <CreditCard size={18} className="mr-2" />
        Subscription
      </h3>
      <p className="text-sm text-jess-muted mb-2">Status: {subscription.status}</p>
      {subscription.current_period_ends_at && (
        <p className="text-sm text-jess-muted mb-2">
          Next payment due: {new Date(subscription.current_period_ends_at).toLocaleDateString()}
        </p>
      )}
      <div className="flex flex-col space-y-2 mt-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate('/subscription')}
        >
          Manage Subscription
        </Button>
        {subscription.status === "active" && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleCancelSubscription}
            disabled={isCancelling}
            className="flex items-center bg-[#FEC6A1] hover:bg-[#FEC6A1]/80 text-foreground"
          >
            <XCircle size={16} className="mr-1" />
            Cancel Subscription
          </Button>
        )}
      </div>
    </div>
  );
};
