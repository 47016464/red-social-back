import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Usuario, UsuarioDocument } from './schemas/usuario.schema';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectModel(Usuario.name) private usuarioModel: Model<UsuarioDocument>
  ) {}

  async crear(datos: Partial<Usuario>): Promise<UsuarioDocument> {
    const existe = await this.usuarioModel.findOne({
      $or: [{ email: datos.email }, { username: datos.username }]
    });
    if (existe) throw new ConflictException('El email o nombre de usuario ya está en uso');
    const nuevo = new this.usuarioModel(datos);
    return nuevo.save();
  }

  async buscarPorEmailOUsername(identifier: string): Promise<UsuarioDocument | null> {
    return this.usuarioModel.findOne({
      $or: [{ email: identifier }, { username: identifier }]
    });
  }

  async buscarPorId(id: string): Promise<UsuarioDocument | null> {
    return this.usuarioModel.findById(id).select('-password');
  }

  async listar(): Promise<UsuarioDocument[]> {
    return this.usuarioModel.find().select('-password').sort({ createdAt: -1 });
  }

  async deshabilitar(id: string): Promise<{ mensaje: string }> {
    const usuario = await this.usuarioModel.findById(id);
    if (!usuario) throw new NotFoundException('Usuario no encontrado');
    usuario.habilitado = false;
    await usuario.save();
    return { mensaje: 'Usuario deshabilitado correctamente' };
  }

  async habilitar(id: string): Promise<{ mensaje: string }> {
    const usuario = await this.usuarioModel.findById(id);
    if (!usuario) throw new NotFoundException('Usuario no encontrado');
    usuario.habilitado = true;
    await usuario.save();
    return { mensaje: 'Usuario habilitado correctamente' };
  }

  async actualizar(id: string, datos: { nombre?: string; apellido?: string; descripcion?: string; imagenPerfil?: string }): Promise<UsuarioDocument | null> {
    return this.usuarioModel
      .findByIdAndUpdate(id, { $set: datos }, { new: true })
      .select('-password');
  }
}