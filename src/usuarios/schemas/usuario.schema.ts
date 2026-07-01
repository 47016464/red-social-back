import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UsuarioDocument = Usuario & Document;

@Schema({ timestamps: true })
export class Usuario {
  @Prop({ required: true })
  nombre!: string;

  @Prop({ required: true })
  apellido!: string;

  @Prop({ required: true, unique: true })
  email!: string;

  @Prop({ required: true, unique: true })
  username!: string;

  @Prop({ required: true })
  password!: string;

  @Prop({ required: true })
  fechaNacimiento!: string;

  @Prop({ default: '' })
  descripcion!: string;

  @Prop({ default: '' })
  imagenPerfil!: string;

  @Prop({ default: 'usuario', enum: ['usuario', 'administrador'] })
  perfil!: string;

  @Prop({ default: true })
  habilitado!: boolean;
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);