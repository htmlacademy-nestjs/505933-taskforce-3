import { Injectable, NotFoundException } from '@nestjs/common';
import { Timezone } from '@project/services';
import { Comment } from '@project/contracts';
import { CommentEntity } from './entity';
import { Repository } from './service';
import { CreateCommentDto } from './dto';
import { EXCEPTION } from '../constants';

@Injectable()
export class CommentService {
  constructor(
    private readonly repository: Repository,
    private readonly tz: Timezone
  ) {}

  /**
   * Создание комментария
   * @param payload Объект DTO
   * @returns Детали созданного комментария
   */
  async create(payload: CreateCommentDto): Promise<Comment> {
    const entity = new CommentEntity({
      ...payload,
      registrationDate: this.tz.getDateTimeLocale(Timezone.UTC_FORMAT),
      // TODO: идентификатор авторизованного пользователя
      author: '833a6872-29dd-4869-af2e-7df28a82aa6c',
    });
    return this.repository.create(entity);
  }

  /**
   * Получение всего репозитория
   * @returns Ненормализованный список заданий
   */
  async getList(taskId: string): Promise<Comment[]> {
    const repository = await this.repository.getRepository();
    return repository.filter((item) => item.task === taskId);
  }

  /**
   * Получение детальной информации о задаче
   * @param id Идентификатор задачи
   * @returns Детальная информация о задаче + дополнительные данные (количество откликов, информация о пользователе и т.д.)
   */
  async findById(id: string): Promise<Comment> {
    const record = await this.repository.findById(id);
    if (!record) {
      throw new NotFoundException(EXCEPTION.NotFoundComment);
    }
    return record;
  }

  /**
   * Удаление существующего комментария
   * @param commentId Идентификатор задачи
   */
  async deleteItem(commentId: string): Promise<void> {
    await this.findById(commentId);
    await this.repository.delete(commentId);
  }

  /**
   * Удаление всех комментариев в разрезе определенной задачи
   * @param taskId Идентификатор задачи
   */
  async deleteList(taskId: string): Promise<void> {
    await this.repository.deleteCommentsList(taskId);
  }
}
