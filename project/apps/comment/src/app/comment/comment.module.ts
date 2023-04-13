import dayjs from 'dayjs';
import { Module } from '@nestjs/common';
import { Timezone, AvailableTimezoneService } from '@project/services';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { Repository } from './service';

@Module({
  controllers: [CommentController],
  providers: [
    CommentService,
    Repository,
    Timezone,
    {
      provide: AvailableTimezoneService.DayJs,
      useValue: dayjs,
    },
  ],
})
export class CommentModule {}
