import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, PipelineStage } from 'mongoose';
import { Publicacion, PublicacionDocument } from './schemas/publicacion.schema';
import { CrearPublicacionDto, AgregarComentarioDto } from './dto/crear-publicacion.dto';

@Injectable()
export class PublicacionesService {
  constructor(
    @InjectModel(Publicacion.name)
    private publicacionModel: Model<PublicacionDocument>,
  ) {}

  // ── Crear publicación ──────────────────────────────────────────────────────
  async crear(
    dto: CrearPublicacionDto,
    autorId: string,
    imagenUrl?: string,
  ): Promise<PublicacionDocument> {
    const nueva = new this.publicacionModel({
      titulo: dto.titulo,
      mensaje: dto.mensaje,
      imagen: imagenUrl ?? '',
      autor: new Types.ObjectId(autorId),
    });
    return (await nueva.save()).populate('autor', '-password');
  }

  // ── Listar publicaciones (con paginación y ordenamiento) ──────────────────
  async listar(
    orden: 'fecha' | 'likes' = 'fecha',
    offset = 0,
    limit = 5,
    usuarioId?: string,
  ) {
    const filtro: Record<string, unknown> = { eliminado: false };
    if (usuarioId) filtro['autor'] = new Types.ObjectId(usuarioId);

    const sortCriteria: Record<string, 1 | -1> =
      orden === 'likes'
        ? { likesCount: -1, createdAt: -1 }
        : { createdAt: -1 };

    // Usamos aggregation para poder ordenar por cantidad de likes
    const pipeline: PipelineStage[] = [
      { $match: filtro },
      { $addFields: { likesCount: { $size: '$likes' } } },
      { $sort: sortCriteria },
      { $skip: offset },
      { $limit: limit },
      {
        $lookup: {
          from: 'usuarios',
          localField: 'autor',
          foreignField: '_id',
          pipeline: [{ $project: { password: 0 } }],
          as: 'autorData',
        },
      },
      { $addFields: { autor: { $arrayElemAt: ['$autorData', 0] } } },
      { $unset: 'autorData' },
      // Populate autores de comentarios
      {
        $lookup: {
          from: 'usuarios',
          localField: 'comentarios.autor',
          foreignField: '_id',
          pipeline: [{ $project: { nombre: 1, apellido: 1, username: 1, imagenPerfil: 1 } }],
          as: 'comentariosAutores',
        },
      },
      // Mapear cada comentario con su autor populado
      {
        $addFields: {
          comentarios: {
            $map: {
              input: '$comentarios',
              as: 'comentario',
              in: {
                $mergeObjects: [
                  '$$comentario',
                  {
                    autor: {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: '$comentariosAutores',
                            as: 'u',
                            cond: { $eq: ['$$u._id', '$$comentario.autor'] },
                          },
                        },
                        0,
                      ],
                    },
                  },
                ],
              },
            },
          },
        },
      },
      { $unset: 'comentariosAutores' },
    ];

    const [publicaciones, total] = await Promise.all([
      this.publicacionModel.aggregate(pipeline),
      this.publicacionModel.countDocuments(filtro),
    ]);

    return { publicaciones, total, offset, limit };
  }

  // ── Eliminar (baja lógica) ─────────────────────────────────────────────────
  async eliminar(
    publicacionId: string,
    usuarioId: string,
    perfil: string,
  ): Promise<{ mensaje: string }> {
    const pub = await this.publicacionModel.findById(publicacionId);
    if (!pub || pub.eliminado) throw new NotFoundException('Publicación no encontrada');

    const esAutor = pub.autor.toString() === usuarioId;
    const esAdmin = perfil === 'administrador';
    if (!esAutor && !esAdmin)
      throw new ForbiddenException('No tenés permiso para eliminar esta publicación');

    pub.eliminado = true;
    await pub.save();
    return { mensaje: 'Publicación eliminada correctamente' };
  }

  // ── Dar Me Gusta ───────────────────────────────────────────────────────────
  async darLike(
    publicacionId: string,
    usuarioId: string,
  ): Promise<{ mensaje: string; likes: number }> {
    const pub = await this.publicacionModel.findOne({
      _id: publicacionId,
      eliminado: false,
    });
    if (!pub) throw new NotFoundException('Publicación no encontrada');

    const uid = new Types.ObjectId(usuarioId);
    const yaLikeó = pub.likes.some((id) => id.toString() === usuarioId);
    if (yaLikeó) throw new BadRequestException('Ya le diste Me Gusta a esta publicación');

    pub.likes.push(uid);
    await pub.save();
    return { mensaje: 'Me Gusta agregado', likes: pub.likes.length };
  }

  // ── Quitar Me Gusta ────────────────────────────────────────────────────────
  async quitarLike(
    publicacionId: string,
    usuarioId: string,
  ): Promise<{ mensaje: string; likes: number }> {
    const pub = await this.publicacionModel.findOne({
      _id: publicacionId,
      eliminado: false,
    });
    if (!pub) throw new NotFoundException('Publicación no encontrada');

    const yaLikeó = pub.likes.some((id) => id.toString() === usuarioId);
    if (!yaLikeó) throw new BadRequestException('No habías dado Me Gusta a esta publicación');

    pub.likes = pub.likes.filter((id) => id.toString() !== usuarioId) as Types.ObjectId[];
    await pub.save();
    return { mensaje: 'Me Gusta eliminado', likes: pub.likes.length };
  }

  // ── Agregar comentario ─────────────────────────────────────────────────────
  async comentar(
    publicacionId: string,
    usuarioId: string,
    dto: AgregarComentarioDto,
  ) {
    const pub = await this.publicacionModel.findOne({
      _id: publicacionId,
      eliminado: false,
    });
    if (!pub) throw new NotFoundException('Publicación no encontrada');

    pub.comentarios.push({
      autor: new Types.ObjectId(usuarioId),
      texto: dto.texto,
      creadoEn: new Date(),
    });
    await pub.save();
    return pub.populate('comentarios.autor', 'nombre apellido username');
  }
}