# Orbit - Red Social API 🚀
### Trabajo Práctico N°2 - Programación IV

## Augusto Bottazzi

## Descripción
API REST desarrollada con NestJS para la red social Orbit. Maneja autenticación de usuarios, publicaciones, comentarios y gestión de perfiles.

---

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

### Endpoints

#### Autenticación
| Método | Ruta | Descripción | Status |
|---|---|---|---|
| POST | `/auth/registro` | Registrar nuevo usuario | 201 Created |
| POST | `/auth/login` | Iniciar sesión | 200 OK |

##### POST `/auth/registro` — Body: `multipart/form-data`
| Campo | Tipo | Requerido |
|---|---|---|
| nombre | string | ✅ |
| apellido | string | ✅ |
| email | string, único | ✅ |
| username | string, único | ✅ |
| password | string, mín 8 chars, 1 mayúscula, 1 número | ✅ |
| fechaNacimiento | string | ✅ |
| descripcion | string | ❌ |
| perfil | string (default: "usuario") | ❌ |
| imagenPerfil | file | ❌ |

---

## Sprint 2 — Backend

### Nuevas tecnologías
- Cloudinary (almacenamiento de imágenes en la nube)
- Passport JWT (autenticación por token en rutas protegidas)
- Streamifier (upload de imágenes via stream)

### Módulo Publicaciones

#### Endpoints
| Método | Ruta | Descripción | Auth | Status |
|---|---|---|---|---|
| GET | `/publicaciones` | Listar publicaciones | ✅ JWT | 200 OK |
| POST | `/publicaciones` | Crear publicación | ✅ JWT | 201 Created |
| DELETE | `/publicaciones/:id` | Eliminar publicación (baja lógica) | ✅ JWT | 200 OK |
| POST | `/publicaciones/:id/like` | Dar me gusta | ✅ JWT | 200 OK |
| DELETE | `/publicaciones/:id/like` | Quitar me gusta | ✅ JWT | 200 OK |
| POST | `/publicaciones/:id/comentarios` | Agregar comentario | ✅ JWT | 201 Created |

#### GET `/publicaciones` — Query params
| Parámetro | Tipo | Descripción | Default |
|---|---|---|---|
| orden | `fecha` \| `likes` | Criterio de ordenamiento | `fecha` |
| offset | number | Desde qué registro paginar | `0` |
| limit | number | Cantidad de resultados | `5` |
| usuarioId | string | Filtrar por autor | — |

#### Módulo Usuarios
| Método | Ruta | Descripción | Auth | Status |
|---|---|---|---|---|
| PUT | `/usuarios/:id` | Editar perfil | ✅ JWT | 200 OK |

---

## Sprint 3 — Backend

### Módulo Autenticación — nuevos endpoints
| Método | Ruta | Descripción | Auth | Status |
|---|---|---|---|---|
| POST | `/auth/autorizar` | Valida el token actual | ✅ JWT | 200 OK / 401 |
| POST | `/auth/refrescar` | Genera un nuevo token (15 min) | ✅ JWT | 200 OK |

- El token **vence a los 15 minutos**
- El payload incluye: `sub` (id), `username`, `perfil` (rol)
- `/auth/autorizar` devuelve 401 si el token es inválido o expiró
- `/auth/refrescar` devuelve un nuevo token con los mismos datos del usuario

### Módulo Publicaciones — nuevos endpoints
| Método | Ruta | Descripción | Auth | Status |
|---|---|---|---|---|
| GET | `/publicaciones/:id` | Obtener publicación con comentarios paginados | ✅ JWT | 200 OK |

#### GET `/publicaciones/:id` — Query params
| Parámetro | Tipo | Descripción | Default |
|---|---|---|---|
| commentOffset | number | Desde qué comentario paginar | `0` |
| commentLimit | number | Cantidad de comentarios | `3` |

### Módulo Comentarios (controller separado)
| Método | Ruta | Descripción | Auth | Status |
|---|---|---|---|---|
| GET | `/publicaciones/:id/comentarios` | Listar comentarios paginados | ✅ JWT | 200 OK |
| POST | `/publicaciones/:id/comentarios` | Agregar comentario | ✅ JWT | 201 Created |
| PUT | `/publicaciones/:id/comentarios/:comentarioId` | Editar comentario propio | ✅ JWT | 200 OK |

- Los comentarios se devuelven ordenados **más recientes primero**
- Al editar un comentario se marca con `editado: true` y `editadoEn: Date`
- Solo el autor del comentario puede editarlo

### Instalación y uso

```bash
# Clonar el repositorio
git clone https://github.com/47016464/red-social-back.git
cd red-social-back

# Instalar dependencias
npm install

# Correr en desarrollo
npm run start:dev

# El servidor estará disponible en http://localhost:3000
```

### Variables de entorno (Railway)
| Variable | Descripción |
|---|---|
| `PORT` | Puerto del servidor (Railway lo asigna automáticamente) |
| `CLOUDINARY_CLOUD_NAME` | Nombre del cloud en Cloudinary |
| `CLOUDINARY_API_KEY` | API Key de Cloudinary |
| `CLOUDINARY_API_SECRET` | API Secret de Cloudinary |

### Deploy
El backend está deployado en Railway:
🔗 https://red-social-back-production.up.railway.app

### Ramas
| Rama | Descripción |
|---|---|
| `main` | Versión actual en producción |
| `sprint-1` | Snapshot de entrega del Sprint 1 |
| `sprint-2` | Snapshot de entrega del Sprint 2 |
| `sprint-3` | Snapshot de entrega del Sprint 3 |