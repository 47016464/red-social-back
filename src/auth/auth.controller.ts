import {
  Controller, Post, Get, Body, UseInterceptors,
  UploadedFile, HttpCode, HttpStatus, UsePipes, ValidationPipe,
  UseGuards, Request,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('registro')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('imagenPerfil'))
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async registro(
    @Body() registerDto: RegisterDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.authService.register(registerDto, file);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  // POST /auth/autorizar — valida el token y devuelve el usuario
  @Post('autorizar')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async autorizar(@Request() req: any) {
    return this.authService.autorizar(req.user);
  }

  // POST /auth/refrescar — genera un nuevo token con 15 minutos
  @Post('refrescar')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async refrescar(@Request() req: any) {
    return this.authService.refrescar(req.user);
  }
}