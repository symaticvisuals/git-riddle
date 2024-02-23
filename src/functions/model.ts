import { OpenAI } from "@langchain/openai";
import { generatePrompt } from "./prompts";

const llm = new OpenAI({
  openAIApiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  maxTokens: 150,
});

export const generateQuizQuestion = async (
  username: string,
  mostUsedLangugae: string
) => {
  const prompt = await generatePrompt( mostUsedLangugae);
  const question = await llm.invoke(prompt);
  return question;
};
