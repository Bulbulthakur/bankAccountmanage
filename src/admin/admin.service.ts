/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { Role, ValidatedUser, validateEmail } from 'src/common/types';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class AdminService {
  constructor(private  prisma:PrismaService,
    private emailService: EmailService
  ){}
  


//  ADMIN AUTHORITY
async createAccount(payload: {
  name:string,
  email:string,
  mobile?:string,
  password:string , 
  nationality?:string,
  address?: string,
  gender?: string,
  dateOfBirth?: string,
  maritalStatus?: string,
  govtId?: string,
  accountType:string,
  balance:number
}){
  

 const hash = await this.bcryptPassword(payload.password);
 payload.password = hash;
 if(payload.dateOfBirth){
 payload.dateOfBirth = new Date(payload.dateOfBirth).toISOString();
  }
  const accountNumber = await this.generateAccountNumber();
 
console.log(" account number : ", accountNumber);


await this.prisma.$transaction(async(tx)=>{
  const user = await tx.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      mobile: payload.mobile,
      password: payload.password, 
      address: payload.address,
      dateOfBirth: payload.dateOfBirth,
      gender: payload.gender,
      nationality: payload.nationality,
      maritalStatus: payload.maritalStatus,
      govtId: payload.govtId,
      role: "user",
    }
   });
  
   const account = await tx.userAccount.create({
    data:{
      accountType:payload.accountType,
      accountNumber:accountNumber,
      userId:user.id,
    },
   });
  
   const balance = await tx.balance.create({
    data:{
      balance:payload.balance,
      accountId:account.id,
    }
   });
   const email:validateEmail={
    "recipients": payload.email,
    "subject": "Welcome to IND Bank",
    "html": "Hello dear User <br> Congratulations your are now a member of IND bank. <br> Thank you <br> Regards <br> IND Bank"
   }
   await this.emailService.sendEmail(email)
   return {user, account, balance}
  
});
   
}

  // BCRYPT FUNCTION
    async bcryptPassword(plainText: string):Promise<string> {
      return await bcrypt.hash(plainText, 10);
    };

  // DECRYPT FUNCTION
    async decryptPassword(plainText: string, hash: string):Promise<boolean> {
      return await bcrypt.compare(plainText, hash);
    };


  // generate Account number
     async generateAccountNumber() {
        const randomPart = crypto.randomInt(1000000, 9999999); // 7-digit number
        const year = new Date().getFullYear();
        const branchCode = 'IND'; 
        const number =  `${year}${branchCode}${randomPart}`;
        await this.validateAccount(number);
        return number
    };

   // VALIDATE ACCOUNT
    async validateAccount(number:string){
      const account = await this.prisma.userAccount.findFirst({
        where:{accountNumber:number}
       })
       if(account){
          await this.generateAccountNumber();
       }
    };


    async getByIdentifire(identifire: string) {
      return  await this.prisma.admin.findFirst({
        where:{
          OR: [{ email: identifire }, { mobile:identifire }],
        }
      });
    }
  
// validate credentials
    async validateCredentials(identifire:string, password:string): Promise<ValidatedUser | false | null> {
      const admin = await this.getByIdentifire(identifire);
      
      if (!admin) return null;
      const isMatch = await this.decryptPassword(password, admin.password);
      if (!isMatch) return false;

      if (admin.status!== 'Active') {
        throw new Error(
          'Your account has been temporarily suspended/blocked by the system',
        );
      }
      return {
        id: admin.id,
        type: Role.Admin,
      };
  
  
    };
  }
