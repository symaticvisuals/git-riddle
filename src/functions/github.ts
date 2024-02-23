import { Octokit } from "@octokit/rest";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";

async function fetchGitHubDetails(
  username: string,
  authToken: string
): Promise<any> {
  const response = await fetch("/api/github-details", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      authToken,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch GitHub details");
  }

  const data = await response.json();
  return data;
}

// Helper functions for GitHub data fetching
async function fetchUserDetails(octokit: Octokit, username: string) {
  const { data: userDetails } = await octokit.users.getByUsername({
    username,
  });

  const repositoriesCount = userDetails.public_repos;

  // Clue 2: Location and Company
  const company = userDetails.company;

  // Clue 3: Bio and Skills
  const bio = userDetails.bio;

  // Clue 4: Twitter Username
  const twitterUsername = userDetails.twitter_username;

  // Clue 5: Disk Usage
  const diskUsage = userDetails.disk_usage;

  return {
    repositoriesCount,
    company,
    bio,
    twitterUsername,
    diskUsage,
  };
}

async function fetchRepositories(octokit: Octokit, username: string) {
  const { data: repositories } = await octokit.repos.listForUser({
    username,
  });
  return repositories;
}

async function fetchCommitsForRepo(
  octokit: Octokit,
  username: string,
  repoName: string
) {
  const { data: commits } = await octokit.repos.listCommits({
    owner: username,
    repo: repoName,
  });
  return commits;
}

async function calculateMostUsedLanguage(repositories: any) {
  const languageCounts = repositories.reduce((acc: any, repo: any) => {
    const { language } = repo;
    if (!language) return acc;
    if (!acc[language]) acc[language] = 0;
    acc[language]++;
    return acc;
  }, {});

  return Object.keys(languageCounts).reduce(
    (a, b) => (languageCounts[a] > languageCounts[b] ? a : b),
    ""
  );
}

async function fetchStarredRepositoriesWithMaxStarsOrForks(
  octokit: Octokit,
  username: string,
  metric: "stars" | "forks"
) {
  const { data: starredRepos } = await octokit.activity.listReposStarredByUser({
    username,
  });

  // Find the maximum value for the metric
  const maxMetricValue = Math.max(
    ...starredRepos.map((repo: any) => repo[metric])
  );

  // Filter repositories with the maximum value for the metric
  const maxRepos = starredRepos
    .filter((repo: any) => repo[metric] === maxMetricValue)
    .map((repo: any) => ({ name: repo.name, [metric]: repo[metric] }));

  return JSON.stringify(maxRepos);
}

async function calculateTotalStarsReceived(repositories: any) {
  return repositories.reduce(
    (acc: number, repo: any) => acc + repo.stargazers_count,
    0
  );
}

async function findMostActiveRepository(
  repositories: any[],
  octokit: Octokit,
  username: string
) {
  let maxCommits = 0;
  let mostActiveRepo = "";

  for (const repo of repositories) {
    const commits = await fetchCommitsForRepo(octokit, username, repo.name);
    if (commits.length > maxCommits) {
      maxCommits = commits.length;
      mostActiveRepo = repo.name;
    }
  }

  return mostActiveRepo;
}

async function fetchIssuesCreatedByUser(octokit: Octokit, username: string) {
  const { data: issues } = await octokit.issues.listForAuthenticatedUser({
    creator: username,
  });
  return issues;
}

async function calculateContributionStreak(commits: any[]) {
  if (commits.length === 0) {
    return 0; // No commits, so no streak.
  }

  // Assuming each commit has a 'commit' object with a 'committer' object containing a 'date' string
  const dates = commits.map((commit) =>
    new Date(commit.commit.committer.date).setHours(0, 0, 0, 0)
  );

  // Sort dates in ascending order
  dates.sort((a, b) => a - b);

  let longestStreak = 1;
  let currentStreak = 1;
  let previousDate = dates[0];

  for (let i = 1; i < dates.length; i++) {
    const currentDate = dates[i];
    const differenceInDays = (currentDate - previousDate) / (1000 * 3600 * 24);

    if (differenceInDays === 1) {
      // Consecutive day
      currentStreak += 1;
    } else if (differenceInDays > 1) {
      // Gap in contribution, reset current streak
      longestStreak = Math.max(longestStreak, currentStreak);
      currentStreak = 1;
    }
    // If differenceInDays is 0, it means multiple commits in the same day, so ignore.

    previousDate = currentDate;
  }

  // Check last streak
  longestStreak = Math.max(longestStreak, currentStreak);

  return longestStreak;
}

// create a function to fetch the latest created repository
async function fetchLatestCreatedRepository(octokit: Octokit, username: string) {
  const { data: repositories } = await octokit.repos.listForUser({
    username,
    sort: "created",
    direction: "desc",
  });

  
  // return the name of the latest created repository
  return repositories[0].name;
}

// create a function that fetches the year the user joined GitHub
async function fetchUserJoinDate(octokit: Octokit, username: string) {
  const { data: user } = await octokit.users.getByUsername({
    username,
  });

  return user.created_at;
}

async function fetchUserSummary(octokit: Octokit, username: string) {
  const userDetails = await fetchUserDetails(octokit, username);
  const repositories = await fetchRepositories(octokit, username);
  const mostUsedLanguage = await calculateMostUsedLanguage(repositories);
  const maxStarredRepo = await fetchStarredRepositoriesWithMaxStarsOrForks(
    octokit,
    username,
    "stars"
  );
  const maxForksRepo = await fetchStarredRepositoriesWithMaxStarsOrForks(
    octokit,
    username,
    "forks"
  );
  const totalStarsReceived = await calculateTotalStarsReceived(repositories);
  const mostActiveRepo = await findMostActiveRepository(
    repositories,
    octokit,
    username
  );
  const issuesCreatedByUser = await fetchIssuesCreatedByUser(octokit, username);
  const contributionStreak = await calculateContributionStreak(
    await fetchCommitsForRepo(octokit, username, mostActiveRepo)
  );

  return {
    ...userDetails,
    mostUsedLanguage,
    maxStarredRepo,
    totalStarsReceived,

    maxForksRepo,
    issuesCreatedByUser,
    contributionStreak,
  };
}

export {
  fetchGitHubDetails,
  fetchUserDetails,
  fetchRepositories,
  fetchCommitsForRepo,
  calculateMostUsedLanguage,
  fetchStarredRepositoriesWithMaxStarsOrForks,
  calculateTotalStarsReceived,
  findMostActiveRepository,
  fetchIssuesCreatedByUser,
  calculateContributionStreak,
  fetchUserSummary,
  fetchLatestCreatedRepository,
  fetchUserJoinDate,
};
