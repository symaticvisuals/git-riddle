import { PromptTemplate } from "@langchain/core/prompts";

const quizQuestionTemplate = PromptTemplate.fromTemplate(`
As an AI game designer known for crafting enigmatic challenges, create a riddle that hints at '{mostUsedLanguage}', the dominant language. The riddle should cleverly reveal the language's identity without naming it directly, challenging seekers to decode its essence. Keep the riddle of 3-4 lines, and ensure it's both challenging and fun to solve.`);

const generatePrompt = async (mostUsedLangugae: string) => {
  const formattedPrompt = quizQuestionTemplate.format({
    mostUsedLanguage: mostUsedLangugae,
  });

  return formattedPrompt;
};

export { generatePrompt };
