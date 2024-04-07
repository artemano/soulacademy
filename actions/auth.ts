import authOptions from "@/app/api/auth/[...nextauth]/options";
import { Session, getServerSession } from "next-auth";


export const auth = async () => {
    try {
        const session = await getServerSession(authOptions) as Session;
        if (session?.user) {
            return {
                userId: session.user.username,
                sessionToken: session.user.token
            }
        }
        return { userId: null };

    } catch (error) {
        console.log("[AUTH_WRAPPER]", error);
        return { userId: null };
    }
}
