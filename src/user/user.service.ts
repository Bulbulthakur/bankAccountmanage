/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TransDto } from './dto/transaction.dto';
import { TransferDto } from './dto/transferToUser.dto';
import { Role, ValidatedUser } from 'src/common/types';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService){}
  
  async getByIdentifire(identifire: string) {
    return  await this.prisma.user.findFirst({
      where:{
        OR: [{ email: identifire }, { mobile:identifire }],
      }
    });
  };

      // DECRYPT FUNCTION
     private async decryptPassword(plainText: string, hash: string):Promise<boolean> {
        return await bcrypt.compare(plainText, hash);
      };

// VALIDATE CREDENTIALS
  async validateCredentials(identifire:string, password:string): Promise<ValidatedUser | false | null> {

    const user = await this.getByIdentifire(identifire);
     
    if (!user) return null;
    const isMatch = await this.decryptPassword(password, user.password);
    if (!isMatch) return false;

    if (user.status!== 'Active') {
      throw new Error(
        'Your account has been temporarily suspended/blocked by the system',
      );
    }
    return {
      id: user.id,
      type: Role.User,
    };
  };


  // deposite 
  async deposite(payload:TransDto, id:number){

    await this.prisma.$transaction(async(tx)=>{
      const account = await tx.userAccount.findFirst({
        where:{userId:id},
      });

      const balance= await tx.balance.findUnique({
        where:{accountId:account.id}
      });

      const updatebalance:number= balance.balance + payload.amount;
      await tx.balance.update({
      where:{id:balance.id},
      data:{
        balance:updatebalance,
      },
    });     

    return  await tx.transaction.create({
      data:{
        amount:payload.amount,
        type:'DEPOSITE',
        accountId:account.id,
      }
    });
    });
  };

  // WITHDRAW 
  async withdraw(payload:TransDto, id:number){

    await this.prisma.$transaction(async(tx)=>{
      const account = await tx.userAccount.findFirst({
        where:{userId:id},
      });

      const balance= await tx.balance.findUnique({
        where:{accountId:account.id}
      });
      await this.checkbalancefortran(balance.id, payload.amount);

      const updatebalance:number= balance.balance-payload.amount;
      await tx.balance.update({
      where:{id:balance.id},
      data:{
        balance:updatebalance,
      },
    });     

    return  await tx.transaction.create({
      data:{
        amount:payload.amount,
        type:'WITHDRAW',
        accountId:account.id,
      }
    });
    });
  };




// current BALANCE 
  async checkBalance(id:number){
    console.log(id);
    
    const account = await this.prisma.userAccount.findFirst({
      where:{userId:id},
      })
      
    return await this.prisma.balance.findUnique({
      where:{
        accountId:account.id
      },
      select:{
        balance: true
      }
    })
  };

  // UPDATE BALANCE
  private async updateBalance(id:number, balance:number ){
    return await this.prisma.balance.update({
      where:{id},
      data:{
        balance,
      },
    });
  };


  //TRANSFER TO ANY USER
  async transfer(data:TransferDto, id:number){
    
    const user = await this.isUserExist(data.accountNumber);  // CHECK ACCOUNT NUMBER OF USER IS VALID OR NOT
    // give by account
    const giverAccount = await this.prisma.userAccount.findFirst({
      where:{userId:id},
      include:{
        balance:{
          select:{
            id:true,
            balance:true
          }
        }
      }
    });
    await this.checkbalancefortran(giverAccount.balance.id, data.amount);

    const giveuseramount = giverAccount.balance.balance - data.amount;
    console.log("giveuseramount : ", giveuseramount);
    
    const collectuseramount = user.balance.balance + data.amount;
    console.log("collectuseramount : ", collectuseramount);

    await this.prisma.$transaction(async(tx)=>{
      await tx.balance.update({
      where:{accountId:giverAccount.id},
      data:{
        balance:giveuseramount,
      },
    });  
    
    await tx.balance.update({
      where:{accountId:user.id},
      data:{
        balance:collectuseramount,
      },
    });  

    await tx.transaction.create({
      data:{
        amount:data.amount,
        type:'CREDITE',
        accountId:user.id,
      }
    });

    await tx.transaction.create({
      data:{
        amount:data.amount,
        type:'TRANSFER',
        accountId:giverAccount.id,
      }
    });
    })
  };

  // IS USER EXIST
  private  async isUserExist(accountNumber:string){
    const user = await this.prisma.userAccount.findUnique({
      where:{
        accountNumber,
      },
      include:{
        balance:{},
      }
    });
    if(!user){
      throw new UnauthorizedException('Invalid Account Number');
    }
    return user;
  };

    // TRANSACTION HISTORY
    async transactionHistory(id:number){
      const account = await this.prisma.userAccount.findFirst({
        where:{userId:id},
      });
      
      const transaction= await this.prisma.transaction.findMany({
        where:{accountId:account.id},
        select:{
          type:true,
          amount:true,
          accountId:true
        } 
      })
      return transaction;
    };
  
    // CHECK BALANCE BEFORE TRANSFER OR WITHDRAW
    private async checkbalancefortran(id:number, amount:number){
      const balance = await this.prisma.balance.findUnique({
        where:{id}
      });
      if(balance.balance<amount)
      {
        throw new BadRequestException('You have no Valid Balance', {
          cause: new Error(),
          description: 'Some error description',
        });
      }
    };
  

}
