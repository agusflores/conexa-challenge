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
| **Render**          | Plataforma de deployment (servidor)                                 |
| **Neon**            | Base de datos PostgreSQL en la nube                                 |

---

## 📁 Estructura del Proyecto

```
conexa-challenge/
├── prisma/
│   ├── schema.prisma
│   └── insert-admin.seed.ts
├── src/
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   ├── guards/
│   │   ├── decorators/
│   │   ├── strategies/
│   │   ├── dto/
│   │   └── interfaces/
│   ├── common/
│   │   └── filters/
│   │       ├── http-exception.filter.ts
│   │       └── prisma-exception.filter.ts
│   ├── domain/
│   │   ├── film/
│   │   │   ├── controllers/
│   │   │   │   └── film.controller.ts
│   │   │   ├── services/
│   │   │   │   └── film.service.ts
│   │   │   ├── repositories/
│   │   │   │   └── film.repository.ts
│   │   │   ├── dto/
│   │   │   │   ├── create-film.dto.ts
│   │   │   │   └── update-film.dto.ts
│   │   │   └── film.module.ts
│   │   └── user/
│   │       ├── controllers/
│   │       │   └── user.controller.ts
│   │       ├── services/
│   │       │   └── user.service.ts
│   │       ├── repositories/
│   │       │   └── user.repository.ts
│   │       └── user.module.ts
│   ├── integration/
│   │   └── swapi/
│   ├── shared/
│   │   └── prisma/
│   ├── main.ts
│   └── app.module.ts
├── docker-compose.yml
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🔧 Configuración del Entorno

### 1. Variables de Entorno

Crear archivo `.env` en la raíz del proyecto:

```env
# Base de datos (PostgreSQL)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/challenge_db?schema=public"

# JWT (Secret para firmar tokens)
JWT_SECRET="tu-secret-jwt"

# SWAPI (URL base de la API externa de Star Wars)
SWAPI_BASE_URL="https://www.swapi.tech/api"
```

### 2. Levantar PostgreSQL con Docker

```bash
# Iniciar el contenedor de PostgreSQL
docker-compose up -d

# Verificar que esté corriendo
docker-compose ps
```

### 3. Instalar dependencias e inicializar base de datos

```bash
# Instalar dependencias
npm install

# Generar cliente de Prisma
npx prisma generate

# Ejecutar migraciones (crear tablas)
npx prisma migrate dev --name init

# Ejecutar seed (crear usuario admin)
npx prisma db seed
```

---

## 🚀 Cómo Ejecutar el Proyecto

### Desarrollo (con hot-reload)

```bash
npm run start:dev
```

La API estará disponible en: http://localhost:3000

### Producción

```bash
# Compilar
npm run build

# Ejecutar
npm run start:prod
```

---

## 🔐 Sistema de Autenticación y Autorización

### Flujo de Autenticación

1. **Registro**: El usuario se registra con username y password
2. **Login**: El usuario inicia sesión y recibe un token JWT
3. **Acceso**: Las requests autenticadas incluyen el token en el header: `Authorization: Bearer <token>`

### Roles de Usuario

| Rol      | Descripción                              |
| -------- | ---------------------------------------- |
| ADMIN    | Acceso completo a todos los endpoint     |
| REGULAR  | Acceso limitado solo a lectura           |

### Componentes de Seguridad

- **JwtAuthGuard**: Valida que el token JWT sea válido
- **RolesGuard**: Verifica que el usuario tenga el rol requerido
- **Roles Decorator**: Define qué roles pueden acceder a cada endpoint

### Usuario Admin por Defecto

El seed crea un usuario admin automáticamente:

- **Username**: admin
- **Password**: admin12345
- **Rol**: ADMIN

---

## 📌 Endpoints de la API

Todos los endpoints tienen el prefijo: `/api`

### Documentación Interactiva

Accedé a Swagger en: http://localhost:3000/docs

### Autenticación (Públicos)

| Método | Endpoint                    | Descripción              |
| ------ | --------------------------- | ------------------------ |
| POST   | `/api/auth/register`        | Registrar nuevo usuario |
| POST   | `/api/auth/login`           | Iniciar sesión           |

**Ejemplo: Registro**

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "juan", "password": "password123"}'
```

**Ejemplo: Login**

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin12345"}'
```

**Respuesta:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Películas (Protegidos - Requieren JWT)

| Método | Endpoint           | Descripción                    | Rol requerido |
| ------ | ------------------ | ------------------------------ | ------------- |
| GET    | `/api/films`       | Listar todas las películas     | REGULAR, ADMIN|
| GET    | `/api/films/:id`   | Obtener una película por ID   | REGULAR, ADMIN|
| POST   | `/api/films`       | Crear una nueva película       | ADMIN         |
| PUT    | `/api/films/:id`   | Actualizar una película        | ADMIN         |
| DELETE | `/api/films/:id`   | Eliminar una película          | ADMIN         |
| POST   | `/api/films/sync`  | Sincronizar con SWAPI          | ADMIN         |

**Ejemplo: Listar películas (con token)**

```bash
curl -X GET http://localhost:3000/api/films \
  -H "Authorization: Bearer <TU_TOKEN_JWT>"
