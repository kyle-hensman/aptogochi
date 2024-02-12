'use client';

import dynamic from 'next/dynamic';
import { PropsWithChildren, SetStateAction, useState } from 'react';

import { Leaderboard } from './Leaderboard';
import Link from 'next/link';

const FixedSizeWrapper = ({ children }: PropsWithChildren) => {
  const fixedStyle = {
    width: '1200px',
    height: '800px',
    border: '6px solid',
    margin: 'auto',
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <div style={fixedStyle}>{children}</div>
    </div>
  );
};

export default function Page() {
  return (
    <main className='flex flex-col'>
      <FixedSizeWrapper>
        <Header />
        <Leaderboard />
      </FixedSizeWrapper>
    </main>
  );
}

function Header() {
  return (
    <div className='sticky top-0 z-10 flex justify-between items-center px-6 py-4 bg-gradient-to-r from-orange-300 via-orange-400 to-red-400 shadow-md w-full gap-2'>
      <h1 className='text-2xl'>Aptogotchi</h1>
      <div className='flex justify-between items-center gap-6'>
        <Link href={'/'} className='nes-btn'>
          Go Back Home
        </Link>
        <ConnectToWallet />
      </div>
    </div>
  );
}

const ConnectToWallet = dynamic(
  async () => {
    const { ConnectWallet } = await import('@/components/ConnectWallet');
    return { default: ConnectWallet };
  },
  {
    loading: () => {
      return (
        <div className='nes-btn is-primary opacity-50 cursor-not-allowed'>
          loading...
        </div>
      );
    },
    ssr: false,
  }
);
