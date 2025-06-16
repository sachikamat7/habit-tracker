"use client"

import { Button } from '@/components/ui/button';
import signUpForm from './(auth)/signup/page';
import Link from 'next/link';
import { signOut } from '@/auth';
import { SignOut } from '@/components/signout-button';

export default function Home() {
  return (
      <div className="bg-muted/40 ">
        <h1 className="text-2xl font-bold">Habit Tracker</h1>
        <Link href="/signup" className="text-lg hover:underline">
          Sign Up
        </Link>
        <SignOut />
        </div>
  );
}
