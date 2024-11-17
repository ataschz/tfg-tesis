# Payroll Platform

Una plataforma moderna para gestionar pagos internacionales a equipos remotos.

## Requisitos Previos

- Node.js 18.0.0 o superior
- PNPM 8.0.0 o superior

## ¿Por qué PNPM?

PNPM es un gestor de paquetes más rápido y eficiente que NPM. Utiliza un almacenamiento compartido para todos los paquetes, lo que ahorra espacio en disco y acelera las instalaciones. [Más información sobre PNPM](https://pnpm.io/).

## Instalación

1. Instala PNPM si aún no lo tienes:

   ```bash
   npm install -g pnpm
   ```

2. Clona el repositorio:

   ```bash
   git clone https://github.com/tu-usuario/payroll-platform.git
   cd payroll-platform
   ```

3. Instala las dependencias:

   ```bash
   pnpm install
   ```

4. Copia el archivo de variables de entorno:

   ```bash
   cp .env.example .env
   ```

5. Configura las variables de entorno en el archivo `.env`

6. Inicia el servidor de desarrollo:
   ```bash
   pnpm dev
   ```

## Scripts Disponibles

- `pnpm dev` - Inicia el servidor de desarrollo
- `pnpm build` - Construye la aplicación para producción
- `pnpm start` - Inicia la aplicación en modo producción
- `pnpm lint` - Ejecuta el linter
- `pnpm test` - Ejecuta las pruebas
