# Backend Challenge - Conexa

REST API desarrollada con NestJS para la gestión de películas de Star Wars, incluyendo autenticación JWT, autorización por roles e integración con la API externa SWAPI.

## 🛠️ Stack Tecnológico

| Tecnología          | Descripción                                                         |
| ------------------- | ------------------------------------------------------------------- |
| **NestJS**          | Framework de Node.js para construir aplicaciones backend escalables |
| **TypeScript**      | Lenguaje de programación con tipado estático                        |
| **PostgreSQL**      | Base de datos relacional                                            |
| **Prisma**          | ORM para PostgreSQL con migrations y seed                           |
| **Docker Compose**  | Contenedor para PostgreSQL                                          |
| **JWT + Passport**  | Sistema de autenticación basado en tokens                           |
| **Swagger/OpenAPI** | Documentación interactiva de la API                                 |
| **class-validator** | Validación de DTOs                                                  |

---

## 📁 Estructura del Proyecto

conexa-challenge/
├── api/ # Handler para Vercel
│ └── index.ts
├── prisma/
│ ├── schema.prisma # Modelo de datos
│ └── insert-admin.seed.ts # Seed para crear usuario admin
├── src/
│ ├── auth/ # Módulo de autenticación
│ │ ├── auth.controller.ts
│ │ ├── auth.service.ts
│ │ ├── auth.module.ts
│ │ ├── guards/ # JwtAuthGuard, RolesGuard
│ │ ├── decorators/ # Roles decorator
│ │ ├── strategies/ # JWT Strategy
│ │ ├── dto/ # SignUpDTO, SignInDTO
│ │ └── interfaces/ # JwtPayload
│ ├── film/ # Módulo de películas
│ │ ├── film.controller.ts
│ │ ├── film.service.ts
│ │ ├── film.module.ts
│ │ └── dto/ # CreateFilmDTO, UpdateFilmDTO
│ ├── integration/
│ │ └── swapi/ # Integración con SWAPI externa
│ ├── shared/
│ │ └── prisma/ # PrismaService global
│ ├── main.ts # Entry point de la aplicación
│ └── app.module.ts # Módulo raíz
├── docker-compose.yml # PostgreSQL container
├── package.json
├── tsconfig.json
├── vercel.json # Configuración para Vercel
└── README.md

---

## 🔧 Configuración del Entorno

### 1. Variables de Entorno

Crear archivo `.env` en la raíz del proyecto:

```env
# Base de datos (PostgreSQL)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/challenge_db?schema=public"
# JWT (Secret para firmar tokens)
JWT_SECRET="tu-secret-jwt-aqui"
# SWAPI (URL base de la API externa de Star Wars)
SWAPI_BASE_URL="https://www.swapi.tech/api"
2. Levantar PostgreSQL con Docker
# Iniciar el contenedor de PostgreSQL
docker-compose up -d
# Verificar que esté corriendo
docker-compose ps
3.安装 dependencias e inicializar base de datos
# Instalar dependencias
npm install
# Generar cliente de Prisma
npx prisma generate
# Ejecutar migraciones (crear tablas)
npx prisma migrate dev --name init
# Ejecutar seed (crear usuario admin)
npx prisma db seed
🚀 Cómo Ejecutar el Proyecto
Desarrollo (con hot-reload)
npm run start:dev
La API estará disponible en: http://localhost:3000
Producción
# Compilar
npm run build
# Ejecutar
npm run start:prod
🔐 Sistema de Autenticación y Autorización
Flujo de Autenticación
1. Registro: El usuario se registra con username y password
2. Login: El usuario inicia sesión y recibe un token JWT
3. Acceso: Las requests autenticadas incluyen el token en el header: Authorization: Bearer <token>
Roles de Usuario
Rol
ADMIN
REGULAR
Componentes de Seguridad
- JwtAuthGuard: Valida que el token JWT sea válido
- RolesGuard: Verifica que el usuario tenga el rol requerido
- Roles Decorator: Define qué roles pueden acceder a cada endpoint
Usuario Admin por Defecto
El seed crea un usuario admin automáticamente:
- Username: admin
- Password: admin12345
- Rol: ADMIN
📌 Endpoints de la API
Todos los endpoints tienen el prefijo: /api
Documentación Interactiva
Accedé a Swagger en: http://localhost:3000/docs
Autenticación (Públicos)
Método
POST
POST
Ejemplo: Registro
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "juan", "password": "password123"}'
Ejemplo: Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin12345"}'
Respuesta:
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
Películas (Protegidos - Requieren JWT)
Método
GET
GET
POST
PUT
DELETE
POST
Ejemplo: Listar películas (con token)
curl -X GET http://localhost:3000/api/films \
  -H "Authorization: Bearer <TU_TOKEN_JWT>"
Ejemplo: Crear película (solo ADMIN)
curl -X POST http://localhost:3000/api/films \
  -H "Authorization: Bearer <TU_TOKEN_JWT>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "A New Hope",
    "episodeId": 4,
    "director": "George Lucas",
    "producer": "Gary Kurtz, Rick McCallum",
    "openingCrawl": "It is a period of civil war...",
    "releaseDate": "1977-05-25"
  }'
Ejemplo: Sincronizar con SWAPI (solo ADMIN)
curl -X POST http://localhost:3000/api/films/sync \
  -H "Authorization: Bearer <TU_TOKEN_JWT>"
🔗 Integración con SWAPI
La aplicación se integra con la API pública de Star Wars: https://www.swapi.tech
Qué hace el endpoint /films/sync:
1. Consigue la lista de todas las películas de SWAPI
2. Para cada película, obtiene los detalles completos
3. Upsert (inserta o actualiza) cada película en la base de datos local
4. Usa el campo externalId para relacionar los registros con la fuente externa
¿Por qué SWAPI?
- Es una API pública y gratuita de Star Wars
- Permite sincronizar datos externos a nuestra base de datos local
- Es un ejemplo de integración con APIs externas en tiempo real
💾 Modelo de Datos
Tabla: User
Campo
id
username
password
role
createdAt
Tabla: Film
Campo
id
title
episodeId
director
producer
releaseDate
openingCrawl
externalId
createdAt
updatedAt
✅ Tests
# Ejecutar todos los tests
npm run test
# Ejecutar tests con coverage
npm run test:cov
# Ejecutar tests e2e
npm run test:e2e
☁️ Deployment en Vercel
El proyecto está configurado para deploy en Vercel con handler serverless.
Archivos de configuración:
- vercel.json: Define el build y las rutas
- api/index.ts: Handler de Vercel para NestJS
Variables de entorno en Vercel:
Configurá en el dashboard de Vercel:
- DATABASE_URL: Connection string de Neon/Supabase
- JWT_SECRET: Secret para JWT
- SWAPI_BASE_URL: https://www.swapi.tech/api
📝 Decisiones de Diseño
1. Módulo Global de Prisma: PrismaService está disponible en toda la aplicación sin necesidad de imports explícitos.
2. ValidationPipe global: Se validan todos los DTOs automáticamente con whitelist: true para ignorar propiedades no definidas.
3. Patrón Repository: FilmService usa directamente PrismaClient para operaciones de base de datos (en proyectos más grandes, separaríamos en repository).
4. DTOs con class-validator: Validación de entrada declarativa y documentación automática con Swagger.
5. Roles como Decoradores: Uso de decoradores TypeScript para definir permisos a nivel de controlador.
📄 Licencia
MIT
```
