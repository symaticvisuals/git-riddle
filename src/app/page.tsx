"use client";
import GeneratedQuestions from "@/components/generated-questions";
import { UserButton, useAuth, useSession, useUser } from "@clerk/nextjs";
import { Suspense, useEffect, useState } from "react";

export default function Home() {
  const { session } = useSession();
  const { getToken } = useAuth();
  const [token , setToken] = useState<string|null>(null);

 useEffect(() => {
    const fetchToken = async () => {
      const authToken = await getToken();
      setToken(authToken);
    };
    fetchToken();
  } , [getToken]);

 
  return (
    <div className="">
      <Suspense fallback={<div>Loading...</div>}>
        {session && session?.user.username && (
          <GeneratedQuestions user={session?.user.username} token={token} />
        )}
      </Suspense>
    </div>
  );
}
