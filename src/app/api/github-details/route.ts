import { Octokit } from "@octokit/rest";
import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs";

import {
  calculateMostUsedLanguage,
  fetchLatestCreatedRepository,
  fetchRepositories,
  fetchUserDetails,
  fetchUserJoinDate,
  fetchUserSummary,
} from "@/functions/github";
import { generateQuizQuestion } from "@/functions/model";
import { generatePrompt } from "@/functions/prompts";

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth(); // Authenticate the user
    const body = await req.json();
    const [OauthAccessToken] = await clerkClient.users.getUserOauthAccessToken(
      userId || "",
      "oauth_github"
    );
    const { token } = OauthAccessToken || {};

    if (!token)
      return new NextResponse("Unauthorized - No Token", { status: 401 });

    const octokit = new Octokit({ auth: token });
    const username = body.username;
    if (!username) throw new Error("GitHub username is required");

    // Fetch GitHub data
    const repositories = await fetchRepositories(octokit, username);
    const userJoinedGitHub = await fetchUserJoinDate(octokit, username);
    const mostUsedLanguage = await calculateMostUsedLanguage(repositories);
    const latestRepo = await fetchLatestCreatedRepository(octokit, username);

    const response = await generateQuizQuestion(
      mostUsedLanguage,
      latestRepo,
      userJoinedGitHub
    );

    // Generate a quiz question based on GitHub data

    // Respond with the quiz question and fetched GitHub data
    return NextResponse.json([
      {
          "question": "\n\nI am the code that makes the web come alive,\nWith syntax and functions, I thrive.\nMy name is a nod to a coffee's brew,\nBut don't be fooled, I'm more than just a few.\n\nI'm the language that powers the internet,\nWith my versatility, there's no limit.\nFrom animations to forms, I can do it all,\nBut without me, the web would surely fall.\n\nI may seem simple, but I hold great power,\nIn the hands of a skilled programmer, I can tower.\nSo if you want to create a site that's supreme,\nYou'll need to unravel my enigmatic theme.",
          "answer": "JavaScript"
      },
      {
          "question": "\n\nIn code and commits, I am hidden,\nBut my purpose can't be forbidden.\nMy name is a mystery, yet so clear,\nFor the latest repo, you must peer.",
          "answer": "git-riddle"
      },
      {
          "question": "\n\nI am a moment in time, a fraction of a second,\nBut my significance is great, my mystery beckons.\nFor those who seek to unravel my code,\nThe year of your joining, you must decode.",
          "answer": "2020"
      }
  ]);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
  }
}
