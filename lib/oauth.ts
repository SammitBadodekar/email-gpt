import { google } from "googleapis";

export const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_ID,
  process.env.GOOGLE_SECRET,
  process.env.NEXTAUTH_URL + "/api/auth/gmail"
);
