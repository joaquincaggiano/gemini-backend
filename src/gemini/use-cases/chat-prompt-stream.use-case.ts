import { createPartFromUri, GoogleGenAI } from '@google/genai';
import { ChatPromptDto } from '../dtos/chat-prompt.dto';

interface Options {
  model?: string;
  systemInstruction?: string;
}

export const chatPromptStreamUseCase = async (
  ai: GoogleGenAI,
  chatPromptDto: ChatPromptDto,
  options?: Options,
) => {
  const { prompt, files = [] } = chatPromptDto;

  const uploadedFiles = await Promise.all(
    files.map((file) => {
      return ai.files.upload({
        file: new Blob([new Uint8Array(file.buffer)], {
          type: file.mimetype.includes('image') ? file.mimetype : 'image/jpg',
        }),
      });
    }),
  );

  const {
    model = 'gemini-2.5-flash',
    systemInstruction = 'Responde únicamente en español, en formato markdown, Usa el sistema métrico decimal',
  } = options ?? {};

  const chat = ai.chats.create({
    model,
    config: {
      systemInstruction,
    },
    history: [
      {
        role: 'user',
        parts: [{ text: 'Hello' }],
      },
      {
        role: 'model',
        parts: [{ text: 'Great to meet you. What would you like to know?' }],
      },
    ],
  });

  return chat.sendMessageStream({
    message: [
      prompt,
      ...uploadedFiles.map((file) =>
        createPartFromUri(file.uri ?? '', file.mimeType ?? ''),
      ),
    ],
  });
};
