import { Octokit } from "@octokit/rest";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import clerk from "@clerk/clerk-sdk-node";
import {
  
  calculateMostUsedLanguage,
  fetchRepositories,
  fetchUserDetails,
} from "@/functions/github";
import { generateQuizQuestion } from "@/functions/model";


export async function POST(req: NextRequest) {
  try {
    const { userId } = auth(); // Authenticate the user
    const body = await req.json();
    const [OauthAccessToken] = await clerk.users.getUserOauthAccessToken(
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
    const userDetails = await fetchUserDetails(octokit, username);
    const repositories = await fetchRepositories(octokit, username);
    const mostUsedLanguage = await calculateMostUsedLanguage(repositories);

    const quizQuestion = await generateQuizQuestion(username, mostUsedLanguage);

    // Generate a quiz question based on GitHub data
  

    // Respond with the quiz question and fetched GitHub data
    return NextResponse.json({  quizQuestion, mostUsedLanguage });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
  }
}
