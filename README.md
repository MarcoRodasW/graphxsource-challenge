# GraphXSource Challenge - E-Commerce Backend API

API backend para gestión de órdenes y productos, construido con NestJS, TypeScript, PostgreSQL y Prisma.

## Arquitectura

Este proyecto implementa **Domain-Driven Design (DDD)** con una clara separación de responsabilidades en capas:

```
src/
├── common/                    # Utilidades y servicios compartidos
│   ├── filters/              # Filtros de excepciones
│   ├── interceptors/         # Interceptores de respuesta
│   ├── pipes/               # Pipes de validación personalizados
│   ├── services/            # Servicios compartidos (PrismaService)
│   └── types/               # Definiciones de tipos comunes
├── orders/                   # Módulo de dominio Orders
│   ├── application/         # Casos de uso y lógica de negocio
│   ├── domain/              # Interfaces y contratos del dominio
│   ├── infrastructure/      # Implementaciones de repositorios
│   └── interface/           # Controladores y DTOs
└── products/                # Módulo de dominio Products
    ├── application/
    ├── domain/
    ├── infrastructure/
    └── interface/
```

### Capas de DDD

- **Domain Layer**: Define las interfaces y contratos del negocio (repositorios, entidades)
- **Application Layer**: Contiene los casos de uso y la lógica de negocio
- **Infrastructure Layer**: Implementa los detalles técnicos (acceso a base de datos, APIs externas)
- **Interface Layer**: Expone la funcionalidad a través de controladores REST y DTOs

## Razon de la Implementación:

Primera vez implementando DDD, quise tomarlo con un reto para aprender.

## Patrones de Diseño

### Factory Pattern

Se utiliza el patrón Factory para la creación de productos, permitiendo instanciar diferentes tipos de productos (T-shirts, Mugs, Posters) de manera flexible y extensible:

```typescript
// Cada tipo de producto tiene atributos específicos
- T-shirts: size, color
- Mugs: capacity, color
- Posters: dimensions, material
```

## Razon de la Implementación:

Al presentarse la situacion de la Tabla de Producto con distintos tipos, y cada uno con sus atributos correspondientes pensé en usar la separción de Tablas por tipo de producto. Usar el patrón de Factoria tambien fue aprendizaje ya que era primera vez implemtandolo.

### Repository Pattern

Abstrae el acceso a datos mediante interfaces en la capa de dominio e implementaciones en la capa de infraestructura, facilitando el testing y el cambio de fuentes de datos.

### Dependency Injection

NestJS proporciona un contenedor IoC que gestiona las dependencias entre módulos, servicios y repositorios.

## Diagrama de Base de Datos

![Database Diagram](https://drive.google.com/file/d/1IYPdQ3b7Oj6UspOGp5ds5KxM_BP8RqtL/view?usp=sharing)

[Ver diagrama completo](https://drive.google.com/file/d/1IYPdQ3b7Oj6UspOGp5ds5KxM_BP8RqtL/view?usp=sharing)

## Stack Tecnológico

- **Framework**: NestJS con TypeScript
- **Base de Datos**: PostgreSQL
- **ORM**: Prisma
- **Validación**: Zod + nestjs-zod
- **Testing**: Jest
- **Package Manager**: pnpm

## Instrucciones de Instalación

### Prerrequisitos

- Node.js (v18 o superior)
- pnpm (v8 o superior)
- PostgreSQL (v14 o superior)

### Instalación

1. Clonar el repositorio:

```bash
git clone <repository-url>
cd <project-directory>
```

2. Instalar dependencias:

```bash
pnpm install
```

3. Configurar variables de entorno:

Crear un archivo `.env.local` en la raíz del proyecto:

```env
DATABASE_URL=""
PORT=3000
```

4. Ejecutar migraciones de base de datos:

```bash
pnpm run prisma-migrate:dev
```

```bash
pnpm run prisma-seed
```

5. Generar el cliente de Prisma:

```bash
pnpm run prisma:generate
```

### Ejecución

```bash
# Modo desarrollo con hot-reload
pnpm run start:dev

# Modo producción
pnpm run build
pnpm run start:prod

# Modo debug
pnpm run start:debug
```

La API estará disponible en `http://localhost:3000`

## Comandos Disponibles

### Desarrollo

```bash
pnpm install                    # Instalar dependencias
pnpm run start:dev             # Iniciar servidor en modo desarrollo
pnpm run start:debug           # Iniciar con debugging habilitado
```

### Base de Datos

```bash
pnpm run prisma-migrate:dev    # Ejecutar migraciones en desarrollo
pnpm run prisma-seed          # Ejecutar seeders
pnpm run prisma:generate       # Generar cliente de Prisma
```

### Calidad de Código

```bash
pnpm run lint                  # Ejecutar ESLint con auto-fix
pnpm run format               # Formatear código con Prettier
```

### Testing

```bash
pnpm run test                 # Ejecutar tests unitarios
pnpm run test:watch          # Tests en modo watch
pnpm run test:e2e            # Tests end-to-end
pnpm run test:cov            # Tests con cobertura
```

## Características Principales

- Gestión completa de órdenes (CRUD)
- Sistema de productos multi-tipo con Factory Pattern
- Workflow de estados de orden: RECEIVED → PROCESSING → APPROVED → IN_PRODUCTION → SHIPPED → DELIVERED
- Validación robusta con Zod
- Arquitectura limpia y escalable con DDD
- Type-safety completo con TypeScript
- Documentación automática con OpenAPI/Swagger
