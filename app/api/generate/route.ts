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
  console.log(body);

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
        maxResults: 50,
      });

      const emails: any[] = [];
      const promises: Promise<any>[] = [];

      data.data.messages?.forEach((email) => {
        promises.push(
          gmail.users.messages.get({
            userId: "me",
            id: email.id!,
            format: "full",
          })
        );
      });

      const resp = await Promise.all(promises);

      resp.forEach((email) => {
        const formattedEmail = {
          message: email.data.snippet,
          date: email.data.internalDate,
        };
        emails.push(formattedEmail);
      });

      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `You are a professional email writer who gives response based on previous emails and on the input prompt that the user provides, you will be provided with an array of emails from ${body.email} with format {message: string , date: int } as the history of conversation and a user input. This is the email history Array: ${JSON.stringify(
              emails
            )} from ${body.email} \n and the user input: ${body.prompt} \n Now give the appropriate email reponse based on the previous history emails and user input, use the history email array as context so any names or information should be used from context`,
          },
        ],
        model: "gpt-3.5-turbo",
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
    return new NextResponse("error");
  }
};
