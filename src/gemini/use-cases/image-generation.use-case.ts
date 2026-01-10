import {
  ContentListUnion,
  createPartFromUri,
  GoogleGenAI,
  Modality,
} from '@google/genai';
import { geminiUploadFiles } from '../helpers/gemini-upload-files';
import { ImageGenerationDto } from '../dtos/image-generation.dto';
import { v4 as uuidv4 } from 'uuid';

interface Options {
  model?: string;
  systemInstruction?: string;
}

export interface ImageGenerationResponse {
  imageUrl: string;
  text: string;
}

export const imageGenerationUseCase = async (
  ai: GoogleGenAI,
  imageGenerationDto: ImageGenerationDto,
  options?: Options,
): Promise<ImageGenerationResponse> => {
  const { prompt, files = [] } = imageGenerationDto;

  const contents: ContentListUnion = [
    {
      text: prompt,
    },
  ];

  const uploadedFiles = await geminiUploadFiles(ai, files);

  uploadedFiles.forEach((file) => {
    contents.push(createPartFromUri(file.uri ?? '', file.mimeType ?? ''));
  });

  const { model = 'gemini-2.5-flash-image' } = options ?? {};

  const response = await ai.models.generateContent({
    model,
    contents,
    config: {
      responseModalities: [Modality.IMAGE, Modality.TEXT],
    },
  });

  let imageUrl = '';
  let text = '';
  const imageId = uuidv4();

  for (const part of response.candidates?.[0]?.content?.parts ?? []) {
    if (part.text) {
      text = part.text;
      continue;
    }

    if (!part.inlineData) {
      continue;
    }

    const imageData = part.inlineData.data!;
    const buffer = Buffer.from(imageData, 'base64');
  }

  return {
    imageUrl: '',
    text: '',
  };
};
