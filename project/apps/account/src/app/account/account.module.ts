import dayjs from 'dayjs';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import {
  Timezone,
  AvailableTimezoneService,
  getJwtOptions,
  HttpService,
} from '@project/services';
import { JwtAuthStrategy } from './validators';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { AccountModel, AccountSchema } from './model';
import { Repository, TaskRepository, ReviewRepository, Api } from './service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AccountModel.name, schema: AccountSchema },
    ]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: getJwtOptions,
    }),
  ],
  controllers: [AccountController],
  providers: [
    AccountService,
    Repository,
    TaskRepository,
    ReviewRepository,
    Timezone,
    {
      provide: AvailableTimezoneService.DayJs,
      useValue: dayjs,
    },
    {
      provide: HttpService,
      useFactory: () => new HttpService(),
    },
    JwtAuthStrategy,
    HttpService,
    Api,
  ],
})
export class AccountModule {}
