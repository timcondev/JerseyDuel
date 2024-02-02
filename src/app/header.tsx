'use client';

import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { ModeToggle } from './mode-toggle';
import Link from 'next/link';

export function Header() {
  return (
    <div className="h-16 border-b">
      <div className="container flex justify-between items-center ">
        <div>
          <Link href="/">JerseyRater</Link>
        </div>
        <div className="flex gap-8">
          <SignedIn>
            <Link href="/create" className="link">
              Create
            </Link>
            <Link href="/dashboard" className="link">
              Dashboard
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
