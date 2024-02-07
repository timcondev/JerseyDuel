'use client';

import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { ModeToggle } from './mode-toggle';
import Link from 'next/link';
import { useIsSubscribed } from '@/hooks/useIsSubscribed';
import { UpgradeButton } from '@/components/upgrade-button';

export function Header() {
  const isSubscribed = useIsSubscribed();

  return (
    <div className="h-16 border-b">
      <div className="container flex justify-between items-center ">
        <div>
          <Link href="/">Jersey Duel</Link>
        </div>
        <div className="flex gap-8">
          <SignedIn>
            <Link href="/create" className="link">
              Create
            </Link>
            <Link href="/dashboard" className="link">
              Dashboard
            </Link>
            <Link href="/explore" className="link">
              Explore
            </Link>
          </SignedIn>
          <SignedOut>
            <Link href="/about" className="link">
              About
            </Link>
            <Link href="/pricing" className="link">
              Pricing
            </Link>
          </SignedOut>
        </div>
        <div className="flex gap-4 items-center">
          <SignedIn>
            {!isSubscribed && <UpgradeButton />}
            <UserButton />
          </SignedIn>
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <ModeToggle />
        </div>
      </div>
    </div>
  );
}
