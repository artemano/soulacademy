import type { Metadata } from "next";
import { Barlow, Barlow_Condensed } from "next/font/google";
import "./globals.css";
//import { ClerkProvider } from "@clerk/nextjs";
import { ToastProvider } from "@/components/providers/toast-provider";
import { ConfettiProvider } from "@/components/providers/confetti-provider";
import AppSessionProvider from "@/components/providers/app-session.provider";
import GoogleCaptchaWrapper from "@/components/providers/google-captcha.provider";
import { Session } from "next-auth";

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: "Soul Academy",
  description: "Dale alimento productivo a tu alma",
};

export default function RootLayout({
  children,
  session
}: {
  children: React.ReactNode,
  session: Session
}) {
  return (
    <html lang="en">
      <body className={barlow.className} suppressHydrationWarning={true}>
        <AppSessionProvider session={session}>
          <GoogleCaptchaWrapper>
            <ConfettiProvider />
            <ToastProvider />
            {children}
          </GoogleCaptchaWrapper>
        </AppSessionProvider>

      </body>
    </html>
  );
}
