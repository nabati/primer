import "./App.css";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { getSupabaseClient } from "../supabaseClient.ts";
import Layout from "./Layout.tsx";
export default function App(): JSX.Element {
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

  return <Layout />;
}
