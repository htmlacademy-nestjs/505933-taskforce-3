import { Module } from '@nestjs/common';
import { HttpModule, ConfigTaskModule } from '@project/services';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard, RoleGuard } from '@project/utils/utils-core';
import { PrismaModule } from './task/prisma.module';
import { TaskModule } from './task/task.module';
import { TaskSubscriberModule } from './task-subscriber/task-subscriber.module';

@Module({
  imports: [
    PrismaModule.forRoot(),
    TaskModule,
    ConfigTaskModule.forRoot(),
    HttpModule,
    TaskSubscriberModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
})
export class AppModule {}
