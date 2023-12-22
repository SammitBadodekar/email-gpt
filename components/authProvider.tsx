"use client";
import { SessionProvider } from "next-auth/react";
import toast, { Toaster } from "react-hot-toast";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <SessionProvider>
        {children}
        <Toaster />
      </SessionProvider>
    </div>
  );
};

export default AuthProvider;
