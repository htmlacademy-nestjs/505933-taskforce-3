import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Req,
  Delete,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { Request } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { fillObject } from '@project/utils/utils-core';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto';
import { CommentRdo } from './rdo';
import { CommentQuery } from './validations';
import { NotifyService } from '../notify/notify.service';

@ApiTags('Comment service')
@Controller({
  version: '1',
  path: 'comments',
})
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
    private readonly notifyService: NotifyService
  ) {}

  /**
   * Создание комментария
   * @param dto Объект DTO
   * @param request Объект запроса
   * @returns Детали созданного комментария
   */
  @Post()
  @ApiOperation({ summary: 'Creating new comment' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'New comment has been successfully created',
    type: CommentRdo,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  async create(
    @Body() dto: CreateCommentDto,
    @Req() request: Request
  ): Promise<CommentRdo> {
    const { user } = request;
    const payload = await this.commentService.create(dto, user);
    const commentsQuantity = await this.getListQuantity(dto.task);
    await this.notifyService.changeCommentCount({
      taskId: dto.task,
      commentsQuantity,
    });
    return fillObject(CommentRdo, payload);
  }

  /**
   * Получение списка комментариев в разрезе задания
   * @returns Список комментариев
   */
  @Get(':taskId')
  @ApiOperation({ summary: 'Getting comments list' })
  @ApiQuery({
    name: 'page',
    type: Number,
    description: 'Page number. It is used for paginating.',
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    description: 'Max limit records.',
    required: false,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Tasks list',
    type: CommentRdo,
    isArray: true,
  })
  async getList(
    @Param('taskId', ParseIntPipe) taskId: number,
    @Query() query: CommentQuery
  ): Promise<CommentRdo[]> {
    const records = await this.commentService.getList(taskId, query);
    return records.map((r) => fillObject(CommentRdo, r));
  }

  /**
   * Получение общего числа комментариев в разрезе задачи
   * @returns Количество комментариев
   */
  @Get(':taskId/count')
  @ApiOperation({ summary: 'Getting comments quantity' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Comments quantity',
    type: Number,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  async getListQuantity(
    @Param('taskId', ParseIntPipe) taskId: number
  ): Promise<number> {
    return this.commentService.getQuantity(taskId);
  }

  /**
   * Удаление отдельного комментария
   * @param commentId Идентификатор комментария
   * @param request Объект запроса
   */
  @Delete(':taskId/:commentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deleting existing comment' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Comment has been successfully deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request',
  })
  async deleteItem(
    @Param('commentId', ParseIntPipe) commentId: number,
    @Param('taskId', ParseIntPipe) taskId: number,
    @Req() request: Request
  ): Promise<void> {
    const { user } = request;
    await this.commentService.deleteItem(commentId, user);
    const commentsQuantity = await this.getListQuantity(taskId);
    await this.notifyService.changeCommentCount({
      taskId,
      commentsQuantity,
    });
  }

  /**
   * Удаление всех комментариев в разрезе определенной задачи
   * @param taskId Идентификатор задачи
   * @param request Объект запроса
   */
  @Delete(':taskId/')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deleting all comments belonging to the task' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'All comments has been successfully deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  async deleteList(
    @Param('taskId', ParseIntPipe) taskId: number,
    @Req() request: Request
  ): Promise<void> {
    const { user } = request;
    await this.commentService.deleteList(taskId, user);
    const commentsQuantity = await this.getListQuantity(taskId);
    await this.notifyService.changeCommentCount({
      taskId,
      commentsQuantity,
    });
  }
}
