/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/jwtauth.guard';
import { UserService } from './user.service';
import { TransDto } from './dto/transaction.dto';
import { TransferDto } from './dto/transferToUser.dto';

@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private userService: UserService){}

  @Post('transaction/deposite')
  async deposite(@Body() data:TransDto , @Req() req:any){
    await this.userService.deposite(data, req.user.sub) 
    return {status: 'success'}
  };

  @Post('transaction/withdraw')
  async withdraw(@Body() data:TransDto , @Req() req:any){
    await this.userService.withdraw(data, req.user.sub) 
    return {status: 'success'}
  };

  @Get('transactionHistory')
  async history( @Req() req:any){
    const history = await this.userService.transactionHistory(req.user.sub);
    return {status: 'success', history}
  };

  @Get('balance')
  async balance(@Req() req:any){
    console.log(req.user.sub);
    
    const balance = await this.userService.checkBalance(req.user.sub);
    return {status: 'success', balance}
  };

  @Post('transfer')
  async tranferMoney(@Body() data:TransferDto , @Req() req:any){
   await this.userService.transfer(data, req.user.sub);
   return {status: 'success'}
  }
}
