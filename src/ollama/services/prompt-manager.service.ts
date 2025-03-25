import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, tap } from 'rxjs';
import { AxiosError } from 'axios';

interface EmbeddingResponse {
  embeddings: number[][];
  model: string;
  total_duration: number;
  load_duration: number;
  prompt_eval_count: number;
}

@Injectable()
export class PromptManagerService {
  constructor(protected http: HttpService) {}

  public async getEmbeddings(content: string): Promise<number[]> {
    return (
      await firstValueFrom(
        this.http
          .post<EmbeddingResponse>(
            'http://localhost:11434/api/embed', // @Todo handle url from environment
            {
              model: 'nomic-embed-text',
              input: content,
              keep_alive: '60m',
            },
          )
          .pipe(
            tap({
              error: (err: AxiosError) => {
                console.error(err.response);
              },
            }),
          ),
      )
    ).data.embeddings[0];
  }
}
