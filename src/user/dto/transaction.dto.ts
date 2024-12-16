/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsNumber } from "class-validator";

export class TransDto{
 
  @IsNumber()
  @IsNotEmpty()
  amount:number;
}