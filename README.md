# 🛒 Ecommerce Next DeepAgent


npx prisma db push o npx prisma migrate dev




Una aplicación completa de comercio electrónico construida con Next.js 14, TypeScript, Prisma, y PostgreSQL.

## ✨ Características

- 🔐 **Autenticación y Autorización**: Sistema de login/signup seguro con NextAuth y control de acceso basado en roles (ADMIN/CUSTOMER)
- 🛍️ **Gestión de Productos y Categorías**: CRUD completo para productos y categorías
- 🛒 **Carrito de Compras**: Sistema de carrito completamente funcional con actualizaciones en tiempo real
- 💳 **Integración de Pagos**: Integración completa con Stripe para procesamiento de pagos
- 📦 **Panel de Administración**: Dashboard completo con reportes de ventas y gestión de usuarios, productos, categorías y órdenes
- ☁️ **Almacenamiento de Imágenes**: Integración con Cloudinary para optimización y servicio de imágenes
- 📱 **Diseño Responsive**: Interfaz adaptable a todos los dispositivos

## 🚀 Tecnologías

- **Framework**: Next.js 14 (App Router)
- **Lenguaje**: TypeScript
- **Base de Datos**: PostgreSQL
- **ORM**: Prisma
- **Autenticación**: NextAuth.js
- **Pagos**: Stripe
- **Almacenamiento de Imágenes**: Cloudinary
- **Estilos**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **Iconos**: Lucide React
- **Notificaciones**: Sonner

## 📋 Prerequisitos

- Node.js 18.x o superior
- PostgreSQL 14.x o superior
- Cuenta de Stripe (para pagos)
- Cuenta de Cloudinary (para imágenes)
- Yarn (gestor de paquetes)

## 🛠️ Instalación

1. **Clonar el repositorio**

```bash
git clone https://github.com/tu-usuario/ecommerce-next-deepagent.git
cd ecommerce-next-deepagent
```

2. **Instalar dependencias**

```bash
yarn install
```

3. **Configurar variables de entorno**

Copia el archivo `.env.example` a `.env` y configura tus variables:

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus credenciales:

```env
# Database
DATABASE_URL='postgresql://user:password@localhost:5432/ecommerce'

# NextAuth
NEXTAUTH_SECRET=tu-secret-aqui
NEXTAUTH_URL=http://localhost:3000

# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Cloudinary
CLOUDINARY_CLOUD_NAME=tu-cloud-name
CLOUDINARY_API_KEY=tu-api-key
CLOUDINARY_API_SECRET=tu-api-secret
```

4. **Configurar la base de datos**

```bash
# Generar el cliente de Prisma
yarn prisma generate

# Ejecutar migraciones
yarn prisma migrate dev

# Poblar la base de datos con datos iniciales (opcional)
yarn prisma db seed
```

5. **Iniciar el servidor de desarrollo**

```bash
yarn dev
```

La aplicación estará disponible en `http://localhost:3000`

## 👤 Credenciales de Administrador por Defecto

- **Email**: john@doe.com
- **Password**: johndoe123

⚠️ **Importante**: Cambia estas credenciales en producción.

## 🔧 Configuración de Stripe Webhooks

Para que los webhooks de Stripe funcionen en desarrollo:

1. Instala el CLI de Stripe:
```bash
brew install stripe/stripe-cli/stripe
```

2. Inicia sesión:
```bash
stripe login
```

3. Redirige los webhooks:
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

4. Copia el webhook secret que aparece y agrégalo a tu `.env`

## 📦 Scripts Disponibles

```bash
# Desarrollo
yarn dev

# Build de producción
yarn build

# Iniciar servidor de producción
yarn start

# Linting
yarn lint

# Prisma Studio (GUI de base de datos)
yarn prisma studio

# Generar cliente de Prisma
yarn prisma generate

# Ejecutar migraciones
yarn prisma migrate dev
```

## 🏗️ Estructura del Proyecto

```
ecommerce-next-deepagent/
├── app/                    # App Router de Next.js
│   ├── admin/             # Panel de administración
│   ├── api/               # API Routes
│   ├── cart/              # Carrito de compras
│   ├── checkout/          # Proceso de pago
│   ├── login/             # Página de login
│   ├── orders/            # Órdenes de usuario
│   ├── products/          # Páginas de productos
│   └── signup/            # Página de registro
├── components/            # Componentes reutilizables
│   ├── ui/               # Componentes UI de shadcn
│   ├── admin-sidebar.tsx
│   ├── header.tsx
│   └── footer.tsx
├── lib/                   # Utilidades y configuraciones
│   ├── auth-options.ts   # Configuración de NextAuth
│   ├── cloudinary.ts     # Configuración de Cloudinary
│   ├── db.ts             # Cliente de Prisma
│   └── types.ts          # Tipos de TypeScript
├── prisma/               # Esquema de Prisma
│   └── schema.prisma
├── public/               # Archivos estáticos
└── scripts/              # Scripts de utilidades
    └── seed.ts           # Script de seeding
```

## 🔐 Roles de Usuario

- **ADMIN**: Acceso completo al panel de administración
- **CUSTOMER**: Puede navegar productos, agregar al carrito y realizar compras

## 🚀 Despliegue

### Vercel (Recomendado)

1. Haz push de tu código a GitHub
2. Importa el proyecto en [Vercel](https://vercel.com)
3. Configura las variables de entorno
4. Despliega

⚠️ **Recuerda**: Configura el webhook de Stripe con la URL de producción.

## 📝 Licencia

MIT

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue o pull request.

---

**Desarrollado con ❤️ usando Next.js y DeepAgent**