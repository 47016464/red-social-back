import {
  Controller, Get, Post, Put, Delete, Param, Body,
  UseGuards, Request, UseInterceptors, UploadedFile,
  HttpCode, HttpStatus, ForbiddenException, UsePipes, ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from './admin.guard';
import { UsuariosService } from './usuarios.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CrearUsuarioAdminDto } from './dto/crear-usuario.dto';
import * as bcrypt from 'bcrypt';

@Controller('usuarios')
@UseGuards(AuthGuard('jwt'))
export class UsuariosController {
  constructor(
    private usuariosService: UsuariosService,
    private cloudinaryService: CloudinaryService,
  ) {}

  // GET /usuarios — solo admin
  @Get()
  @UseGuards(AdminGuard)
  async listar() {
    return this.usuariosService.listar();
  }

  // POST /usuarios — crear usuario (solo admin)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AdminGuard)
  @UseInterceptors(FileInterceptor('imagenPerfil', { storage: memoryStorage() }))
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async crear(
    @Body() dto: CrearUsuarioAdminDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const passwordHash = await bcrypt.hash(dto.password, 10);
    let imagenPerfil = '';
    if (file) {
      imagenPerfil = await this.cloudinaryService.uploadStream(file, 'orbit/perfiles');
    }
    const usuario = await this.usuariosService.crear({
      ...dto,
      password: passwordHash,
      imagenPerfil,
      perfil: dto.perfil || 'usuario',
      habilitado: true,
    });
    const { password, ...resultado } = (usuario as any).toObject();
    return { mensaje: 'Usuario creado correctamente', usuario: resultado };
  }

  // DELETE /usuarios/:id — deshabilitar (solo admin)
  @Delete(':id')
  @UseGuards(AdminGuard)
  async deshabilitar(@Param('id') id: string) {
    return this.usuariosService.deshabilitar(id);
  }

  // POST /usuarios/:id/habilitar — rehabilitar (solo admin)
  @Post(':id/habilitar')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AdminGuard)
  async habilitar(@Param('id') id: string) {
    return this.usuariosService.habilitar(id);
  }

  // PUT /usuarios/:id — editar perfil propio
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('imagenPerfil', { storage: memoryStorage() }))
  async actualizar(
    @Param('id') id: string,
    @Request() req: any,
    @Body() body: { nombre?: string; apellido?: string; descripcion?: string },
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (req.user._id.toString() !== id && req.user.perfil !== 'administrador') {
      throw new ForbiddenException('No podés editar el perfil de otro usuario');
    }
    let imagenPerfil: string | undefined;
    if (file) {
      imagenPerfil = await this.cloudinaryService.uploadStream(file, 'orbit/perfiles');
    }
    const actualizado = await this.usuariosService.actualizar(id, {
      ...body,
      ...(imagenPerfil ? { imagenPerfil } : {}),
    });
    return { mensaje: 'Perfil actualizado correctamente', usuario: actualizado };
  }
}