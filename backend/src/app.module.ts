import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AssociationsModule } from './associations/associations.module';
import { GrantRequestsModule } from './grant-requests/grant-requests.module';
import { DocumentsModule } from './documents/documents.module';
import { ContractsModule } from './contracts/contracts.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AuditModule } from './audit/audit.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    AssociationsModule,
    GrantRequestsModule,
    DocumentsModule,
    ContractsModule,
    NotificationsModule,
    AuditModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
