"use client";


import { fetchGitHubDetails } from "@/functions/github";
import { useQuery } from "@tanstack/react-query";

export const useGithubStats = (username: string, authToken: string) => {
  return useQuery({
    queryKey: ["logs", username, authToken],
    queryFn: () => fetchGitHubDetails(
        username,
        authToken
    ),
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    retry: true,
    enabled: !!username && !!authToken,
  });
};
