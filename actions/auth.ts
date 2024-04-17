import { auth as Auth } from "@/auth";

export const auth = async () => {
    try {
        const session = await Auth();
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
