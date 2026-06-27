import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { PublicacionesController } from './publicaciones.controller';
import { ComentariosController } from './comentarios.controller';
import { PublicacionesService } from './publicaciones.service';
import { Publicacion, PublicacionSchema } from './schemas/publicacion.schema';
import { Usuario, UsuarioSchema } from '../usuarios/schemas/usuario.schema';
import { AuthModule } from '../auth/auth.module';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { JwtStrategy } from '../auth/jwt.strategy';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Publicacion.name, schema: PublicacionSchema },
      { name: Usuario.name, schema: UsuarioSchema },
    ]),
    PassportModule,
    AuthModule,
    UsuariosModule,
    CloudinaryModule,
  ],
  controllers: [PublicacionesController, ComentariosController],
  providers: [PublicacionesService, JwtStrategy],
})
export class PublicacionesModule {}