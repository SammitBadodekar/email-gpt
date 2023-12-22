"use client";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import React from "react";
import { BsGoogle } from "react-icons/bs";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const Page = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  console.log(session?.user);

  if (status === "authenticated") {
    router.push("/");
  }

  return (
    <div className="flex justify-center items-center w-full h-[100dvh] bg-slate-200">
      <div className=" flex flex-col gap-4 rounded-2xl bg-secondaryLightTheme p-8 shadow-xl dark:bg-darkGray sm:px-16 bg-white">
        <h1 className=" text-center text-xl font-black sm:px-8 sm:text-2xl">
          Welcome Back !!
        </h1>
        <Button
          onClick={() => {
            signIn("google");
          }}
          className="flex items-center gap-2 font-extrabold"
        >
          <BsGoogle />
          Login with Google
        </Button>
      </div>
    </div>
  );
};

export default Page;
