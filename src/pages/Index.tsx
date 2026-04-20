import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import LandingPage from "@/components/LandingPage";
import { useAuth } from "@/hooks/useAuth";

export default function Index() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate("/homepage", { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (user) return null;

  return <LandingPage />;
}
