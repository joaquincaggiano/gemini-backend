import { GoogleGenAI } from '@google/genai';
import { BasicPromptDto } from '../dtos/basic-prompt.dto';

interface Options {
  model?: string;
  systemInstruction?: string;
}

export const basicPromptUseCase = async (
  ai: GoogleGenAI,
  basicPromptDto: BasicPromptDto,
  options?: Options,
) => {
  const { prompt } = basicPromptDto;
  const {
    model = 'gemini-2.5-flash',
    systemInstruction = 'Responde únicamente en español, en formato markdown',
  } = options ?? {};

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      systemInstruction,
    },
  });
  return response.text;
};
