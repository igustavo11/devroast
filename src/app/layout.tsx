import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { NavbarLogo, NavbarNav, NavbarRoot } from '@/components/ui/navbar';
import { TRPCProvider } from '@/trpc/client';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'devroast',
  description: 'paste your code. get roasted.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased bg-bg-page`}
      >
        <NavbarRoot>
          <NavbarLogo>devroast</NavbarLogo>
          <NavbarNav>
            <a
              href="/leaderboard"
              className="font-mono text-[13px] text-text-secondary hover:text-text-primary transition-colors"
            >
              leaderboard
            </a>
          </NavbarNav>
        </NavbarRoot>
        <TRPCProvider>{children}</TRPCProvider>
      </body>
    </html>
  );
}
