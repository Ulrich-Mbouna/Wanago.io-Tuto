import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from "class-validator";

export class RegisterDto {
  @IsOptional()
  @IsNumber()
  id: number;

  @IsString()
  @IsNotEmpty()
  @MinLength(7)
  password: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}
