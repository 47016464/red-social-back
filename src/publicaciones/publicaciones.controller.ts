import {
  Controller, Get, Post, Delete, Body, Param,
  Query, UseGuards, Request, UseInterceptors,
  UploadedFile, HttpCode, HttpStatus, UsePipes, ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { PublicacionesService } from './publicaciones.service';
import { CrearPublicacionDto } from './dto/crear-publicacion.dto';
import { JwtAuthGuard } from '../auth/jwt.strategy';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Controller('publicaciones')
@UseGuards(JwtAuthGuard)
export class PublicacionesController {
  constructor(
    private publicacionesService: PublicacionesService,
    private cloudinaryService: CloudinaryService,
  ) {}

  // GET /publicaciones
  @Get()
  async listar(
    @Query('orden') orden: 'fecha' | 'likes' = 'fecha',
    @Query('offset') offset = '0',
    @Query('limit') limit = '5',
    @Query('usuarioId') usuarioId?: string,
  ) {
    return this.publicacionesService.listar(orden, parseInt(offset), parseInt(limit), usuarioId);
  }

  // GET /publicaciones/:id
  @Get(':id')
  async obtener(
    @Param('id') id: string,
    @Query('commentOffset') commentOffset = '0',
    @Query('commentLimit') commentLimit = '3',
  ) {
    return this.publicacionesService.obtenerPorId(id, parseInt(commentOffset), parseInt(commentLimit));
  }

  // POST /publicaciones
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
    if (file) imagenUrl = await this.cloudinaryService.uploadStream(file, 'orbit/publicaciones');
    return this.publicacionesService.crear(dto, req.user._id.toString(), imagenUrl);
  }

  // DELETE /publicaciones/:id
  @Delete(':id')
  async eliminar(@Param('id') id: string, @Request() req: any) {
    return this.publicacionesService.eliminar(id, req.user._id.toString(), req.user.perfil);
  }

  // POST /publicaciones/:id/like
  @Post(':id/like')
  @HttpCode(HttpStatus.OK)
  async darLike(@Param('id') id: string, @Request() req: any) {
    return this.publicacionesService.darLike(id, req.user._id.toString());
  }

  // DELETE /publicaciones/:id/like
  @Delete(':id/like')
  async quitarLike(@Param('id') id: string, @Request() req: any) {
    return this.publicacionesService.quitarLike(id, req.user._id.toString());
  }
}