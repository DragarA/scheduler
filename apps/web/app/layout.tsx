// app/layout.tsx
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from '@clerk/nextjs';
import { ReactQueryProvider } from './react-query-provider';
import { CalendarClock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Scheduler',
  description: 'Scheduler – a modern scheduling app inspired by Setmore.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-950 text-slate-50`}
        >
          <div className="h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 flex flex-col overflow-hidden">
            {/* Global nav */}
            <header className="shrink-0 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur">
              <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 lg:px-6">
                <Link href="/" className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-500/10 ring-1 ring-sky-500/40">
                    <CalendarClock className="h-5 w-5 text-sky-400" />
                  </div>
                  <span className="text-lg font-semibold tracking-tight">
                    Scheduler
                  </span>
                </Link>

                <div className="flex items-center gap-3">
                  <SignedOut>
                    <SignInButton mode="modal">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-sm text-slate-200"
                      >
                        Sign in
                      </Button>
                    </SignInButton>
                    <Button
                      size="sm"
                      className="gap-1 text-sm transition-colors hover:bg-sky-500/10 hover:text-sky-400"
                      asChild
                    >
                      <Link href="/get-started">
                        Get started
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </SignedOut>
                  <SignedIn>
                    <UserButton
                      appearance={{
                        elements: {
                          avatarBox: 'h-8 w-8',
                        },
                      }}
                    />
                  </SignedIn>
                </div>
              </div>
            </header>

            {/* Page content */}
            <ReactQueryProvider>
              <main className="flex-1 flex flex-col relative min-h-0 overflow-hidden">{children}</main>
            </ReactQueryProvider>

            {/* Global tiny footer */}
            <footer className="shrink-0 border-t border-slate-800/60 py-4">
              <div className="mx-auto flex max-w-6xl items-center justify-between px-4 text-xs text-slate-500 lg:px-6">
                <span>© {new Date().getFullYear()} Scheduler</span>
              </div>
            </footer>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
