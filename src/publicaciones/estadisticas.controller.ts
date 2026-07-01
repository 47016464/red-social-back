import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from '../usuarios/admin.guard';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Publicacion, PublicacionDocument } from './schemas/publicacion.schema';

@Controller('estadisticas')
@UseGuards(AuthGuard('jwt'), AdminGuard)
export class EstadisticasController {
  constructor(
    @InjectModel(Publicacion.name)
    private publicacionModel: Model<PublicacionDocument>,
  ) {}

  // GET /estadisticas/publicaciones-por-usuario?desde=&hasta=
  @Get('publicaciones-por-usuario')
  async publicacionesPorUsuario(
    @Query('desde') desde?: string,
    @Query('hasta') hasta?: string,
  ) {
    const filtro: any = { eliminado: false };
    if (desde || hasta) {
      filtro.createdAt = {};
      if (desde) filtro.createdAt.$gte = new Date(desde);
      if (hasta) filtro.createdAt.$lte = new Date(hasta + 'T23:59:59');
    }

    const resultado = await this.publicacionModel.aggregate([
      { $match: filtro },
      {
        $lookup: {
          from: 'usuarios',
          localField: 'autor',
          foreignField: '_id',
          pipeline: [{ $project: { nombre: 1, apellido: 1, username: 1 } }],
          as: 'autorData',
        },
      },
      { $addFields: { autor: { $arrayElemAt: ['$autorData', 0] } } },
      {
        $group: {
          _id: '$autor._id',
          nombre: { $first: { $concat: ['$autor.nombre', ' ', '$autor.apellido'] } },
          username: { $first: '$autor.username' },
          cantidad: { $sum: 1 },
        },
      },
      { $sort: { cantidad: -1 } },
    ]);

    return resultado;
  }

  // GET /estadisticas/comentarios-por-tiempo?desde=&hasta=
  @Get('comentarios-por-tiempo')
  async comentariosPorTiempo(
    @Query('desde') desde?: string,
    @Query('hasta') hasta?: string,
  ) {
    const filtro: any = { eliminado: false };
    if (desde || hasta) {
      filtro.createdAt = {};
      if (desde) filtro.createdAt.$gte = new Date(desde);
      if (hasta) filtro.createdAt.$lte = new Date(hasta + 'T23:59:59');
    }

    const resultado = await this.publicacionModel.aggregate([
      { $match: filtro },
      { $unwind: { path: '$comentarios', preserveNullAndEmptyArrays: false } },
      ...(desde || hasta ? [{
        $match: {
          ...(desde ? { 'comentarios.creadoEn': { $gte: new Date(desde) } } : {}),
          ...(hasta ? { 'comentarios.creadoEn': { $lte: new Date(hasta + 'T23:59:59') } } : {}),
        }
      }] : []),
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$comentarios.creadoEn' } },
          cantidad: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { fecha: '$_id', cantidad: 1, _id: 0 } },
    ]);

    return resultado;
  }

  // GET /estadisticas/comentarios-por-publicacion?desde=&hasta=
  @Get('comentarios-por-publicacion')
  async comentariosPorPublicacion(
    @Query('desde') desde?: string,
    @Query('hasta') hasta?: string,
  ) {
    const filtro: any = { eliminado: false };
    if (desde || hasta) {
      filtro.createdAt = {};
      if (desde) filtro.createdAt.$gte = new Date(desde);
      if (hasta) filtro.createdAt.$lte = new Date(hasta + 'T23:59:59');
    }

    const resultado = await this.publicacionModel.aggregate([
      { $match: filtro },
      {
        $project: {
          titulo: 1,
          totalComentarios: { $size: '$comentarios' },
        },
      },
      { $sort: { totalComentarios: -1 } },
      { $limit: 10 },
    ]);

    return resultado;
  }
}