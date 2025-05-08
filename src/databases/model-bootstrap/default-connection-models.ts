import { UserModel } from '../models/user.model';
import { AccessTokenModel } from '../models/oauth/access-token.model';
import { RefreshTokenModel } from '../models/oauth/refresh-token.model';
import { ClientModel } from '../models/oauth/client.model';
import { AuthorizationChallengeModel } from '../models/oauth/authorization-challenge.model';
import { TaskModel } from '../models/task.model';
import { TaskEmbeddingModel } from '../models/task-embedding.model';
import { TaskCategoryEmbeddingModel } from '../models/task-category-embedding.model';

export const DefaultConnectionModels = [
  UserModel,
  ClientModel,
  AccessTokenModel,
  RefreshTokenModel,
  AuthorizationChallengeModel,
  TaskModel,
  TaskEmbeddingModel,
  TaskCategoryEmbeddingModel,
];
