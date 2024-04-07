import NextAuth from "next-auth";
import authOptions from "./options";

const handler = NextAuth(authOptions);
// Use it in server contexts
export { handler as GET, handler as POST };
