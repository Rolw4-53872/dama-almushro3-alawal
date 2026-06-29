import { IsEmail, IsString, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'أحمد محمد' })
  @IsString()
  @MinLength(3)
  fullName: string;

  @ApiProperty({ example: '0501234567' })
  @IsString()
  @Matches(/^(\+966|0)[0-9]{9}$/)
  phoneNumber: string;

  @ApiProperty({ example: 'SecurePass123!' })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password: string;
}
