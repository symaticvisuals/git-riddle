// app/providers.tsx
"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { neobrutalism } from "@clerk/themes";
import { NextUIProvider } from "@nextui-org/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <NextUIProvider>
        <ClerkProvider appearance={{ baseTheme: neobrutalism }}>
          {children}
        </ClerkProvider>
      </NextUIProvider>
    </QueryClientProvider>
  );
}
