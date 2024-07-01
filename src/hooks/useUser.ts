import { User } from "@supabase/supabase-js";
import React from "react";
import { AuthContext } from "../components/AuthContext.tsx";

export const useUser = (): User => {
  const context = React.useContext(AuthContext);
  if (context === null) {
    throw new Error("useUser must be used within an AuthProvider");
  }
  return context.user;
};

export default useUser;
