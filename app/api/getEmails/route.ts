import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { gmail } from "@/lib/gmail";
import { oAuth2Client } from "@/lib/oauth";

export const revalidate = 5;

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const email = searchParams.get("email");
  try {
    const data = await gmail.users.messages.list({
      userId: "me",
      q: `(from:${email} OR to:${email}) AND (from:me OR to:me)`,
      maxResults: 20,
    });

    const emails: any[] = [];
    const promises: Promise<any>[] = [];

    data.data.messages?.forEach((email) => {
      promises.push(
        gmail.users.messages.get({
          userId: "me",
          id: email.id!,
          format: "full",
          metadataHeaders: ["From", "To"],
        })
      );
    });

    return new NextResponse(JSON.stringify(emails));
  } catch (error) {
    console.log(error);
    return new NextResponse("error");
  }
};
