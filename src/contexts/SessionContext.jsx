import { createContext, useContext, useEffect, useState } from "react";
// import supabase from "../supabase";
// import LoadingPage from "../pages/LoadingPage";
import supabase from "../services/supabase";
import FullscreenSpinner from "../ui/FullscreenSpinner";
import { getUserProfileData } from "../services/apiProfile";
// import { Session } from "@supabase/supabase-js";

const SessionContext = createContext(null);

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};

export const SessionProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const authStateListener = supabase.auth.onAuthStateChange(
      async (_, session) => {
        // console.log("dss", session);
        if (session?.user) {
          setIsLoading(true);
          getUserProfileData({
            id: session.user.id,
          }).then((userProfileData) => {
            setUserProfile(userProfileData);
            setIsLoading(false);
          });
        } else {
          setIsLoading(false);
        }
        setSession(session);
      },
    );

    return () => {
      authStateListener.data.subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <SessionContext.Provider
      value={{ session, userProfile, isLoading, setUserProfile }}
    >
      {isLoading ? <FullscreenSpinner /> : children}
    </SessionContext.Provider>
  );
};
