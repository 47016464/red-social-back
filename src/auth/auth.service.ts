import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuariosService } from '../usuarios/usuarios.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usuariosService: UsuariosService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto, imagenPerfil?: string) {
    const passwordHash = await bcrypt.hash(registerDto.password, 10);

    const usuario = await this.usuariosService.crear({
      ...registerDto,
      password: passwordHash,
      imagenPerfil: imagenPerfil
        ? `http://localhost:3000/uploads/perfiles/${imagenPerfil}`
        : '',
      perfil: registerDto.perfil || 'usuario',
    });

    const { password, ...resultado } = usuario.toObject();
    return { mensaje: 'Usuario registrado correctamente', usuario: resultado };
  }

  async login(loginDto: LoginDto) {
    const usuario = await this.usuariosService.buscarPorEmailOUsername(loginDto.identifier);

    if (!usuario) {
      throw new UnauthorizedException('Usuario o contraseña incorrectos');
    }

    const passwordValida = await bcrypt.compare(loginDto.password, usuario.password);
    if (!passwordValida) {
      throw new UnauthorizedException('Usuario o contraseña incorrectos');
    }

    const payload = { sub: usuario._id, username: usuario.username };
    const token = this.jwtService.sign(payload);

    const { password, ...datosUsuario } = usuario.toObject();
    return { token, usuario: datosUsuario };
  }
}