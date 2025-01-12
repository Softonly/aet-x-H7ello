"use client";

import React, { useEffect, useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
  Button,
} from "@nextui-org/react";
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  ClerkProvider,
  useAuth,
} from "@clerk/nextjs";
import { init } from "@instantdb/react";

// Initialize InstantDB outside the component to avoid re-initialization on each render
const db = init({ appId: process.env.NEXT_PUBLIC_INSTANTDB_APP_ID || "" });

export const AcmeLogo = () => (
  <svg fill="none" height="36" viewBox="0 0 32 32" width="36">
    <path
      clipRule="evenodd"
      d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
      fill="currentColor"
      fillRule="evenodd"
    />
  </svg>
);

export default function CustomNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
    const signInWithToken = async () => {
      try {
        await signInToInstantWithClerkToken();
      } catch (error) {
        console.error("Error during sign-in with Clerk token:", error);
      }
    };

    signInWithToken();
  }, []);

  const { isLoading, user, error } = db.useAuth();

  const menuItems = user
    ? [
        "Profile",
        "Dashboard",
        "Activity",
        "Analytics",
        "System",
        "Deployments",
        "My Settings",
        "Team Settings",
        "Help & Feedback",
        "Log Out",
      ]
    : ["Help & Feedback", "Log In"];

  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || ""}>
      <Navbar onMenuOpenChange={setIsMenuOpen}>
        <NavbarContent>
          <NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} className="sm:hidden" />
          <NavbarBrand>
            <AcmeLogo />
            <p className="font-bold text-inherit">AetherShop.</p>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          <NavbarItem>
            <Link aria-label="Go to Dashboard" color="foreground" href="/dashboard">
              Dashboard
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link aria-label="Learn About Us" color="foreground" href="/about">
              About Us
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link aria-label="Visit Shop" color="foreground" href="/shopping">
              Shop
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link aria-label="Contact Us" color="foreground" href="/contact">
              Contact
            </Link>
          </NavbarItem>
        </NavbarContent>

        <NavbarContent justify="end">
          <NavbarItem>
            {isLoading ? (
              <div>Loading...</div>
            ) : error ? (
              <div>Error signing in! Please try again.</div>
            ) : user ? (
              <UserButton />
            ) : (
              <SignedOut>
                <SignInButton mode="modal">
                  <Button color="primary" variant="flat">
                    Login
                  </Button>
                </SignInButton>
              </SignedOut>
            )}
          </NavbarItem>
        </NavbarContent>

        <NavbarMenu>
          {menuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link className="w-full" color={index === menuItems.length - 1 ? "danger" : "foreground"} href="#" size="lg">
                {item}
              </Link>
            </NavbarMenuItem>
          ))}
        </NavbarMenu>
      </Navbar>
    </ClerkProvider>
  );
}
