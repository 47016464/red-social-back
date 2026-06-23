# Orbit - Red Social API 🚀
### Trabajo Práctico N°2 - Programación IV

## Augusto Bottazzi

## Descripción
API REST desarrollada con NestJS para la red social Orbit. Maneja autenticación de usuarios, publicaciones y gestión de perfiles.

## Sprint 1 — Backend

### Tecnologías utilizadas
- NestJS
- TypeScript
- MongoDB Atlas (Mongoose)
- JWT (JSON Web Tokens)
- Bcrypt (encriptación de contraseñas)
- Multer (manejo de archivos)
- Class Validator (validación de DTOs)

### Módulos
| Módulo | Descripción |
|---|---|
| `AuthModule` | Registro y login de usuarios |
| `UsuariosModule` | Gestión y consulta de usuarios |
| `PublicacionesModule` | Estructura base para publicaciones |

### Endpoints disponibles

#### Autenticación
| Método | Ruta | Descripción | Status |
|---|---|---|---|
| POST | `/auth/registro` | Registrar nuevo usuario | 201 Created |
| POST | `/auth/login` | Iniciar sesión | 200 OK |

#### POST `/auth/registro`
Body: `multipart/form-data`

nombre         string  requerido

apellido       string  requerido

email          string  requerido, único

username       string  requerido, único

password       string  requerido, mín 8 chars, 1 mayúscula, 1 número

fechaNacimiento string requerido

descripcion    string  opcional

perfil         string  opcional (default: "usuario")

imagenPerfil   file    opcional

## Sprint 2 — Backend

### Nuevos endpoints

#### Publicaciones

| Método | Ruta | Descripción | Auth | Status |
|--------|------|-------------|------|--------|
| GET | /publicaciones | Listar publicaciones | ✅ JWT | 200 OK |
| POST | /publicaciones | Crear publicación | ✅ JWT | 201 Created |
| DELETE | /publicaciones/:id | Eliminar publicación (baja lógica) | ✅ JWT | 200 OK |
| POST | /publicaciones/:id/like | Dar me gusta | ✅ JWT | 200 OK |
| DELETE | /publicaciones/:id/like | Quitar me gusta | ✅ JWT | 200 OK |
| POST | /publicaciones/:id/comentarios | Agregar comentario | ✅ JWT | 201 Created |

#### GET /publicaciones — Parámetros opcionales

| Parámetro | Tipo | Descripción | Default |
|-----------|------|-------------|---------|
| orden | `fecha` \| `likes` | Criterio de ordenamiento | `fecha` |
| offset | number | Desde qué registro paginar | `0` |
| limit | number | Cantidad de resultados | `5` |
| usuarioId | string | Filtrar por autor | — |

#### POST /publicaciones
Body: `multipart/form-data`
- `titulo` string — requerido
- `mensaje` string — requerido
- `imagen` file — opcional

### Nuevas funcionalidades
- Autenticación JWT requerida en todos los endpoints de publicaciones
- Baja lógica de publicaciones (campo `eliminado: true`)
- Un usuario solo puede dar un me gusta por publicación
- Solo el autor o un administrador puede eliminar una publicación
- Ordenamiento por fecha o cantidad de likes via aggregation pipeline
- Paginación con `offset` y `limit`
- Imágenes de publicaciones guardadas en `/uploads/publicaciones/`
