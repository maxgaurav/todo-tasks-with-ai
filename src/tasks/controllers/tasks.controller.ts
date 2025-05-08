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
import {
  normalizeVector,
  TaskRepoService,
} from '../../repositories/repos/task-repo.service';
import { AuthUser } from '../../auth/decorators/auth-user.decorator';
import { UserModel } from '../../databases/models/user.model';
import { CreateTaskDto } from '../dtos/create-task.dto';
import { InjectModel } from '@nestjs/sequelize';
import { TaskCategoryEmbeddingModel } from '../../databases/models/task-category-embedding.model';
import { StoreCategoryEmbeddingDto } from '../dtos/store-category-embedding.dto';
import { PromptManagerService } from '../../ollama/services/prompt-manager.service';
import { Sequelize } from 'sequelize-typescript';

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
@UseInterceptors(ResourceConversionInterceptor)
@Controller({ version: '1', path: 'tasks' })
export class TasksController {
  constructor(
    protected readonly taskRepo: TaskRepoService,
    @InjectModel(TaskCategoryEmbeddingModel)
    public taskCategoryModel: typeof TaskCategoryEmbeddingModel,
    public promptService: PromptManagerService,
  ) {}

  @ResourceMap(TaskResource)
  @ApiOkResponse({ type: TaskResource })
  @Get()
  public index(@AuthUser() user: UserModel): Promise<TaskModel[]> {
    return this.taskRepo.listForUser(user);
  }

  @ResourceMap(TaskResource)
  @ApiCreatedResponse({ type: TaskResource })
  @Post()
  public store(
    @AuthUser() user: UserModel,
    @Body() createTaskDto: CreateTaskDto,
  ): Promise<TaskModel> {
    return this.taskRepo.createTask(user, createTaskDto);
  }

  @ResourceMap(TaskResource)
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

  @ApiOkResponse({ type: TaskResource })
  @Post('categories')
  public async storeCategoryEmbedding(@Body() body: StoreCategoryEmbeddingDto) {
    const embedding = normalizeVector(
      await this.promptService.getEmbeddings(
        `search_document: ${body.statement}`,
      ),
    );

    return this.taskCategoryModel
      .build()
      .set({
        category: body.category,
        statement: body.statement,
        embeddings: embedding,
      })
      .save();
  }

  @ApiOkResponse({ type: TaskResource })
  @ApiQuery({
    type: String,
    name: 'filter',
    required: true,
  })
  @Get('categories')
  public async getCategory(@Query('filter') filter: string) {
    const embedding = normalizeVector(
      await this.promptService.getEmbeddings(`search_query: ${filter}`),
    );

    console.log(
      (
        await this.taskCategoryModel.findOne({
          attributes: [
            'category',
            [
              Sequelize.literal(
                `1 - ("TaskCategoryEmbeddingModel"."embeddings" <=> '[${embedding.join(
                  ',',
                )}]')`,
              ),
              'cosineValueMinus1',
            ],
          ],
          order: [['cosineValueMinus1', 'desc']],
        })
      ).toJSON(),
    );
  }
}
