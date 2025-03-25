import { Global, Module } from '@nestjs/common';
import { PromptManagerService } from './services/prompt-manager.service';

@Global()
@Module({
  providers: [PromptManagerService],
  exports: [PromptManagerService],
})
export class OllamaModule {}
