import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { SmoothScrollProvider } from '@/lib/scroll';
import { Navigation } from '@/components/Navigation';
import { PageTransition } from '@/components/PageTransition';
import { Cursor } from '@/components/ui/Cursor';
import { PROFILE } from '@/lib/data';

const interTight = localFont({
  src: [
    {
      path: '../fonts/InterTight-Variable.woff2',
      style: 'normal',
    },
    {
      path: '../fonts/InterTight-Italic-Variable.woff2',
      style: 'italic',
    },
  ],
  variable: '--font-inter-tight',
  display: 'swap',
});

const instrumentSerif = localFont({
  src: [
    {
      path: '../fonts/InstrumentSerif-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../fonts/InstrumentSerif-Italic.woff2',
      weight: '400',
      style: 'italic',
    },
  ],
  variable: '--font-instrument-serif',
  display: 'swap',
});

const jetbrainsMono = localFont({
  src: [
    {
      path: '../fonts/JetBrainsMono-Variable.woff2',
      style: 'normal',
    },
    {
      path: '../fonts/JetBrainsMono-Italic-Variable.woff2',
      style: 'italic',
    },
  ],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#f4f2ee',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    template: `%s — ${PROFILE.name}`,
    default: `${PROFILE.name} — ${PROFILE.role}`,
  },
  description: PROFILE.resumeSummary,
  authors: [{ name: PROFILE.name, url: PROFILE.github }],
  creator: PROFILE.name,
  keywords: [
    'Saanvi Aggarwal',
    'Computer Science',
    'Artificial Intelligence',
    'Machine Learning',
    'Chandigarh University',
    'Python',
    'C++',
    'Software Developer',
    'Portfolio',
  ],
  metadataBase: new URL('https://saanviaggarwal.dev'),
  openGraph: {
    title: `${PROFILE.name} — ${PROFILE.role}`,
    description: PROFILE.resumeSummary,
    url: 'https://saanviaggarwal.dev',
    siteName: `${PROFILE.name} Portfolio`,
    images: [
      {
        url: '/og.jpg',
        width: 1200,
        height: 630,
        alt: `${PROFILE.name} Portfolio Preview`,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${PROFILE.name} — ${PROFILE.role}`,
    description: PROFILE.resumeSummary,
    images: ['/og.jpg'],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${interTight.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} scroll-smooth`}
    >
      <body className="bg-[#f4f2ee] text-[#0d0d0d] font-sans antialiased selection:bg-[#0d0d0d] selection:text-[#f4f2ee] min-h-screen overflow-x-hidden">
        {/* Accessible skip link */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#0d0d0d] focus:text-[#f4f2ee] focus:rounded-full focus:font-mono focus:text-xs"
        >
          Skip to main content
        </a>

        <Cursor />

        <SmoothScrollProvider>
          <Navigation />
          <main id="main-content" className="relative z-10 w-full min-h-screen flex flex-col justify-between">
            <PageTransition>{children}</PageTransition>
          </main>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
