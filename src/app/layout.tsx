import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Schedule Manager | Photography Portfolio",
  description: "Schedule your photography sessions with ease.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} antialiased`}>
        <nav className="fixed top-0 w-full z-50 glass border-b border-black/5">
          <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
            <Link href="/" className="text-2xl font-serif tracking-tight">
              ystar<span className="text-primary">.</span>
            </Link>
            <div className="flex gap-8 text-sm font-medium uppercase tracking-widest">
              {/* <Link href="/" className="hover:text-primary transition-colors">Schedule</Link>
              <Link href="/book" className="hover:text-primary transition-colors">Book a Session</Link> */}
              {/* <Link href="/admin/login" className="hover:text-primary transition-colors">Admin</Link> */}
            </div>
          </div>
        </nav>
        <div className="flex flex-col min-h-screen">
          <main className="pt-20 flex-grow">
            {children}
          </main>
          <footer className="py-12 px-6 text-center text-sm text-foreground/40 border-t border-black/5">
            <p>© {new Date().getFullYear()} ystar. All rights reserved.</p>
          </footer>
        </div>

      </body>
    </html>
  );
}
