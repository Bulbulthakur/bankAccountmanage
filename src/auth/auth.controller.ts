/* eslint-disable prettier/prettier */
import { Body, Controller, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login.dto';
import { ValidatedUser } from 'src/common/types';
import { ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
// import { AuthGuard } from 'src/common/guards/jwtauth.guard';
// import { AccountDto } from './dto/account.dto';
// import { Roles, RolesGuard } from 'src/common/guards/role.guard';
// import { Role } from 'src/common/types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService){}
  @Post('createUser')
  async createUser(@Body() req: RegisterDto){
    const { accessToken } = await this.authService.createUser(req)
   
    return {status: 'success', accessToken}
  };

  @ApiBody({ type: () => LoginUserDto })
  @HttpCode(200)
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async loginUser(@Req() req: Request & { user: ValidatedUser }){
    if(!req.user){
      throw new Error('User not authenticated');
    }
    const { accessToken, type } = await this.authService.login(
      req.user.id,
      req.user.type,
    );
   return {status: 'success', accessToken, type}
  }
  
}