```

**Ejemplo: Sincronizar con SWAPI (solo ADMIN)**

```bash
curl -X POST http://localhost:3000/api/films/sync \
  -H "Authorization: Bearer <TU_TOKEN_JWT>"
```

### Usuarios (Protegidos - Solo ADMIN)

| Método | Endpoint           | Descripción                    | Rol requerido |
| ------ | ------------------ | ------------------------------ | ------------- |
| GET    | `/api/users`       | Listar todos los usuarios     | ADMIN         |
| GET    | `/api/users/:id`   | Obtener un usuario por ID     | ADMIN         |

**Ejemplo: Listar usuarios (solo ADMIN)**

```bash
curl -X GET http://localhost:3000/api/users \
  -H "Authorization: Bearer <TU_TOKEN_JWT>"
```

---

## 🔗 Integración con SWAPI

La aplicación se integra con la API pública de Star Wars: https://www.swapi.tech

### Qué hace el endpoint `/films/sync`:

1. Consigue la lista de todas las películas de SWAPI
2. Para cada película, obtiene los detalles completos
3. Upsert (inserta o actualiza) cada película en la base de datos local
4. Usa el campo `externalId` para relacionar los registros con la fuente externa

---

## 💾 Modelo de Datos

### Tabla: User

| Campo     | Tipo      | Descripción                |
| --------- | --------- | -------------------------- |
| id        | UUID      | Identificador único        |
| username  | String    | Nombre de usuario (único)  |
| password  | String    | Contraseña hasheada        |
| role      | Enum      | Rol del usuario            |
| createdAt | DateTime  | Fecha de creación          |

### Tabla: Film

| Campo        | Tipo      | Descripción                    |
| ------------ | --------- | ------------------------------ |
| id           | UUID      | Identificador único            |
| title        | String    | Título de la película          |
| episodeId    | Int       | Número de episodio             |
| director     | String    | Director                       |
| producer     | String    | Productor/es                   |
| releaseDate  | DateTime  | Fecha de lanzamiento           |
| openingCrawl | Text      | Texto de apertura              |
| externalId   | String?   | ID externo de SWAPI            |
| createdAt    | DateTime  | Fecha de creación              |
| updatedAt    | DateTime  | Fecha de última actualización  |

---

## ✅ Tests

```bash
# Ejecutar todos los tests
npm run test

# Ejecutar tests con coverage
npm run test:cov

# Ejecutar tests e2e
npm run test:e2e
```

---

## ☁️ Deployment en Render

El proyecto está configurado para deploy en **Render** utilizando **Neon** como base de datos.

### Render

Render es una plataforma de cloud que permite deployar aplicaciones backend de forma gratuita y escalable.

1. Crear un servicio en Render:
   - Ir a https://render.com
   - Crear un nuevo "Web Service"
   - Conectar con el repositorio de GitHub
   - Configurar:
     - **Build Command**: `npm run build`
     - **Start Command**: `npm run start:prod`

2. Variables de entorno en Render:

   - **DATABASE_URL**: Connection string de Neon
   - **JWT_SECRET**: Secret para JWT
   - **SWAPI_BASE_URL**: https://www.swapi.tech/api

### Neon (Base de datos)

Neon es una base de datos PostgreSQL serverless en la nube.

1. Crear cuenta en https://neon.tech
2. Crear un nuevo proyecto
3. Copiar la connection string y configurarla en:
   - Archivo `.env` local (para desarrollo)
   - Variables de entorno de Render (para producción)

---

## 📝 Decisiones de Diseño

1. **Patrón Repository**: Separation of concerns con FilmRepository y UserRepository para operaciones de base de datos.
2. **Módulo Global de Prisma**: PrismaService está disponible en toda la aplicación sin necesidad de imports explícitos.
3. **ValidationPipe global**: Se validan todos los DTOs automáticamente con `whitelist: true` para ignorar propiedades no definidas.
4. **Exception Filters**: Filtros globales para manejo estandarizado de errores HTTP y de Prisma.
5. **DTOs con class-validator**: Validación de entrada declarativa y documentación automática con Swagger.
6. **Roles como Decoradores**: Uso de decoradores TypeScript para definir permisos a nivel de controlador.
7. **Domain-Driven Design**: Estructura organizada por dominios (film, user) con controllers, services y repositories separados.

---

## 📄 Licencia

MIT