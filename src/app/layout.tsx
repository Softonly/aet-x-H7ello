import { ClerkProvider, ClerkLoaded } from "@clerk/nextjs";
import { Metadata } from "next";
import "../styles/globals.css";
import "../styles/sidebar.css";
import { fonts } from "../font";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Navbar from "../../@/components/layout/navbar";
import { Providers } from "./providers";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

// Ortam değişkenlerini doğrudan kullan
const TURSO_DATABASE_URL = process.env.TURSO_DATABASE_URL;
const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN;

if (!TURSO_DATABASE_URL || !TURSO_AUTH_TOKEN) {
  throw new Error("Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN in environment variables");
}

const client = createClient({
  url: TURSO_DATABASE_URL,
  authToken: TURSO_AUTH_TOKEN,
});

const db = drizzle(client);

export const metadata: Metadata = {
  title: "Aether DApp",
  description: "Generated by create dapp",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || ""}>
      <html lang="en" className="dark">
        <body className={`${fonts.default.className} bg-teal-800 min-h-screen text-white`}>
          <ClerkLoaded>
            <Providers>
              <div className="flex flex-col">
                <Navbar />
                <main>{children}</main>
              </div>
            </Providers>
          </ClerkLoaded>
          <Analytics />
          <SpeedInsights />
        </body>
      </html>
    </ClerkProvider>
  );
}
