"use client";
import React from "react";
import { Button } from "./button";
import { signOut } from "next-auth/react";

const SignOutButton = () => {
  return (
    <div className=" grid gap-4">
      <Button
        onClick={() => signOut()}
        className="flex items-center gap-2 font-extrabold"
        variant="destructive"
      >
        Logout
      </Button>
    </div>
  );
};

export default SignOutButton;
