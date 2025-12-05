# 📚 GIMPA Platform - Documentación del Proyecto

## 🎯 Descripción General

**GIMPA Platform** es un sistema integral de gestión académica diseñado para instituciones educativas. Permite la administración de matrículas, notas, estudiantes, pagos y boletines académicos con diferentes roles de usuario (coordinadora, profesor, estudiante).

## 🏗️ Arquitectura Tecnológica

### Stack Principal
- **Frontend Framework**: React 18.3.1 con TypeScript
- **Build Tool**: Vite 5.4.19
- **Routing**: React Router DOM 6.30.1
- **Styling**: Tailwind CSS 3.4.17 + DaisyUI 5.1.27
- **UI Components**: Radix UI + shadcn/ui
- **State Management**: React Context API + TanStack Query 5.83.0
- **Forms**: React Hook Form 7.61.1 + Zod 3.25.76

### Herramientas de Desarrollo
- **Linting**: ESLint 9.32.0
- **TypeScript**: 5.8.3
- **Hot Reload**: Vite con React SWC
- **Component Tagging**: Lovable Tagger (desarrollo)

## 📁 Estructura del Proyecto

```
gimpa-platform/
├── 📄 package.json              # Configuración de dependencias y scripts
├── 📄 components.json           # Configuración de shadcn/ui
├── 📄 index.html               # Punto de entrada HTML
├── 📄 tailwind.config.ts       # Configuración de Tailwind CSS
├── 📄 vite.config.ts           # Configuración de Vite
└── 📁 src/                     # Código fuente principal
    ├── 📄 main.tsx             # Punto de entrada de React
    ├── 📄 App.tsx              # Componente raíz con routing
    ├── 📄 index.css            # Estilos globales y variables CSS
    ├── 📄 App.css              # Estilos específicos del App
    ├── 📄 vite-env.d.ts        # Tipos de Vite
    ├── 📁 assets/              # Recursos estáticos (imágenes, etc.)
    ├── 📁 components/          # Componentes reutilizables
    │   ├── 📄 Navbar.tsx       # Barra de navegación
    │   ├── 📄 Sidebar.tsx      # Barra lateral de navegación
    │   ├── 📄 ProtectedRoute.tsx # Protección de rutas
    │   ├── 📄 RoleGate.tsx     # Control de acceso por roles
    │   ├── 📄 RolePickerModal.tsx # Modal para selección de rol (mock)
    │   └── 📁 ui/              # Componentes UI de shadcn/ui (49 componentes)
    ├── 📁 context/             # Contextos de React
    │   └── 📄 AuthContext.tsx  # Contexto de autenticación
    ├── 📁 hooks/               # Custom hooks
    │   ├── 📄 use-mobile.tsx   # Hook para detección móvil
    │   └── 📄 use-toast.ts     # Hook para notificaciones
    ├── 📁 lib/                 # Utilidades y helpers
    │   └── 📄 utils.ts         # Funciones utilitarias
    └── 📁 pages/               # Páginas de la aplicación
        ├── 📄 Login.tsx        # Página de inicio de sesión
        ├── 📄 AppShell.tsx     # Layout principal de la app
        ├── 📄 Index.tsx        # Página de inicio
        ├── 📄 Estudiantes.tsx  # Gestión de estudiantes
        ├── 📄 Matriculas.tsx   # Gestión de matrículas
        ├── 📄 Notas.tsx        # Gestión de notas
        ├── 📄 Pagos.tsx        # Gestión de pagos
        ├── 📄 Boletines.tsx    # Gestión de boletines
        ├── 📄 NotAuthorized.tsx # Página de acceso denegado
        └── 📄 NotFound.tsx     # Página 404
```

## 🔧 Configuración del Proyecto

### 📦 package.json
- **Nombre**: `vite_react_shadcn_ts`
- **Scripts principales**:
  - `dev`: Servidor de desarrollo
  - `build`: Construcción para producción
  - `build:dev`: Construcción en modo desarrollo
  - `lint`: Análisis de código
  - `preview`: Vista previa de la build

### 🎨 components.json (shadcn/ui)
- **Style**: default
- **Framework**: React con TypeScript
- **CSS**: Tailwind CSS con variables CSS
- **Aliases configurados**:
  - `@/components` → componentes
  - `@/lib` → utilidades
  - `@/ui` → componentes UI
  - `@/hooks` → custom hooks

### 🌐 index.html
- **Título**: "Sistema de Matrículas | Gestión Académica"
- **Meta tags**: SEO optimizado para sistema académico
- **Open Graph**: Configurado para redes sociales
- **Punto de entrada**: `/src/main.tsx`

### 🎨 tailwind.config.ts
- **Dark Mode**: Basado en clases
- **Tema personalizado**:
  - Colores del sistema de diseño con variables HSL
  - Sidebar con tema oscuro
  - Animaciones personalizadas (accordion)
  - Breakpoints responsivos
- **Plugins**: tailwindcss-animate + daisyui
- **Tema DaisyUI**: light

### ⚡ vite.config.ts
- **Puerto**: 8080
- **Host**: "::" (IPv6/IPv4)
- **Plugins**: React SWC + Component Tagger (desarrollo)
- **Alias**: `@` → `./src`

