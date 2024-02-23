import { OpenAI } from "@langchain/openai";
import { generatePrompt } from "./prompts";

const llm = new OpenAI({
  openAIApiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  temperature: 0.4,
  maxTokens: 150,
});

export const generateQuizQuestion = async (
  mostUsedLangugae: string,
  latestCreatedRepo: string,
  whenJoinedGitHub: string
) => {
  const prompt = await generatePrompt(
    mostUsedLangugae,
    latestCreatedRepo,
    whenJoinedGitHub
   );
   
  
  const question1 = await llm.invoke(prompt.mostUsedLPrompt);
  const question2 = await llm.invoke(prompt.latestCreatedRepoPrompt);
  const question3 = await llm.invoke(prompt.whenJoinedGitHubPrompt);
  return [
    {
      question: question1,
      answer: mostUsedLangugae,
    },
    {
      question: question2,
      answer: latestCreatedRepo,
    },
    {
      question: question3,
      answer:  new Date(whenJoinedGitHub).getFullYear().toString(),
    }
  ];
}
