import { IsEmail, IsNotEmpty, IsString, IsArray, ArrayNotEmpty } from 'class-validator';

export class CreateEmailDto {

  @IsArray({ message: 'Los correos electrónicos deben ser un arreglo' })
  @ArrayNotEmpty({ message: 'El arreglo de correos electrónicos no puede estar vacío' })
  @IsString({ each: true, message: 'Cada correo electrónico debe ser una cadena de texto' })
  @IsEmail({host_whitelist: ['uninorte.edu.co']}, { each: true, message: 'El formato de los correos electrónicos no es válido' })
  emails: string[];

  @IsArray({ message: 'El token debe ser un arreglo' })
  @ArrayNotEmpty({ message: 'El arreglo de token no puede estar vacío' })
  @IsString({ each: true, message: 'Cada token debe ser una cadena de texto' })
  token: string[];

  @IsString({ message: 'El nombre del equipo no es válido' })
  @IsNotEmpty({ message: 'El nombre del equipo es obligatorio' })
  teamName: string;

}