## 🔐 Sistema de Autenticación

### AuthContext
- **Roles disponibles**: `coordinadora`, `profesor`, `estudiante`
- **Modo actual**: Mock (MOCK_AUTH = true)
- **Persistencia**: localStorage para desarrollo
- **Funcionalidades**:
  - Login/logout
  - Gestión de roles
  - Protección de rutas
  - Rehydratación de sesión

### Flujo de Autenticación
1. **Login.tsx**: Página de inicio con botón de Microsoft OAuth (mock)
2. **RolePickerModal**: Selección de rol en modo desarrollo
3. **ProtectedRoute**: Protege rutas que requieren autenticación
4. **RoleGate**: Control granular de acceso por roles

## 🧭 Sistema de Navegación

### Estructura de Rutas
```
/ → Login (público)
/app → AppShell (protegido)
  ├── /estudiantes (por defecto)
  ├── /matriculas
  ├── /notas
  ├── /pagos
  └── /boletines
/not-authorized → Acceso denegado
/* → Página 404
```

### Componentes de Navegación
- **Navbar**: Barra superior con información del usuario
- **Sidebar**: Navegación lateral con menús por rol
- **AppShell**: Layout principal que contiene Navbar + Sidebar + contenido

## 🎨 Sistema de Diseño

### Paleta de Colores (HSL)
- **Primary**: Azul profesional educativo (217 91% 60%)
- **Secondary**: Gris suave (210 40% 96%)
- **Accent**: Púrpura para destacados (262 83% 58%)
- **Sidebar**: Tema oscuro (222 47% 11%)

### Componentes UI
**49 componentes de shadcn/ui disponibles**:
- Formularios: Input, Select, Checkbox, Radio, etc.
- Navegación: Tabs, Breadcrumb, Pagination, etc.
- Feedback: Toast, Alert, Progress, etc.
- Layout: Card, Sheet, Dialog, etc.
- Datos: Table, Chart, Calendar, etc.

## 📱 Funcionalidades Principales

### Por Rol de Usuario

#### 👩‍💼 Coordinadora
- Acceso completo a todos los módulos
- Gestión de estudiantes, profesores y matrículas
- Supervisión de notas y pagos
- Generación de boletines

#### 👨‍🏫 Profesor
- Gestión de notas de sus materias
- Consulta de estudiantes asignados
- Acceso limitado a información académica

#### 👩‍🎓 Estudiante
- Consulta de sus notas y boletines
- Estado de pagos y matrículas
- Información académica personal

### Módulos Disponibles

1. **📊 Estudiantes**: Gestión completa del registro estudiantil
2. **📝 Matrículas**: Proceso de inscripción y renovación
3. **📈 Notas**: Sistema de calificaciones y evaluaciones
4. **💰 Pagos**: Control de pagos y estados financieros
5. **📋 Boletines**: Generación de reportes académicos

## 🚀 Scripts de Desarrollo

```bash
# Desarrollo
npm run dev          # Servidor en http://localhost:8080

# Construcción
npm run build        # Build de producción
npm run build:dev    # Build de desarrollo

# Calidad de código
npm run lint         # Análisis con ESLint
npm run preview      # Vista previa de la build
```

## 🔄 Estado del Proyecto

### ✅ Implementado
- ✅ Configuración base del proyecto
- ✅ Sistema de autenticación mock
- ✅ Routing y protección de rutas
- ✅ Sistema de diseño completo
- ✅ Estructura de componentes
- ✅ Layout responsivo

### 🚧 En Desarrollo
- 🚧 Integración con backend real
- 🚧 Autenticación Microsoft OAuth
- 🚧 Funcionalidades específicas de cada módulo
- 🚧 Validaciones de formularios
- 🚧 Manejo de estados de carga

### 📋 Pendiente
- 📋 Tests unitarios e integración
- 📋 Documentación de API
- 📋 Optimización de rendimiento
- 📋 Configuración de CI/CD
- 📋 Modo offline/PWA

## 🛠️ Tecnologías Clave

### Frontend Core
- **React 18**: Concurrent features, Suspense
- **TypeScript**: Tipado estático completo
- **Vite**: Build tool ultrarrápido
- **React Router**: SPA routing

### UI/UX
- **Tailwind CSS**: Utility-first CSS
- **Radix UI**: Componentes accesibles
- **shadcn/ui**: Sistema de componentes
- **DaisyUI**: Componentes adicionales

### Estado y Datos
- **TanStack Query**: Server state management
- **React Hook Form**: Gestión de formularios
- **Zod**: Validación de esquemas
- **Context API**: Estado global

## 📈 Escalabilidad

El proyecto está diseñado para escalar con:
- **Arquitectura modular**: Componentes reutilizables
- **Tipado fuerte**: TypeScript en todo el stack
- **Sistema de diseño**: Consistencia visual
- **Hooks personalizados**: Lógica reutilizable
- **Lazy loading**: Carga bajo demanda (preparado)

---

*Documentación generada el 6 de octubre de 2025*
*Proyecto: GIMPA Platform - Sistema de Gestión Académica*
