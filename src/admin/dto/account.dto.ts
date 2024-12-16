/* eslint-disable prettier/prettier */
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsString, IsStrongPassword } from "class-validator";

export class AccountDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsPhoneNumber(undefined, {
    message:
      'The mobile number you entered is invalid, please provide a valid mobile number',
  })
  mobile?: string;


  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  address: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  dateOfBirth: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
   gender:string;

   @ApiPropertyOptional()
   @IsString()
   @IsOptional()
   nationality:string;

   @ApiPropertyOptional()
   @IsString()
   @IsOptional()
   maritalStatus: string;

   @ApiPropertyOptional()
   @IsString()
   @IsOptional()
   govtId: string;

   @ApiPropertyOptional()
   @IsOptional()
   @IsNumber()
   balance: number;

   @ApiPropertyOptional()
   @IsString()
   @IsOptional()
   accountType: string;
   

}