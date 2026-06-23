import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { PublicacionesController } from './publicaciones.controller';
import { PublicacionesService } from './publicaciones.service';
import { Publicacion, PublicacionSchema } from './schemas/publicacion.schema';
import { AuthModule } from '../auth/auth.module';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { JwtStrategy } from '../auth/jwt.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Publicacion.name, schema: PublicacionSchema },
    ]),
    PassportModule,
    AuthModule,     // exporta JwtModule → disponible para JwtStrategy
    UsuariosModule, // JwtStrategy necesita UsuariosService
  ],
  controllers: [PublicacionesController],
  providers: [PublicacionesService, JwtStrategy],
})
export class PublicacionesModule {}