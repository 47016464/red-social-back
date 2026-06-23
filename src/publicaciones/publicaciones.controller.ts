import {
  Controller, Get, Post, Delete, Body, Param,
  Query, UseGuards, Request, UseInterceptors,
  UploadedFile, HttpCode, HttpStatus, UsePipes, ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { PublicacionesService } from './publicaciones.service';
import { CrearPublicacionDto, AgregarComentarioDto } from './dto/crear-publicacion.dto';
import { JwtAuthGuard } from '../auth/jwt.strategy';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Controller('publicaciones')
@UseGuards(JwtAuthGuard)
export class PublicacionesController {
  constructor(
    private publicacionesService: PublicacionesService,
    private cloudinaryService: CloudinaryService,
  ) {}

  @Get()
  async listar(
    @Query('orden') orden: 'fecha' | 'likes' = 'fecha',
    @Query('offset') offset = '0',
    @Query('limit') limit = '5',
    @Query('usuarioId') usuarioId?: string,
  ) {
    return this.publicacionesService.listar(orden, parseInt(offset), parseInt(limit), usuarioId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('imagen', { storage: memoryStorage() }))
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async crear(
    @Body() dto: CrearPublicacionDto,
    @Request() req: any,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    let imagenUrl: string | undefined;
    if (file) {
      imagenUrl = await this.cloudinaryService.uploadStream(file, 'orbit/publicaciones');
    }
    return this.publicacionesService.crear(dto, req.user._id.toString(), imagenUrl);
  }

  @Delete(':id')
  async eliminar(@Param('id') id: string, @Request() req: any) {
    return this.publicacionesService.eliminar(id, req.user._id.toString(), req.user.perfil);
  }

  @Post(':id/like')
  @HttpCode(HttpStatus.OK)
  async darLike(@Param('id') id: string, @Request() req: any) {
    return this.publicacionesService.darLike(id, req.user._id.toString());
  }

  @Delete(':id/like')
  async quitarLike(@Param('id') id: string, @Request() req: any) {
    return this.publicacionesService.quitarLike(id, req.user._id.toString());
  }

  @Post(':id/comentarios')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async comentar(
    @Param('id') id: string,
    @Request() req: any,
    @Body() dto: AgregarComentarioDto,
  ) {
    return this.publicacionesService.comentar(id, req.user._id.toString(), dto);
  }
}