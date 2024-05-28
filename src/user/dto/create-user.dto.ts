import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { IsUserEmailAlreadyExist } from '../constraints/user_email_already_exists.constraint';

export class CreateUserDto {
  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  first_name: string;

  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  last_name: string;

  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  @IsEmail()
  @IsUserEmailAlreadyExist({
    message: 'User with this email already exists.',
  })
  email: string;

  @ApiProperty({
    type: String,
  })
  phone_no: string;

  @ApiProperty({
    type: String,
  })
  password: string;
}
