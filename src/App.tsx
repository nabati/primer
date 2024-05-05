import "./App.css";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

const supabase = createClient(
  "https://ykwhwaydruzwdnoaaswt.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlrd2h3YXlkcnV6d2Rub2Fhc3d0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQ5MTU0MjUsImV4cCI6MjAzMDQ5MTQyNX0.syZdVHFCQJwCRc6dHql7RMxVZS3Pj9RPlNXW_TcJKzk",
);

export default function App(): JSX.Element {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!session) {
    return (
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        providers={["google"]}
      />
    );
  } else {
    return <div>Logged in!</div>;
  }
}
