/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/common/guards/auth.constats';
import { UserService } from 'src/user/user.service';
import { AdminService } from 'src/admin/admin.service';
import { LocalStrategy } from 'src/common/strategies/local.strategy';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [EmailModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService,LocalStrategy , UserService, AdminService],
  exports:[AuthService]
})
export class AuthModule {}
