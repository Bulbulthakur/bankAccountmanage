/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class TransferDto{
 
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  amount:number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  accountNumber:string;
}