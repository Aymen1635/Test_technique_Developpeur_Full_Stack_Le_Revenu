import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import { ToastProvider } from '@/components/ui/toast';
import { DemoUserBar } from '@/components/layout/demo-user-bar';
import { SiteBar } from '@/components/layout/site-bar';
import { Header } from '@/components/layout/header';
import { MobileNav } from '@/components/layout/mobile-nav';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['700', '900'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Communauté Le Revenu - Échanges, questions et conseils financiers',
  description:
    'Espace d’échange et d’entraide entre lecteurs du Revenu et la rédaction : Bourse, épargne, impôts, retraite, immobilier et transmission.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen flex flex-col font-body">
        <AuthProvider>
          <ToastProvider>
            <DemoUserBar />
            <SiteBar />
            <Header />
            <div className="wrap flex-1 w-full">{children}</div>
            <MobileNav />
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
