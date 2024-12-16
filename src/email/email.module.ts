/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { EmailController } from './email.controller';
import { ConfigModule } from '@nestjs/config';
import { EmailService } from './email.service';

@Module({
  imports: [ConfigModule],
  providers: [EmailService],
  controllers: [EmailController],
  exports:[EmailService]
})
export class EmailModule {}
