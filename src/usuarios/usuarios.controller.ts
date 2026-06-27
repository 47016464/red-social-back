import {
  Controller, Put, Param, Body, UseGuards,
  Request, UseInterceptors, UploadedFile,
  HttpCode, HttpStatus, ForbiddenException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { AuthGuard } from '@nestjs/passport';
import { UsuariosService } from './usuarios.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Controller('usuarios')
@UseGuards(AuthGuard('jwt'))
export class UsuariosController {
  constructor(
    private usuariosService: UsuariosService,
    private cloudinaryService: CloudinaryService,
  ) {}

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('imagenPerfil', { storage: memoryStorage() }))
  async actualizar(
    @Param('id') id: string,
    @Request() req: any,
    @Body() body: { nombre?: string; apellido?: string; descripcion?: string },
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (req.user._id.toString() !== id) {
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