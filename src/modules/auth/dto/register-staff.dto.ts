import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export enum StaffRole {
  JURY = 'jurado',
  TEACHER = 'profesor'
}

export class RegisterStaffDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nombre_completo: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ enum: StaffRole })
  @IsEnum(StaffRole)
  @IsNotEmpty()
  role: StaffRole;
}
