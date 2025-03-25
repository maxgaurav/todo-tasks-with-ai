import { Global, Module } from '@nestjs/common';
import { TaskRepoService } from './repos/task-repo.service';

@Global()
@Module({
  providers: [TaskRepoService],
  exports: [TaskRepoService],
})
export class RepositoriesModule {}
