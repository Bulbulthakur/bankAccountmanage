/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { JwtPayload, Role } from 'src/common/types';

export type ValidAuthResponse = {
  accessToken: string;
  type: Role;
};



@Injectable()
export class AuthService {
  constructor(private  prisma:PrismaService,
    private jwtService: JwtService,
  ){}
  
  
 private  async isemailExist(email:string){
    const user = await this.prisma.admin.findUnique({
      where:{
         email,
      },
    })
    if(user)
    {
      throw new BadRequestException('User already exist with this email', {
        cause: new Error(),
        description: 'Some error description',
      });
    }
  };
  private async ismobileExist(mobile:string){
    const user = await this.prisma.admin.findUnique({
      where:{
         mobile,
      },
    })
    if(user)
    {
      throw new BadRequestException('User already exist with this mobile number', {
        cause: new Error(),
        description: 'Some error description',
      });
    }
  }


  async createUser(payload: {
    name:string,
    email:string,
    mobile?:string,
    password:string , 
    address?: string,
  }):Promise<ValidAuthResponse> {

   await this.isemailExist(payload.email);
   await this.ismobileExist(payload.mobile);
   const hash = await this.bcryptPassword(payload.password);
   payload.password = hash;

      
   const user =  await this.prisma.admin.create({
   data: {
    name:payload.name,
    email:payload.email,
    mobile:payload.mobile,
    password:payload.password, 
    address: payload.address,
   },
  }); 
  return {
    accessToken: this.generateJwt({
      sub: user.id,
      type: Role.Admin,
    }),
    type: Role.Admin,
  };  
  }


// LOGIN
async login(userId: number, type: Role): Promise<ValidAuthResponse> {
  return {
    accessToken: this.generateJwt({
      sub: userId,
      type,
    }),
    type,
  };
}


    // BCRYPT FUNCTION
    private async bcryptPassword(plainText: string):Promise<string> {
      return await bcrypt.hash(plainText, 10);
    }

    // JWT TOKEN
    private generateJwt(payload: JwtPayload, options?: JwtSignOptions): string {
      return this.jwtService.sign(payload, options);
    }
  
  
  
}
