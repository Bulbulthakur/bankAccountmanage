/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { EmailService } from 'src/email/email.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports:[ConfigModule.forRoot()],
  controllers: [AdminController],
  providers: [AdminService, PrismaService, EmailService],
  exports:[AdminService]
})
export class AdminModule {}
