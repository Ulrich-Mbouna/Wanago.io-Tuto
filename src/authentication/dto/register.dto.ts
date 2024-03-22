import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Address } from '@prisma/client';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(7)
  password: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  address: Address;
}
