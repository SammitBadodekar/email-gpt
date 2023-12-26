import SignOutButton from "@/components/ui/signOutButton";
import { oAuth2Client } from "@/lib/oauth";
import Link from "next/link";
import DisplayEmails from "@/components/ui/displayEmails";
import { Button } from "@/components/ui/button";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";

export default async function Home() {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: "openid https://mail.google.com",
    prompt: "consent",
    state: "some random value",
  });

  const session = await getServerSession();
  const user = await prisma?.user.findUnique({
    where: {
      email: session?.user?.email!,
    },
  });

  if (user?.access_token && user.refresh_token) {
    oAuth2Client.setCredentials({
      refresh_token: user?.refresh_token!,
      access_token: user?.access_token!,
    });
  }

  return (
    <main className="flex h-[100dvh] flex-col justify-center items-center gap-8 bg-gray-200 overflow-y-scroll">
      <p className=" font-medium">Email GPT</p>
      <DisplayEmails user={user!} />
      <div className=" flex gap-8">
        <Button asChild variant="secondary">
          <Link href={authUrl} className=" border-2 border-gray-500">
            connect gmail
          </Link>
        </Button>

        <SignOutButton />
      </div>
    </main>
  );
}
