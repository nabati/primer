// React AuthContext

import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Session } from "@supabase/supabase-js";
import React, { createContext, useState, useEffect } from "react";
import { getSupabaseClient } from "../supabaseClient.ts";

type User = {
  id: string;
};

type AuthContextType = {
  user: User;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const useUser = (): User => {
  const context = React.useContext(AuthContext);
  if (context === null) {
    throw new Error("useUser must be used within an AuthProvider");
  }
  return context.user;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    getSupabaseClient()
      .auth.getSession()
      .then(({ data: { session } }) => {
        setSession(session);
      });

    const {
      data: { subscription },
    } = getSupabaseClient().auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!session) {
    return (
      <Auth
        supabaseClient={getSupabaseClient()}
        appearance={{ theme: ThemeSupa }}
        providers={["google"]}
      />
    );
  }

  return (
    <AuthContext.Provider value={{ user: session.user }}>
      {children}
    </AuthContext.Provider>
  );
};
