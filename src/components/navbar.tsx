"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./mode-toggle";

export default function Navbar() {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Apply disabled effect when mobile menu is open
  useEffect(() => {
    const mainContent = document.getElementById('main-content');
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      mainContent?.classList.add('opacity-60', 'backdrop-blur-[1px]');
      mainContent?.classList.add('pointer-events-none');
    } else {
      document.body.style.overflow = '';
      mainContent?.classList.remove('opacity-60', 'backdrop-blur-[1px]');
      mainContent?.classList.remove('pointer-events-none');
    }
    
    return () => {
      document.body.style.overflow = '';
      mainContent?.classList.remove('opacity-60', 'backdrop-blur-[1px]');
      mainContent?.classList.remove('pointer-events-none');
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95">
        <div className="flex h-16 items-center justify-between px-10 w-full">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">Habit Tracker</span>
          </Link>
          <div className="hidden md:flex items-center space-x-4">
            <ModeToggle />
            {session ? (
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    await signOut({ callbackUrl: "/signin" });
                  }}
                  className="h-8 cursor-pointer"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <Link href="/signin">
                <Button variant="outline" size="sm" className="h-8 cursor-pointer">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
          <div className="flex items-center md:hidden">
            <ModeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden "
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
          </div>
        </div>
      </nav>

      {/* Mobile menu with backdrop */}
      <div className="md:hidden">
        {/* Semi-transparent backdrop */}
        {mobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/20 z-40 transition-opacity duration-300"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Mobile menu */}
        <div
          className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-background border-r z-50 overflow-y-auto transition-transform duration-300 ease-in-out ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex flex-col divide-y">
  <div className="px-4 py-3">
    <Link
      href="/features"
      className="font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
      onClick={() => setMobileMenuOpen(false)}
    >
      Features
    </Link>
  </div>

  <div className="px-4 py-3">
    {session ? (
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          signOut();
          setMobileMenuOpen(false);
        }}
        className="h-8 w-full"
      >
        Sign Out
      </Button>
    ) : (
      <Link 
        href="/signin"  
        onClick={() => setMobileMenuOpen(false)} 
        className="font-medium hover:bg-accent hover:text-accent-foreground transition-colors block"
      >
        Sign In
      </Link>
    )}
  </div>
</div>
        </div>
      </div>
    </>
  );
}