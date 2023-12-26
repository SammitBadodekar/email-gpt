"use server";

import { gmail } from "@/lib/gmail";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";
import { oAuth2Client } from "@/lib/oauth";

export const getEmails = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const session = await getServerSession();
  const user = await prisma?.user.findUnique({
    where: {
      email: session?.user?.email!,
    },
  });
  oAuth2Client.setCredentials({
    refresh_token: user?.refresh_token!,
    access_token: user?.access_token!,
  });
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

  const resp = await Promise.all(promises);

  resp.forEach((email) => {
    const FromRegex = /^(?:.+ <.+@[^>]+>$|^"([^"]*)"$)/;
    const ToRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const isValidFrom = FromRegex.test(email.data.payload.headers[4].value);
    const isValidTo = ToRegex.test(email.data.payload.headers[5].value);

    const formattedEmail = {
      message: email.data.snippet,
      date: email.data.payload.headers[1].value,
      from: isValidFrom ? email.data.payload.headers[4].value : "",
      to: isValidTo ? email.data.payload.headers[5].value : "",
    };
    emails.push(formattedEmail);
  });

  return JSON.stringify(emails);
};
