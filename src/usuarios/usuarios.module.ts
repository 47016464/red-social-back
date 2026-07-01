import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { Usuario, UsuarioSchema } from './schemas/usuario.schema';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Usuario.name, schema: UsuarioSchema }]),
    PassportModule,
    JwtModule.register({
      secret: 'JWT_SECRET_ORBIT_2024',
      signOptions: { expiresIn: '15m' },
    }),
    CloudinaryModule,
  ],
  providers: [UsuariosService],
  controllers: [UsuariosController],
  exports: [UsuariosService],
})
export class UsuariosModule {}