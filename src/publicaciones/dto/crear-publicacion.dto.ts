import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class CrearPublicacionDto {
  @IsString()
  @IsNotEmpty({ message: 'El título es obligatorio' })
  @MaxLength(100, { message: 'El título no puede superar los 100 caracteres' })
  titulo!: string;

  @IsString()
  @IsNotEmpty({ message: 'El mensaje es obligatorio' })
  @MaxLength(2000, { message: 'El mensaje no puede superar los 2000 caracteres' })
  mensaje!: string;
}

export class AgregarComentarioDto {
  @IsString()
  @IsNotEmpty({ message: 'El comentario no puede estar vacío' })
  @MaxLength(500, { message: 'El comentario no puede superar los 500 caracteres' })
  texto!: string;
}