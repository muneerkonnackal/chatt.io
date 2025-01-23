import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Navbar } from "@/components/layout/Navbar";
import Container from "@/components/layout/Container";
import SocketProvider from "@/providers/SocketProvider";
import { cn } from "@/lib/utils";
import TanstackProviders from "@/lib/tanstack-query/TanstackProvider";



// Correctly initialize Inter font loader
const inter = Inter({
  subsets: ["latin"],
});

export const metadata = {
  title: "VidChat",
  description: "Videocall",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={cn(inter.className, "relative")}
        >
         <TanstackProviders>
            <SocketProvider>
              <main className="flex flex-col min-h-screen bg-secondary">
                <Navbar />
                <Container />
                {children}
              </main>
            </SocketProvider>
         </TanstackProviders>
        </body>
      </html>
    </ClerkProvider>
  );
}
