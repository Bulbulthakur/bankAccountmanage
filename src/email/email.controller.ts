/* eslint-disable prettier/prettier */
import { Controller } from '@nestjs/common';
import { EmailService } from './email.service';
// import { sendEmailDto } from './dto/email.dto';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService){}
  // @Post('send')
  // async semdMail(@Body() dto: sendEmailDto){
  //   await this.emailService.sendEmail(dto);
  //   return{message: 'Mail Send Successfilly'}
  // }
}
