import type { Metadata } from 'next';
import localFont from 'next/font/local';

import './globals.css';

import { WalletProvider } from '@/context/WalletProvider';

const kongtext = localFont({
  src: './../../public/kongtext.ttf',
  variable: '--font-kongtext',
});

export const metadata: Metadata = {
  title: 'Aptogotchi',
  description: 'Your new favorite on-chain pet',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <head>
        <link
          href='https://unpkg.com/nes.css@2.3.0/css/nes.min.css'
          rel='stylesheet'
        />
      </head>
      <body className={kongtext.className}>
        <WalletProvider>{children}</WalletProvider>
      </body>
    </html>
  );
}
