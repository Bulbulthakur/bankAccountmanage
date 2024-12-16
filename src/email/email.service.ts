/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
// import { sendEmailDto } from './dto/email.dto';
import { validateEmail } from 'src/common/types';

@Injectable()
export class EmailService {
  constructor(private readonly configService: ConfigService) {}

  emailTransport() {
    const transporter = nodemailer.createTransport({
      host: this.configService.get<string>('EMAIL_HOST'),
      port: this.configService.get<number>('EMAIL_PORT'),
      secure: false, 
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASSWORD'),
      },
    });
    return transporter;
  }

  async sendEmail(dto:validateEmail) {
    const { recipients, subject, html } = dto;
    const transport = this.emailTransport();

    const options: nodemailer.SendMailOptions = {
      from: this.configService.get<string>('EMAIL_USER'),
      to: recipients,
      subject,
      html,
    };

    try {
      await transport.sendMail(options);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Sending Email Error:', error);
      throw new BadRequestException('Failed to send email', {
        cause: error,
        description: error.message,
      });
    }
  }
}
