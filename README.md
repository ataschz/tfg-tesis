# getcontract - Plataforma de Gestión de Contratos y Pagos

Una plataforma moderna y segura para gestionar contratos y pagos internacionales para equipos remotos. Simplifica la gestión de contratos, garantiza pagos seguros y automatiza el cumplimiento normativo.

## 🚀 Características Principales

- **Contratos Inteligentes**: Generación y gestión de contratos con plantillas personalizables
- **Pagos Seguros**: Sistema de depósito en garantía (escrow) para pagos internacionales
- **Multi-moneda**: Soporte para múltiples monedas incluyendo cripto
- **Gestión de Disputas**: Sistema integrado de resolución de disputas
- **Cumplimiento Global**: Automatización de cumplimiento normativo internacional
- **Panel Unificado**: Vista unificada para empresas y contratistas

## 🛠️ Tecnologías

- **Frontend**: Next.js 13 (App Router)
- **Estilos**: Tailwind CSS + shadcn/ui
- **Formularios**: React Hook Form + Zod
- **Estado**: React Context + Server Actions
- **UI/UX**: Lucide Icons + Custom Components
- **Fecha/Hora**: date-fns
- **Tipos**: TypeScript

## 📁 Estructura del Proyecto

```
getcontract/
├── app/                    # App Router de Next.js
│   ├── (admin)/           # Rutas del panel admin
│   ├── (auth)/            # Rutas de autenticación
│   ├── dashboard/         # Panel principal
│   └── layout.tsx         # Layout principal
├── components/            # Componentes React
│   ├── admin/            # Componentes admin
│   ├── auth/             # Componentes auth
│   ├── company/          # Componentes empresa
│   ├── contractor/       # Componentes contratista
│   ├── ui/              # Componentes UI base
│   └── unified/         # Componentes compartidos
├── lib/                  # Utilidades y lógica
│   ├── actions/         # Server Actions
│   ├── data/           # Datos mock
│   └── types/          # TypeScript types
└── public/              # Archivos estáticos
```

## 🚦 Requisitos Previos

- Node.js 18.0.0 o superior
- npm o pnpm

## 🛠️ Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/tu-usuario/getcontract.git
cd getcontract
```

2. Instala las dependencias:
```bash
npm install
# o
pnpm install
```

3. Copia el archivo de variables de entorno:
```bash
cp .env.example .env
```

4. Inicia el servidor de desarrollo:
```bash
npm run dev
# o
pnpm dev
```

La aplicación estará disponible en `http://localhost:3000`

## 📦 Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm start` - Inicia la aplicación en modo producción
- `npm run lint` - Ejecuta el linter
- `npm run test` - Ejecuta las pruebas

## 🔐 Autenticación

El sistema incluye dos tipos de usuarios:

- **Empresas**: Pueden crear contratos y gestionar pagos
- **Contratistas**: Pueden aceptar contratos y recibir pagos

Para probar la aplicación, usa las siguientes credenciales:

```
Empresa:
Email: company@example.com
Password: test123

Contratista:
Email: contractor@example.com
Password: test123
```

## 🌍 Despliegue

La aplicación está optimizada para despliegue en plataformas como:

- Vercel (recomendado)
- Netlify
- AWS Amplify

## 🤝 Contribuir

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/amazing-feature`)
3. Commit tus cambios (`git commit -m 'Add amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📧 Contacto

Ata Herrera - [@ataherrera](https://twitter.com/ataherrera)

Link del Proyecto: [https://github.com/tu-usuario/getcontract](https://github.com/tu-usuario/getcontract)