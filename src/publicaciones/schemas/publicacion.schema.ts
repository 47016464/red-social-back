import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PublicacionDocument = Publicacion & Document;

@Schema({ timestamps: true })
export class Publicacion {
  @Prop({ required: true })
  titulo!: string;

  @Prop({ required: true })
  mensaje!: string;

  @Prop({ default: '' })
  imagen!: string;

  @Prop({ type: Types.ObjectId, ref: 'Usuario', required: true })
  autor!: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Usuario' }], default: [] })
  likes!: Types.ObjectId[];

  @Prop({
    type: [
      {
        autor: { type: Types.ObjectId, ref: 'Usuario' },
        texto: { type: String, required: true },
        creadoEn: { type: Date, default: Date.now },
      },
    ],
    default: [],
  })
  comentarios!: {
    autor: Types.ObjectId;
    texto: string;
    creadoEn: Date;
  }[];

  @Prop({ default: false })
  eliminado!: boolean;
}

export const PublicacionSchema = SchemaFactory.createForClass(Publicacion);