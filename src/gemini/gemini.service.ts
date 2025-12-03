import { Injectable } from '@nestjs/common';
import { BasicPromptDto } from './dtos/basic-prompt.dto';

@Injectable()
export class GeminiService {
  basicPrompt(basicPromptDto: BasicPromptDto) {
    return basicPromptDto;
  }
}
