# 🏗️ GIMPA Platform - Arquitectura y Funcionalidades

## 🎯 Descripción General

GIMPA Platform es un sistema integral de gestión académica para instituciones educativas, enfocado en la administración de matrículas, notas, pagos y reportes. El frontend está construido con React + TypeScript, empleando un sistema de diseño moderno y componentes reutilizables.

## 🏗️ Arquitectura Tecnológica

- **Frontend Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **Routing:** React Router DOM
- **Styling:** Tailwind CSS + DaisyUI
- **UI Components:** Radix UI + shadcn/ui
- **State Management:** Context API + TanStack Query
- **Forms:** React Hook Form + Zod

## 📁 Estructura del Proyecto

```
gimpa-platform/
├── package.json              # Configuración de dependencias y scripts
├── components.json           # Configuración de shadcn/ui
├── index.html                # Punto de entrada HTML
├── tailwind.config.ts        # Configuración de Tailwind CSS
├── vite.config.ts            # Configuración de Vite
└── src/                      # Código fuente principal
    ├── main.tsx              # Punto de entrada de React
    ├── App.tsx               # Componente raíz con routing
    ├── index.css             # Estilos globales y variables CSS
    ├── App.css               # Estilos específicos del App
    ├── assets/               # Recursos estáticos
    ├── components/           # Componentes reutilizables
    │   ├── Navbar.tsx        # Barra de navegación
    │   ├── Sidebar.tsx       # Barra lateral de navegación
    │   ├── ProtectedRoute.tsx# Protección de rutas
    │   # Control de acceso por roles se realiza directamente en los componentes
    │   └── ui/               # Componentes UI de shadcn/ui
    ├── context/              # Contextos de React
    │   └── AuthContext.tsx   # Contexto de autenticación y sesión
    ├── hooks/                # Custom hooks
    │   ├── use-mobile.tsx    # Hook para detección móvil
    │   └── use-toast.ts      # Hook para notificaciones
    ├── lib/                  # Utilidades y helpers
    │   └── utils.ts          # Funciones utilitarias
    └── pages/                # Páginas de la aplicación
        ├── Login.tsx         # Página de inicio de sesión
        ├── Dashboard.tsx     # Panel principal
        ├── Estudiantes.tsx   # Gestión de estudiantes
        ├── Matriculas.tsx    # Gestión de matrículas
        ├── Notas.tsx         # Gestión de notas
        ├── Pagos.tsx         # Gestión de pagos
        ├── Certificados.tsx  # Generación de certificados
        ├── NotAuthorized.tsx # Página de acceso denegado
        └── NotFound.tsx      # Página 404
```

## 🔧 Configuración del Proyecto

- **package.json:** Scripts para desarrollo, build, lint y preview.
- **components.json:** Configuración de shadcn/ui y aliases.
- **index.html:** SEO y Open Graph optimizados.
- **tailwind.config.ts:** Tema personalizado, dark mode, plugins y breakpoints.
- **vite.config.ts:** Puerto 8080, alias @ → ./src, plugins de desarrollo.

## 🔐 Sistema de Autenticación, Roles y Permisos

- **Roles:** El backend define los roles (ejemplo: admin, rector, student, coordinadora, profesor, estudiante, etc.). El frontend soporta cualquier rol que envíe el backend.
- **Permisos:** El backend envía un array de permisos para cada usuario (ejemplo: `manage_grades`, `view_grades`, `manage_enrollment`, etc.). Los componentes y menús se muestran/ocultan según estos permisos.
- **Login:** Funcional e integrado con backend (OAuth2 Azure AD). No es mock.
- **Persistencia:** localStorage para desarrollo, y sesión gestionada por backend en producción.
- **Control de acceso:**
  - En cada página o componente, se verifica el `user.role` y/o los permisos para decidir qué mostrar. Ejemplo:
    - En `Matriculas.tsx`, se renderiza `MatriculasAdmin` si el rol es `admin` o `rector`, y `MatriculasEstudiantes` si es `student`.
    - En `Sidebar.tsx`, los menús se filtran según los permisos del usuario (`user.permissions`).
  - No se utiliza un componente `RoleGate`; el control es condicional y directo en el renderizado de React.

## 🧭 Sistema de Navegación

- **Rutas:**
  - /login (público)
  - /dashboard, /estudiantes, /matriculas, /notas, /pagos, /certificados (protegidas y filtradas por rol/permisos)
  - /unauthorized, /404
- **Componentes:** Navbar, Sidebar (menús filtrados por permisos), Layout (AppShell)

## 🎨 Sistema de Diseño

- **Paleta:** Azul, gris, púrpura, sidebar oscuro
- **Componentes UI:** 49 de shadcn/ui (formularios, navegación, feedback, layout, datos)

## 📱 Funcionalidades Principales

### Por Rol y Permisos

- El backend define los roles y permisos. El frontend adapta la interfaz y las funcionalidades según estos datos.
- Ejemplos:
  - **Admin/Rector:** Acceso total a módulos administrativos y gestión académica.
  - **Coordinadora/Profesor:** Acceso a gestión de notas, estudiantes y matrículas según permisos.
  - **Estudiante:** Consulta de notas, boletines, pagos y matrículas.
  - **Otros roles:** El sistema soporta roles adicionales definidos por el backend.

### Módulos

1. **Estudiantes:** Registro y gestión estudiantil
2. **Matrículas:** Inscripción y renovación (actualmente en mock para estudiantes; pendiente integración final con backend)
3. **Notas:** Calificaciones y evaluaciones
4. **Pagos:** Control financiero
5. **Boletines:** Reportes académicos

## 🚀 Scripts de Desarrollo

```bash
npm run dev       # Servidor local
npm run build     # Build producción
npm run build:dev # Build desarrollo
npm run lint      # Linting
npm run preview   # Vista previa
```

## 🔄 Estado del Proyecto

- **Implementado:** Base, autenticación mock, routing, diseño, layout responsivo
- **En desarrollo:** Integración backend, OAuth real, validaciones, manejo de carga
- **Pendiente:** Tests, docs API, optimización, CI/CD, modo offline/PWA

## 🛠️ Tecnologías Clave

- **React 18, TypeScript, Vite, React Router**
- **Tailwind CSS, Radix UI, shadcn/ui, DaisyUI**
- **TanStack Query, React Hook Form, Zod, Context API**

## 📈 Escalabilidad

- Arquitectura modular
- Tipado fuerte
- Sistema de diseño consistente
- Hooks personalizados
- Lazy loading preparado

---

_Documentación generada automáticamente el 24 de noviembre de 2025_
_Proyecto: GIMPA Platform - Sistema de Gestión Académica_
