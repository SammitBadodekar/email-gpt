import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { oAuth2Client } from "@/lib/oauth";
import { options } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { gmail } from "@/lib/gmail";

export const dynamic = "force-dynamic";

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const POST = async (req: NextRequest) => {
  const body = await req.json();

  try {
    const session = await getServerSession(options);
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
      const data = await gmail.users.messages.list({
        userId: "me",
        q: `(from:${body.email} OR to:${body.email}) AND (from:me OR to:me)`,
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
        const formattedEmail = {
          message: email.data.snippet,
          date: email.data.payload.headers[1].value,
          from: email.data.payload.headers[4].value,
          to: email.data.payload.headers[5].value,
        };
        emails.push(formattedEmail);
      });

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are a professional email writer who gives responses based on previous emails and on the input prompt that the user provides, you will be provided with an array of emails with format {message: string , date: string, from: string, to: string } as the history of conversation, where the from and to are the email Ids of the users and user prompt. Give the appropriate email response based on the previous history emails and user prompt, use the history email array as context so any names or information should be used from context. You will be penalized if you use any information other than available in history and the response should be only in email format and the tone and style of the email should be the same as the requesting user.\n\nRequesting user email:\n${
              user?.email
            }\n\nRequesting username:\n${
              user?.name
            }\n\nEmail history Array:\n${JSON.stringify(emails)}`,
          },
          {
            role: "user",
            content: `User prompt:\n${body.prompt}`,
          },
        ],
        temperature: 1,
        max_tokens: 3000,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });

      console.log(completion.choices[0]);

      return new NextResponse(JSON.stringify(completion.choices[0]));
    } else {
      return new NextResponse(
        JSON.stringify({
          message: {
            content: "please authorize gmail !!!",
          },
        })
      );
    }
  } catch (error) {
    console.log(error);
    return new NextResponse(
      JSON.stringify({
        message: {
          content: error,
        },
      })
    );
  }
};
