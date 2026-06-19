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

