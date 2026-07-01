import {
  Controller, Get, Post, Put, Body, Param,
  Query, UseGuards, Request, HttpCode, HttpStatus,
  UsePipes, ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.strategy';
import { PublicacionesService } from './publicaciones.service';
import { AgregarComentarioDto, EditarComentarioDto } from './dto/crear-publicacion.dto';

@Controller('publicaciones/:id/comentarios')
@UseGuards(JwtAuthGuard)
export class ComentariosController {
  constructor(private publicacionesService: PublicacionesService) {}

  // GET /publicaciones/:id/comentarios?offset=0&limit=5
  @Get()
  async listar(
    @Param('id') id: string,
    @Query('offset') offset = '0',
    @Query('limit') limit = '5',
  ) {
    return this.publicacionesService.cargarComentarios(id, parseInt(offset), parseInt(limit));
  }

  // POST /publicaciones/:id/comentarios
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async agregar(
    @Param('id') id: string,
    @Request() req: any,
    @Body() dto: AgregarComentarioDto,
  ) {
    return this.publicacionesService.comentar(id, req.user._id.toString(), dto);
  }

  // PUT /publicaciones/:id/comentarios/:comentarioId
  @Put(':comentarioId')
  @HttpCode(HttpStatus.OK)
  async editar(
    @Param('id') id: string,
    @Param('comentarioId') comentarioId: string,
    @Request() req: any,
    @Body() dto: EditarComentarioDto,
  ) {
    return this.publicacionesService.editarComentario(
      id, comentarioId, req.user._id.toString(), dto.texto
    );
  }
}