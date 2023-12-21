import { oAuth2Client } from "@/lib/oauth";
import { gmail } from "@/lib/gmail";
import { getServerSession } from "next-auth";
import { getEmailDetails } from "@/app/actions";

const Email = async ({ email }: { email: any }) => {
  /*  const session = await getServerSession();
  const user = await prisma?.user.findUnique({
    where: {
      email: session?.user?.email!,
    },
  });
  oAuth2Client.setCredentials({
    refresh_token: user?.refresh_token!,
    access_token: user?.access_token!,
  }); */

  /*  const data = await getEmailDetails(email.id);
  console.log(data);
 */
  return <div>Email</div>;
};

export default Email;
