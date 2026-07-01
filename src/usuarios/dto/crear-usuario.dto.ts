import { IsString, IsNotEmpty, IsEmail, IsOptional, IsEnum, MinLength, Matches } from 'class-validator';

export class CrearUsuarioAdminDto {
  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @IsString()
  @IsNotEmpty()
  apellido!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  username!: string;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[A-Z])(?=.*\d).+$/, {
    message: 'La contraseña debe tener al menos 8 caracteres, una mayúscula y un número',
  })
  password!: string;

  @IsString()
  @IsNotEmpty()
  fechaNacimiento!: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsEnum(['usuario', 'administrador'])
  perfil?: string;
}