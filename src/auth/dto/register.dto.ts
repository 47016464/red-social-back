import { IsEmail, IsNotEmpty, IsString, MinLength, Matches, IsOptional, IsDateString } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString()
  nombre!: string;

  @IsNotEmpty({ message: 'El apellido es obligatorio' })
  @IsString()
  apellido!: string;

  @IsEmail({}, { message: 'El correo no es válido' })
  email!: string;

  @IsNotEmpty({ message: 'El nombre de usuario es obligatorio' })
  @IsString()
  username!: string;

  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @MinLength(8, { message: 'Mínimo 8 caracteres' })
  @Matches(/^(?=.*[A-Z])(?=.*\d).+$/, {
    message: 'Debe tener al menos una mayúscula y un número'
  })
  password!: string;

  @IsDateString({}, { message: 'La fecha de nacimiento no es válida' })
  fechaNacimiento!: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsString()
  perfil?: string;
}