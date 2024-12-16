/* eslint-disable prettier/prettier */
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/jwtauth.guard';
import { Roles, RolesGuard } from 'src/common/guards/role.guard';
import { Role } from 'src/common/types';
import { AdminService } from './admin.service';
import { AccountDto } from 'src/admin/dto/account.dto';

@Roles(Role.Admin)
@UseGuards(AuthGuard, RolesGuard)
@Controller('admin')
export class AdminController {
  constructor(private adminService:AdminService){}

@Roles(Role.Admin)  
@Post('Accounts')
@UseGuards(AuthGuard, RolesGuard)
async createAccount(@Body() details:AccountDto){
     await this.adminService.createAccount(details)
    return {status: 'success'}
}



}
