import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AccessTokenGuard } from '../../auth/guards/access-token/access-token.guard';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiHeader,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { TaskModel } from '../../databases/models/task.model';
import { TaskResource } from '../../resources/task.resource';
import { ResourceMap } from '../../common/decorators/resource-map.decorator';
import { ResourceConversionInterceptor } from '../../common/interceptors/resource-conversion/resource-conversion.interceptor';
import { TaskRepoService } from '../../repositories/repos/task-repo.service';
import { AuthUser } from '../../auth/decorators/auth-user.decorator';
import { UserModel } from '../../databases/models/user.model';
import { CreateTaskDto } from '../dtos/create-task.dto';

@ApiHeader({
  name: 'Accept',
  allowEmptyValue: false,
  required: true,
  schema: {
    type: 'string',
    enum: ['application/json'],
  },
})
@ApiBearerAuth()
@UseGuards(AccessTokenGuard)
@ApiTags('Task Management')
@ResourceMap(TaskResource)
@UseInterceptors(ResourceConversionInterceptor)
@Controller({ version: '1', path: 'tasks' })
export class TasksController {
  constructor(protected readonly taskRepo: TaskRepoService) {}

  @ApiOkResponse({ type: TaskResource })
  @Get()
  public index(@AuthUser() user: UserModel): Promise<TaskModel[]> {
    return this.taskRepo.listForUser(user);
  }

  @ApiCreatedResponse({ type: TaskResource })
  @Post()
  public store(
    @AuthUser() user: UserModel,
    @Body() createTaskDto: CreateTaskDto,
  ): Promise<TaskModel> {
    return this.taskRepo.createTask(user, createTaskDto);
  }

  @ApiOkResponse({ type: TaskResource })
  @Get('filter')
  @ApiQuery({
    type: String,
    name: 'filter',
    required: true,
  })
  public async indexQuery(
    @AuthUser() user: UserModel,
    @Query('filter') prompt: string | undefined,
  ): Promise<TaskModel[]> {
    if (!prompt) {
      return [];
    }
    return this.taskRepo.filterByEmbedding(user, prompt);
  }
}
