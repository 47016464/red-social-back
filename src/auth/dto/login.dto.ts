import { IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: 'El usuario o correo es obligatorio' })
  @IsString()
  identifier!: string;

  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @MinLength(8, { message: 'Mínimo 8 caracteres' })
  @Matches(/^(?=.*[A-Z])(?=.*\d).+$/, {
    message: 'Debe tener al menos una mayúscula y un número'
  })
  password!: string;
}