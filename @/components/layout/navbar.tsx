"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  ClerkProvider,
  useAuth,
} from "@clerk/nextjs";
import { init } from "@instantdb/react";

// Initialize InstantDB
const db = init({ appId: process.env.NEXT_PUBLIC_INSTANTDB_APP_ID || "" });

const Navbar = () => {
  const { getToken } = useAuth();

  const signInToInstantWithClerkToken = async () => {
    const idToken = await getToken();
    if (!idToken) return;

    db.auth.signInWithIdToken({
      clientName: process.env.NEXT_PUBLIC_APP_NAME_SECRET || "",
      idToken: idToken,
    });
  };

  useEffect(() => {
    signInToInstantWithClerkToken();
  }, []);

  const { isLoading, user, error } = db.useAuth();

  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || ""}
    >
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900 text-white shadow-lg py-4 px-6 flex items-center justify-between">
        {/* Logo or brand name */}
        <div className="text-xl font-bold tracking-wide">
          <Link href="/">AetherShop.</Link>
        </div>

        {/* Navigation links */}
        <div className="hidden lg:flex space-x-6">
          <Link
            href="/"
            className="hover:bg-gray-700 px-4 py-2 rounded transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/about"
            className="hover:bg-gray-700 px-4 py-2 rounded transition-colors"
          >
            About Us
          </Link>
          <Link
            href="/shopping"
            className="hover:bg-gray-700 px-4 py-2 rounded transition-colors"
          >
            Shop
          </Link>
          <Link
            href="/contact"
            className="hover:bg-gray-700 px-4 py-2 rounded transition-colors"
          >
            Contact
          </Link>
        </div>

        {/* Authentication */}
        <div className="flex items-center space-x-4">
          {isLoading ? (
            <div>Loading...</div>
          ) : error ? (
            <div>Error signing in! {error.message}</div>
          ) : user ? (
            <UserButton />
          ) : (
            <SignedOut>
              <SignInButton mode="modal">
                <button className="text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded transition-colors">
                  Login
                </button>
              </SignInButton>
            </SignedOut>
          )}
        </div>
      </nav>
    </ClerkProvider>
  );
};

export default Navbar;
