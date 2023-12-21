import { oAuth2Client } from "@/lib/oauth";
import { google } from "googleapis";

export const gmail = google.gmail({ version: "v1", auth: oAuth2Client });
