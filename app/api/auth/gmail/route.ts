import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { options } from "../[...nextauth]/options";
import { oAuth2Client } from "@/lib/oauth";
import { redirect } from "next/navigation";

export const GET = async (req: NextRequest) => {
  try {
    const searchParams = req.nextUrl.searchParams;
    const code = searchParams.get("code");

    const session = await getServerSession(options);

    if (code && session?.user?.email) {
      oAuth2Client.getToken(code, async (err, tokens) => {
        if (err) {
          console.log(err);
        } else {
          const accessToken = tokens?.access_token;
          const refreshToken = tokens?.refresh_token;

          await prisma.user.update({
            where: {
              email: session?.user?.email as string,
            },
            data: {
              refresh_token: refreshToken,
              access_token: accessToken,
            },
          });
        }
      });
    }
    redirect("/");
    return;
  } catch (error) {
    console.log(error);
    redirect("/");
    return new NextResponse("error");
  }
};
