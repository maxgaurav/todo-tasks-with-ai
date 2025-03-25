import { Injectable } from '@nestjs/common';
import { UserModel } from '../../databases/models/user.model';
import { TaskModel } from '../../databases/models/task.model';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { TaskEmbeddingModel } from '../../databases/models/task-embedding.model';
import { PromptManagerService } from '../../ollama/services/prompt-manager.service';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

function normalizeVector(vector: number[]): number[] {
  const norm = Math.sqrt(vector.reduce((sum, val) => sum + val ** 2, 0));
  return norm > 0 ? vector.map((val) => val / norm) : vector;
}

@Injectable()
export class TaskRepoService {
  constructor(
    @InjectModel(TaskModel) public taskModel: typeof TaskModel,
    @InjectModel(TaskEmbeddingModel)
    public readonly taskEmbeddingModel: typeof TaskEmbeddingModel,
    protected readonly promptManagerService: PromptManagerService,
    @InjectConnection() protected connection: Sequelize,
  ) {}

  public listForUser(user: UserModel): Promise<TaskModel[]> {
    return this.taskModel.findAll({ where: { user_id: user.id } });
  }

  public async createTask(
    user: UserModel,
    data: Pick<TaskModel, 'due_on' | 'completed_on' | 'title' | 'content'>,
  ): Promise<TaskModel> {
    const task = await this.taskModel
      .build()
      .set(data)
      .set({ user_id: user.id })
      .save();

    const embeddings = normalizeVector(
      await this.promptManagerService.getEmbeddings(
        `search_document: ${task.title} ${task.content}`,
      ),
    );

    // creating embeddings
    await this.taskEmbeddingModel
      .build()
      .set({
        task_id: task.id,
        embeddings: embeddings,
      })
      .save();

    return task;
  }

  public async filterByEmbedding(
    user: UserModel,
    prompt: string,
  ): Promise<TaskModel[]> {
    const promptEmbeddings = normalizeVector(
      await this.promptManagerService.getEmbeddings(`search_query: ${prompt}`),
    );

    const taskIds = await this.taskEmbeddingModel.findAll({
      attributes: [
        'task_id',
        [
          Sequelize.literal(
            `1 - ("TaskEmbeddingModel"."embeddings" <=> '[${promptEmbeddings.join(
              ',',
            )}]')`,
          ),
          'cosineValueMinus1',
        ],
      ],
      where: {
        [Op.and]: [
          Sequelize.literal(
            `(1 - ("TaskEmbeddingModel"."embeddings" <=> '[${promptEmbeddings.join(
              ',',
            )}]')) > 0.75`,
          ),
        ],
      },
    });

    return this.taskModel.findAll({
      where: {
        id: taskIds.map((result) => result.task_id),
        user_id: user.id,
      },
    });
  }
}
