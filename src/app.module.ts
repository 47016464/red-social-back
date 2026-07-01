import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { PublicacionesModule } from './publicaciones/publicaciones.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://augusebottazzi_db_user:Orbit1234@bottazzinho.bxe3pdu.mongodb.net/orbit?appName=Bottazzinho'),
    AuthModule,
    UsuariosModule,
    PublicacionesModule,
  ],
})
export class AppModule {}