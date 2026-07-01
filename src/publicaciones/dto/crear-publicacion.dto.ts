import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class CrearPublicacionDto {
  @IsString()
  @IsNotEmpty({ message: 'El título es obligatorio' })
  @MaxLength(100)
  titulo!: string;

  @IsString()
  @IsNotEmpty({ message: 'El mensaje es obligatorio' })
  @MaxLength(2000)
  mensaje!: string;
}

export class AgregarComentarioDto {
  @IsString()
  @IsNotEmpty({ message: 'El comentario no puede estar vacío' })
  @MaxLength(500)
  texto!: string;
}

export class EditarComentarioDto {
  @IsString()
  @IsNotEmpty({ message: 'El texto no puede estar vacío' })
  @MaxLength(500)
  texto!: string;
}