import {
  Controller, Get, Post, Delete, Body, Param,
  Query, UseGuards, Request, UseInterceptors,
  UploadedFile, HttpCode, HttpStatus, UsePipes, ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { PublicacionesService } from './publicaciones.service';
import { CrearPublicacionDto, AgregarComentarioDto } from './dto/crear-publicacion.dto';
import { JwtAuthGuard } from '../auth/jwt.strategy';

@Controller('publicaciones')
@UseGuards(JwtAuthGuard) // Todas las rutas requieren JWT
export class PublicacionesController {
  constructor(private publicacionesService: PublicacionesService) {}

  // ── GET /publicaciones ─────────────────────────────────────────────────────
  // ?orden=fecha|likes  &offset=0  &limit=5  &usuarioId=xxx
  @Get()
  async listar(
    @Query('orden') orden: 'fecha' | 'likes' = 'fecha',
    @Query('offset') offset = '0',
    @Query('limit') limit = '5',
    @Query('usuarioId') usuarioId?: string,
  ) {
    return this.publicacionesService.listar(
      orden,
      parseInt(offset),
      parseInt(limit),
      usuarioId,
    );
  }

  // ── POST /publicaciones ────────────────────────────────────────────────────
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileInterceptor('imagen', {
      storage: diskStorage({
        destination: './uploads/publicaciones',
        filename: (req, file, cb) => {
          const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, unique + extname(file.originalname));
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
          return cb(new Error('Solo se permiten imágenes'), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async crear(
    @Body() dto: CrearPublicacionDto,
    @Request() req: any,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const imagenUrl = file
      ? `http://localhost:3000/uploads/publicaciones/${file.filename}`
      : undefined;
    return this.publicacionesService.crear(dto, req.user._id.toString(), imagenUrl);
  }

  // ── DELETE /publicaciones/:id ──────────────────────────────────────────────
  @Delete(':id')
  async eliminar(@Param('id') id: string, @Request() req: any) {
    return this.publicacionesService.eliminar(
      id,
      req.user._id.toString(),
      req.user.perfil,
    );
  }

  // ── POST /publicaciones/:id/like ───────────────────────────────────────────
  @Post(':id/like')
  @HttpCode(HttpStatus.OK)
  async darLike(@Param('id') id: string, @Request() req: any) {
    return this.publicacionesService.darLike(id, req.user._id.toString());
  }

  // ── DELETE /publicaciones/:id/like ────────────────────────────────────────
  @Delete(':id/like')
  async quitarLike(@Param('id') id: string, @Request() req: any) {
    return this.publicacionesService.quitarLike(id, req.user._id.toString());
  }

  // ── POST /publicaciones/:id/comentarios ────────────────────────────────────
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