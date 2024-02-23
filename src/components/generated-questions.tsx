"use client"

import { useGithubStats } from "@/hooks/fetch-github-data";
import { useAuth, useSession } from "@clerk/nextjs";
import React from "react";

 function GeneratedQuestions({
  user,
  token,
}: {
  user: string;
  token: any;
}) {
  

  const { data } = useGithubStats(user, token);

  return <div></div>;
}

export default GeneratedQuestions;
