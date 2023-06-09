import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import {
  TaskStatus,
  Task,
  AccessTokenPayload,
  AvailableRole,
} from '@project/contracts';
import { TaskEntity } from './entity';
import { Repository, CommentRepository } from './service';
import { CreateTaskDto, UpdateTaskDto, ChangeCommentsCount } from './dto';
import { TaskQuery, AssignedQuery, validateStatus } from './validations';
import { Exception } from '../constants';
import { isResponseOnTask } from './utils';

@Injectable()
export class TaskService {
  constructor(
    private readonly repository: Repository,
    private readonly commentRepository: CommentRepository
  ) {}

  /**
   * Создание задачи.
   * Создавать задачи могут только авторизованные пользователи
   * @param payload Объект DTO
   * @param tokenPayload Данные access-токена
   * @returns Созданная задача
   */
  async create(
    payload: CreateTaskDto,
    tokenPayload: AccessTokenPayload
  ): Promise<Task> {
    const { id } = tokenPayload;
    const task: Task = {
      ...payload,
      cost: payload.cost ?? 0,
      dueDate: payload.dueDate ?? null,
      image: payload.image ?? '',
      address: payload.address ?? '',
      tags: payload.tags ?? [],
      status: TaskStatus.New,
      contractor: null,
      responses: [],
      customer: id,
    };
    const record = new TaskEntity(task);
    const categoryList = await this.repository.getCategoryList();
    const existingCategoryId = categoryList.find(
      (item) => item.name === record.category
    );
    return this.repository.create(record, existingCategoryId?.id);
  }

  /**
   * Получение списка заданий
   * @returns Ненормализованный список заданий
   */
  async getList(query: TaskQuery): Promise<Task[]> {
    return this.repository.getRepository(query);
  }

  /**
   * Получение детальной информации о задаче
   * @param id Идентификатор задачи
   * @returns Детальная информация о задаче + дополнительные данные (количество откликов, информация о пользователе и т.д.)
   */
  async findById(id: number): Promise<Task> {
    const record = await this.repository.findById(id);
    if (!record) {
      throw new NotFoundException(Exception.NotFoundTask);
    }
    return record;
  }

  async findByAccount(role: AvailableRole, id: string, status?: TaskStatus) {
    return this.repository.findByAccount(role, id, status);
  }

  /**
   * Обновление задачи.
   * @param id Идентификатор задачи
   * @param payload Объект DTO
   * @param tokenPayload Данные access-токена
   * @returns Детальная информация о задаче
   */
  async update(
    id: number,
    payload: UpdateTaskDto,
    tokenPayload: AccessTokenPayload
  ): Promise<Task> {
    const record = await this.findById(id);
    const { id: userId, role } = tokenPayload;
    const isResponse = isResponseOnTask(role, payload, record);

    if (isResponse) {
      const { responses } = record;
      if (responses.includes(userId)) {
        throw new BadRequestException();
      }
      return this.repository.update(id, {
        ...record,
        responses: [...responses, userId],
      });
    }

    const isNewStatusValid = validateStatus(
      record.status,
      payload.status,
      role
    );

    if (
      ![record.customer, record.contractor].includes(userId) ||
      !isNewStatusValid
    ) {
      throw new BadRequestException(Exception.NotValidStatusOrRole);
    }

    const shouldSetContractor =
      role === 'customer' &&
      record.status === TaskStatus.New &&
      payload.contractor;

    if (shouldSetContractor) {
      const isVacantContractor = !(
        await this.repository.findByAccount(
          'contractor',
          payload.contractor,
          TaskStatus.InProgress
        )
      ).length;
      if (!isVacantContractor) {
        throw new BadRequestException(Exception.NotVacantContractor);
      }
    }

    return this.repository.update(id, {
      ...record,
      contractor: payload.contractor ?? record.contractor,
      status: payload.status ?? record.status,
    });
  }

  /**
   * Удаление существующего задания
   * @param id Идентификатор задачи
   * @param tokenPayload Данные access-токена
   * @param token Значение, переданное в заголовке Authorization
   */
  async delete(
    id: number,
    tokenPayload: AccessTokenPayload,
    token: string
  ): Promise<void> {
    const record = await this.findById(id);
    if (record.customer !== tokenPayload.id) {
      throw new UnauthorizedException();
    }
    await this.repository.delete(id);
    await this.commentRepository.removeCommentsList(token, id);
  }

  /**
   * Когда список «Мои задания» запрашивает заказчик, он получает список созданных им заданий.
   * Когда этот же список запрашивает исполнитель, он получает список заданий, в которых он является исполнителем.
   * Для заказчика список отсортирован по дате создания (по убыванию), а для исполнителя по статусу задания (задания со статусом «новый» в начале списка).
   * Пользователь может передавать дополнительную информацию приложению и фильтровать список «Мои задания» по статусу.
   * Это позволяет получить задания с определённым статусом. Например, только задания со статусом «В процессе».
   * @param query Query-параметры
   * @param user Данные авторизованного пользователя
   */
  async getAssignedList(query: AssignedQuery, user: AccessTokenPayload) {
    const { role, id } = user;
    const { status } = query;
    const records = await this.repository.findByAccount(role, id, status);

    return role === 'customer'
      ? records
      : records.sort((a, b) => a.status - b.status);
  }

  /**
   * Изменение количества комментариев
   * @param payload Объект DTO
   */
  async changeCommentsQuantity(payload: ChangeCommentsCount) {
    await this.repository.changeCommentsQuantity(payload);
  }
}
