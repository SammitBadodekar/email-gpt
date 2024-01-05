import { NextRequest, NextResponse } from "next/server";

import { OpenAIStream, StreamingTextResponse } from "ai";

export const dynamic = "force-dynamic";
export const runtime = "edge";

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const POST = async (req: NextRequest) => {
  const body = await req.json();

  try {
    if (body?.user?.access_token && body?.user.refresh_token) {
      console.log([
        {
          role: "system",
          content: `You are a professional email writer who gives responses based on previous emails and on the input prompt that the user provides, you will be provided with an array of emails with format {message: string , date: string, from: string, to: string } as the history of conversation, where the from and to are the email Ids of the users and user prompt. Give the appropriate email response based on the previous history emails and user prompt, use the history email array as context so any names or information should be used from context. You will be penalized if you use any information other than available in history and the response should be only in email format and the tone and style of the email should be the same as the requesting user.\n\nRequesting user email:\n${
            body?.user?.email
          }\n\nRequesting username:\n${
            body?.user?.name
          }\n\nEmail history Array:\n${JSON.stringify(body.emails)}`,
        },
        {
          role: "user",
          content: `User prompt:\n${body.messages[0].content}`,
        },
      ]);

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are a professional email writer who gives responses based on previous emails and on the input prompt that the user provides, you will be provided with an array of emails with format {message: string , date: string, from: string, to: string } as the history of conversation, where the from and to are the email Ids of the users and user prompt. Give the appropriate email response based on the previous history emails and user prompt, use the history email array as context so any names or information should be used from context. You will be penalized if you use any information other than available in history and the response should be only in email format and the tone and style of the email should be the same as the requesting user.\n\nRequesting user email:\n${
              body?.user?.email
            }\n\nRequesting username:\n${
              body?.user?.name
            }\n\nEmail history Array:\n${JSON.stringify(body.emails)}`,
          },
          {
            role: "user",
            content: `User prompt:\n${body.messages[0].content}`,
          },
        ],
        stream: true,
        temperature: 1,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });

      const stream = OpenAIStream(completion);
      return new StreamingTextResponse(stream);
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
