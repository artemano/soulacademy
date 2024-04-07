import NextAuth, {
  Account,
  AuthOptions,
  NextAuthOptions,
  Session,
  User,
} from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import { z } from "zod";

const loginUserSchema = z.object({
  csrfToken: z.string(),
  email: z.string().email(),
  password: z.string().min(7, "Logitud de password incorrecta!"),
});

const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "Tu email, p.r juan.perez@gmailcom",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Tu contraseña",
        },
      },
      async authorize(credentials, req) {
        try {
          const { email, password } = loginUserSchema.parse(req.body);
          console.log(process.env.NEXT_PUBLIC_STRAPI_API_URL);

          const url = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/auth/local`;

          const options = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              identifier: email,
              password,
            }),
          };
          const response = await fetch(url, options);
          const data = await response.json();
          if (response.ok) {
            const user: User = {
              id: "" + data.user.id,
              username: data.user.username,
              email: data.user.email,
              token: data.jwt,
              name: data.user.name,
              lastname: data.user.lastname,
            };
            return user;
          } else {
            console.error(data.error?.status, data.error?.message);
            return null;
          }
        } catch (error) {
          console.error("Error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account }) {
      ////console.log("SIGNIN", user, account);
      if (user) {
        return true;
      }
      return false;
    },
    async jwt({ token, user, session }) {
      //console.log("JWT", token, user, session);
      if (session === undefined) {
        if (user) {
          const tempToken = {
            ...token,
            email: user.email,
            username: user.username,
            idToken: user.token,
            sub: user.id,
            name: user.name,
            lastname: user.lastname,
          };
          //console.log("TEMP:", tempToken);
          return tempToken;
        }
      }
      return token;
    },
    async session({
      session,
      token,
      user,
    }: {
      session: Session;
      token: JWT;
      user: User;
    }) {
      //console.log("SESSION", session, token, user);
      const reply = {
        ...session,
        user: {
          id: token.sub,
          username: token.username,
          token: token.idToken,
          name: token.name,
          lastname: token.lastname,
        },
      } as Session;
      //console.log("TEMP_SESSION:", reply);
      return reply;
    },
    async redirect({ url, baseUrl }) {
      return url;
    },
  },
  pages: {
    signIn: "/login",
    newUser: "/register",
  },
} satisfies NextAuthOptions;

export default authOptions;
