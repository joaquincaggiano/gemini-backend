import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { GeminiService } from './gemini.service';
import type { Response } from 'express';
import { BasicPromptDto } from './dtos/basic-prompt.dto';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('gemini')
export class GeminiController {
  constructor(private readonly geminiService: GeminiService) {}

  @Post('basic-prompt')
  async basicPrompt(@Body() basicPromptDto: BasicPromptDto) {
    const response = await this.geminiService.basicPrompt(basicPromptDto);

    return response;
  }

  @Post('basic-prompt-stream')
  @UseInterceptors(FilesInterceptor('files'))
  async basicPromptStream(
    @Body() basicPromptDto: BasicPromptDto,
    @Res() res: Response,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    basicPromptDto.files = files ?? [];

    const stream = await this.geminiService.basicPromptStream(basicPromptDto);

    res.setHeader('Content-Type', 'text/plain');
    res.status(HttpStatus.OK);

    for await (const chunk of stream) {
      res.write(chunk.text);
    }

    res.end();
  }
}
