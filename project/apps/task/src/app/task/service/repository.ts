import { Injectable } from '@nestjs/common';
import {
  AvailableRole,
  CRUDRepository,
  TaskStatus,
  Task,
} from '@project/contracts';
import { TaskEntity } from '../entity';
import { TaskQuery } from '../validations';
import { PrismaService } from './prisma';
import { ChangeCommentsCount } from '../dto';
import { mapSortType } from '../utils';

@Injectable()
export class Repository implements CRUDRepository<TaskEntity, Task, number> {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Создание записи Задача (Task)
   * @param payload Полезная нагрузка
   * @param existingCategoryId идентификатор существующей категории
   * Перед созданием новой категории выполняется проверка на существование категории с таким же именем.
   * Если обнаруживается дубль, то новая категория не создаётся.
   */
  async create(payload: TaskEntity, existingCategoryId?: number) {
    const { category, ...rest } = payload;
    const record = await this.prisma.task.create({
      data: {
        ...rest,
        ...(existingCategoryId
          ? { categoryId: existingCategoryId }
          : {
              category: {
                create: {
                  name: category,
                },
              },
            }),
      },
    });
    return {
      ...record,
      category,
    };
  }

  /**
   * Поиск записи
   * @param id Уникальный идентификатор
   */
  async findById(id: number) {
    const record = await this.prisma.task.findUnique({
      where: {
        id,
      },
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
    });
    return {
      ...record,
      category: record?.category?.name,
    };
  }

  /**
   * Удаление записи
   * @param id Идентификатор записи
   */
  async delete(id: number) {
    await this.prisma.task.delete({
      where: {
        id,
      },
    });
  }

  /**
   * Обновление записи
   * @param id Идентификатор записи
   * @param item Полезная нагрузка
   * @returns Обновленная запись
   */
  async update(id: number, item: Task) {
    const { category, ...rest } = item;
    const record = await this.prisma.task.update({
      where: {
        id,
      },
      data: {
        ...rest,
      },
    });
    return {
      ...record,
      category,
    };
  }

  /**
   * Поиск задач в разрезе исполнителя
   * @param contractor Идентификатор исполнителя
   */
  async findByAccount(role: AvailableRole, id: string, status?: TaskStatus) {
    return this.prisma.task.findMany({
      where: {
        [role]: id,
        status,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Выборка всех записей по таблице tasks  с учетом фильтрации
   * @param query Фильтры, переданные в query-параметрах
   * @returns Список записей
   */
  async getRepository(query: TaskQuery) {
    const { limit, city, page, category, sorting, tag } = query;
    const records = await this.prisma.task.findMany({
      where: {
        status: TaskStatus.New,
        city,
        categoryId: category,
        ...(tag
          ? {
              tags: {
                has: tag,
              },
            }
          : {}),
      },
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        [mapSortType(sorting)]: 'desc',
      },
      take: limit,
      skip: page > 0 ? limit * (page - 1) : undefined,
    });
    return records.map((item) => ({
      ...item,
      category: item?.category?.name,
    }));
  }

  async getCategoryList() {
    return this.prisma.category.findMany();
  }

  /**
   * Изменение количества комментариев
   * @param payload Объект DTO
   */
  async changeCommentsQuantity(payload: ChangeCommentsCount) {
    await this.prisma.task.update({
      data: {
        commentsCount: payload.commentsQuantity,
      },
      where: {
        id: payload.taskId,
      },
    });
  }
}
