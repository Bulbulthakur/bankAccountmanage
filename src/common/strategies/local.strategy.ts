/* eslint-disable prettier/prettier */
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy } from 'passport-local';
import { ValidatedUser } from '../types';
// import { LOCAL_AUTH } from '../guards/auth.constats';
import { UserService } from 'src/user/user.service';
import { AdminService } from 'src/admin/admin.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(
    private readonly userService: UserService,
    private readonly adminService: AdminService,
  ) {
    super(
     { usernameField: 'identifire', passwordField: 'password' }
    );
  }

  async validate(identifire: string, password: string): Promise<ValidatedUser> {
    let user: false | ValidatedUser | null;
    
    user = await this.userService.validateCredentials(identifire, password);
    if (user === null) {
      user = await this.adminService.validateCredentials(identifire, password);
    }

    if (user === false) throw new UnauthorizedException('Incorrect password');

    if(user === null) throw new UnauthorizedException('User does not exist');

    if (user) return user;
  }
}
