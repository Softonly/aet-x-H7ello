"use client";
import React, { useState } from "react";
import { AppShell, Button, Text, Divider, Container, Flex, Stack } from "@mantine/core";
import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

const CustomNavbar = () => {
  const [opened, setOpened] = useState(false);

  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || ""}>
      <AppShell
        padding="md"
        header={{ height: 60 }}
        navbar={{ 
          width: 300,
          breakpoint: 'sm',
          collapsed: { desktop: !opened }
        }}
      >
        <AppShell.Header>
          <Container>
            <Flex justify="space-between" align="center" py="xs">
              <Button variant="subtle" onClick={() => setOpened(!opened)}>
                {opened ? 'Close' : 'Open'} Menu
              </Button>
              <Text fw={700}>AetherShop</Text>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <SignedIn>
                  <UserButton />
                </SignedIn>
                <SignedOut>
                  <SignInButton mode="modal">
                    <Button color="blue">Login</Button>
                  </SignInButton>
                </SignedOut>
              </div>
            </Flex>
          </Container>
        </AppShell.Header>

        <AppShell.Navbar p="md">
          <Stack gap="sm">
            <Button variant="light" fullWidth>
              Dashboard
            </Button>
            <Button variant="light" fullWidth>
              About Us
            </Button>
            <Button variant="light" fullWidth>
              Shop
            </Button>
            <Button variant="light" fullWidth>
              Contact
            </Button>
          </Stack>
          <Divider my="sm" />
          <Text size="xs" c="dimmed" ta="center">
            © 2025 AetherShop
          </Text>
        </AppShell.Navbar>

        <AppShell.Main>
          <Text ta="center" mt="xl">
            Welcome to AetherShop!
          </Text>
        </AppShell.Main>
      </AppShell>
    </ClerkProvider>
  );
};

export default CustomNavbar;