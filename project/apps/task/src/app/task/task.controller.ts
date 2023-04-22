import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { fillObject } from '@project/utils/utils-core';
import { PostQuery } from './validations';
import { TaskService } from './task.service';
import { CreateTaskDto, UpdateTaskDto } from './dto';
import { TaskRdo } from './rdo';

@ApiTags('Task service')
@Controller({
  version: '1',
  path: 'tasks',
})
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  /**
   * Создание нового задания
   * @param dto Объект DTO
   * @returns Детали созданного задания
   */
  @Post()
  @ApiOperation({ summary: 'Creating new task' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'New task has been successfully created',
    type: TaskRdo,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  async create(@Body() dto: CreateTaskDto): Promise<TaskRdo> {
    const payload = await this.taskService.create(dto);
    return fillObject(TaskRdo, payload);
  }

  /**
   * Авторизованные пользователи с ролью Исполнитель могут запрашивать список заданий со статусом Новый
   * @returns Список заданий
   */
  @Get()
  @ApiOperation({ summary: 'Getting tasks list' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Tasks list',
    type: TaskRdo,
    isArray: true,
  })
  async getList(@Query() query: PostQuery): Promise<TaskRdo[]> {
    const records = await this.taskService.getList(query);
    return records.map((r) => fillObject(TaskRdo, r));
  }

  /**
   * Получение детальной информации о задаче
   * @param taskId Идентификатор задачи
   * @returns Детальная информация о задаче + дополнительные данные (количество откликов, информация о пользователе и т.д.)
   */
  @Get(':taskId')
  @ApiOperation({ summary: 'Getting detailed information about task' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Task details',
    type: TaskRdo,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not found',
  })
  async getItem(@Param('taskId') taskId: string): Promise<TaskRdo> {
    const payload = await this.taskService.findById(taskId);
    return fillObject(TaskRdo, payload);
  }

  /**
   * Обновление задачи.
   * Доступно обновление статуса, исполнителя.
   * @param taskId Идентификатор задачи
   * @param dto Объект DTO
   * @returns Детальная информация о задаче
   */
  @Patch(':taskId')
  @ApiOperation({ summary: 'Update existing task' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Task details',
    type: TaskRdo,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not found',
  })
  async update(
    @Param('taskId') taskId: string,
    @Body() dto: UpdateTaskDto
  ): Promise<TaskRdo> {
    const payload = await this.taskService.update(taskId, dto);
    return fillObject(TaskRdo, payload);
  }

  /**
   * Удаление существующего задания
   * @param taskId Идентификатор задачи
   */
  @Delete(':taskId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete existing task' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Task has been successfully deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  async delete(@Param('taskId') taskId: string): Promise<void> {
    await this.taskService.delete(taskId);
  }
}
