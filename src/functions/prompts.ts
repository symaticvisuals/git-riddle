import { PromptTemplate } from "@langchain/core/prompts";

const mostUsedLanguagePromptTemplate = PromptTemplate.fromTemplate(`
As an AI game designer known for crafting enigmatic challenges, create a riddle that hints at '{mostUsedLanguage}', the dominant language. The riddle should cleverly reveal the language's identity without naming it directly, challenging seekers to decode its essence. Keep the riddle of 3-4 lines, and ensure it's both challenging and fun to solve.`);

const latestCreatedRepositoryPromptTemplate = PromptTemplate.fromTemplate(`
  AI game designer known for crafting enigmatic challenges, create a riddle that hints at '{latestCreatedRepo}', the bio. The riddle should cleverly hide that the user has to tell the latest repo name. Keep the riddle of 3-4 lines, and ensure it's both challenging and fun to solve.`);

const whenJoinedGitHubPromptTemplate = PromptTemplate.fromTemplate(`
  AI game designer known for crafting enigmatic challenges, create a riddle that hints at '{whenJoinedGitHub}'. The riddle should cleverly hide that the user has to tell the year when he joined without naming it directly, challenging seekers to decode its essence. Keep the riddle of 3-4 lines, and ensure it's both challenging and fun to solve.`);

const generatePrompt = async (
  mostUsedLangugae: string,
  latestCreatedRepo: string,
  whenJoinedGitHub: string
) => {
  const mostUsedLPrompt = await mostUsedLanguagePromptTemplate.format({
    mostUsedLanguage: mostUsedLangugae,
  });
  const latestCreatedRepoPrompt = await latestCreatedRepositoryPromptTemplate.format({
    latestCreatedRepo: latestCreatedRepo,
  });
  const whenJoinedGitHubPrompt = await whenJoinedGitHubPromptTemplate.format({
    whenJoinedGitHub: whenJoinedGitHub,
  });

  return {
    mostUsedLPrompt,
    latestCreatedRepoPrompt,
    whenJoinedGitHubPrompt,
  };
};

export { generatePrompt };
