import {
  createPartFromUri,
  createUserContent,
  GoogleGenAI,
} from '@google/genai';
import { BasicPromptDto } from '../dtos/basic-prompt.dto';
import { geminiUploadFiles } from '../helpers/gemini-upload-files';

interface Options {
  model?: string;
  systemInstruction?: string;
}

export const basicPromptStreamUseCase = async (
  ai: GoogleGenAI,
  basicPromptDto: BasicPromptDto,
  options?: Options,
) => {
  const { prompt, files = [] } = basicPromptDto;

  const uploadedFiles = await geminiUploadFiles(ai, files);

  const {
    model = 'gemini-2.5-flash',
    systemInstruction = 'Responde únicamente en español, en formato markdown',
  } = options ?? {};

  const response = await ai.models.generateContentStream({
    model,
    // contents: prompt,
    contents: [
      createUserContent([
        prompt,
        ...uploadedFiles.map((image) =>
          createPartFromUri(image.uri ?? '', image.mimeType ?? ''),
        ),
      ]),
    ],
    config: {
      systemInstruction,
    },
  });
  return response;
};
