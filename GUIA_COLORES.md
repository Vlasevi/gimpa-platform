# 🎨 Guía de Colores - GIMPA Platform

Esta guía te muestra cómo usar los colores ya definidos en el proyecto GIMPA Platform.

---

## 📍 Ubicación de las Definiciones

Los colores están definidos en:
- **Archivo principal**: [`src/index.css`](file:///c:/Users/Vladimir/Documents/web-dev-projects/gimpa-platform/gimpa-frontend/src/index.css) (líneas 5-44)
- **Sistema**: DaisyUI con tema personalizado `gimpa`

---

## 🎨 Paleta de Colores Institucionales

### **Colores Principales**

| Color | Variable CSS | Clase Tailwind | Valor Hex | Uso Recomendado |
|-------|--------------|----------------|-----------|-----------------|
| 🔵 **Azul Principal** | `--color-primary` | `bg-primary` / `text-primary` | `#3b4aa0` | Botones principales, encabezados, elementos destacados |
| 🔵 **Azul Secundario** | `--color-secondary` | `bg-secondary` / `text-secondary` | `#2d3561` | Fondos secundarios, navegación |
| 🟢 **Verde Escudo** | `--color-accent` | `bg-accent` / `text-accent` | `#52b455` | Elementos de acento, destacados especiales |
| ⚫ **Neutral** | `--color-neutral` | `bg-neutral` / `text-neutral` | `#2a2a2a` | Texto principal, elementos neutros |

### **Colores de Contenido (Texto sobre fondos)**

| Variable CSS | Clase Tailwind | Valor | Uso |
|--------------|----------------|-------|-----|
| `--color-primary-content` | `text-primary-content` | `#ffffff` | Texto sobre fondo azul principal |
| `--color-secondary-content` | `text-secondary-content` | `#ffffff` | Texto sobre fondo azul secundario |
| `--color-accent-content` | `text-accent-content` | `#ffffff` | Texto sobre fondo verde |
| `--color-neutral-content` | `text-neutral-content` | `#ffffff` | Texto sobre fondo neutral |

---

## 🖼️ Colores de Fondo Base

| Color | Variable CSS | Clase Tailwind | Valor Hex | Uso Recomendado |
|-------|--------------|----------------|-----------|-----------------|
| ⚪ **Base 100** (Blanco) | `--color-base-100` | `bg-base-100` | `#ffffff` | Fondo principal de la aplicación |
| ⬜ **Base 200** (Gris claro) | `--color-base-200` | `bg-base-200` | `#f8f9fa` | Fondos secundarios, tarjetas |
| ◻️ **Base 300** (Gris medio) | `--color-base-300` | `bg-base-300` | `#e9ecef` | Bordes, separadores |
| ⚫ **Base Content** | `--color-base-content` | `text-base-content` | `#2a2a2a` | Texto sobre fondos base |

---

## ⚠️ Colores de Estado

| Estado | Variable CSS | Clase Tailwind | Valor Hex | Uso |
|--------|--------------|----------------|-----------|-----|
| 🟡 **Info** | `--color-info` | `bg-info` / `text-info` | `#ffcd3c` | Mensajes informativos |
| 🟢 **Success** | `--color-success` | `bg-success` / `text-success` | `#52b455` | Mensajes de éxito, confirmaciones |
| 🟠 **Warning** | `--color-warning` | `bg-warning` / `text-warning` | `#ff6b35` | Advertencias, precauciones |
| 🔴 **Error** | `--color-error` | `bg-error` / `text-error` | `#dc3545` | Errores, validaciones fallidas |

Cada color de estado tiene su correspondiente color de contenido:
- `--color-info-content` → `text-info-content` → `#2a2a2a`
- `--color-success-content` → `text-success-content` → `#ffffff`
- `--color-warning-content` → `text-warning-content` → `#ffffff`
- `--color-error-content` → `text-error-content` → `#ffffff`

---

## 🎨 Variables HSL Personalizadas

Estas variables están definidas en formato HSL para mayor flexibilidad:

| Variable | Valor HSL | Uso |
|----------|-----------|-----|
| `--accentlight` | `120 56% 80%` | Verde claro para hover/estados |
| `--accent` | `122 39% 52%` | Verde acento alternativo |
| `--primary-light` | `231 41% 54%` | Azul claro para hover |
| `--primary-dark` | `230 50% 35%` | Azul oscuro para estados activos |
| `--accent-dark` | `123 44% 38%` | Verde oscuro para estados activos |

**Uso en Tailwind**:
```tsx
// Usando variables HSL personalizadas
<div className="bg-[hsl(var(--primary-light))]">Contenido</div>
<div className="text-[hsl(var(--accent-dark))]">Texto</div>
```

---

## 📝 Ejemplos de Uso

### **1. Botón Principal**
```tsx
<button className="bg-primary text-primary-content px-4 py-2 rounded">
  Guardar
</button>
```

### **2. Tarjeta con Fondo**
```tsx
<div className="bg-base-200 p-6 rounded-lg">
  <h2 className="text-primary font-bold">Título</h2>
  <p className="text-base-content">Contenido de la tarjeta</p>
</div>
```

### **3. Mensaje de Éxito**
```tsx
<div className="bg-success text-success-content p-4 rounded">
  ✅ Operación completada exitosamente
</div>
```

### **4. Mensaje de Error**
```tsx
<div className="bg-error text-error-content p-4 rounded">
  ❌ Ha ocurrido un error
</div>
```

### **5. Navegación con Azul Secundario**
```tsx
<nav className="bg-secondary text-secondary-content p-4">
  <ul className="flex gap-4">
    <li>Inicio</li>
    <li>Estudiantes</li>
    <li>Matrículas</li>
  </ul>
</nav>
```

### **6. Elemento Destacado con Verde**
```tsx
<div className="bg-accent text-accent-content p-3 rounded-full inline-block">
  Nuevo
</div>
```

### **7. Bordes y Separadores**
```tsx
<div className="border border-base-300 p-4">
  Contenido con borde
</div>

<hr className="border-base-300 my-4" />
```

---

## 🎯 Uso con Componentes DaisyUI

DaisyUI usa automáticamente estos colores en sus componentes:

### **Botones**
```tsx
<button className="btn btn-primary">Primario</button>
<button className="btn btn-secondary">Secundario</button>
<button className="btn btn-accent">Acento</button>
<button className="btn btn-success">Éxito</button>
<button className="btn btn-error">Error</button>
<button className="btn btn-warning">Advertencia</button>
<button className="btn btn-info">Info</button>
```

### **Alertas**
```tsx
<div className="alert alert-success">Mensaje de éxito</div>
<div className="alert alert-error">Mensaje de error</div>
<div className="alert alert-warning">Mensaje de advertencia</div>
<div className="alert alert-info">Mensaje informativo</div>
```

### **Badges**
```tsx
<span className="badge badge-primary">Primario</span>
<span className="badge badge-secondary">Secundario</span>
<span className="badge badge-accent">Acento</span>
<span className="badge badge-success">Éxito</span>
```

---

## 🔧 Uso Avanzado

### **Opacidad con Colores**
```tsx
// Usando opacidad con Tailwind
<div className="bg-primary/50">Fondo azul al 50%</div>
<div className="bg-accent/20">Fondo verde al 20%</div>
```

### **Gradientes**
```tsx
<div className="bg-gradient-to-r from-primary to-secondary">
  Gradiente azul
</div>

<div className="bg-gradient-to-br from-accent to-success">
  Gradiente verde
</div>
```

### **Estados Hover y Focus**
```tsx
<button className="bg-primary hover:bg-[hsl(var(--primary-dark))] 
                   text-primary-content px-4 py-2 rounded 
                   transition-colors">
  Botón con hover
</button>
```

---

## ✅ Mejores Prácticas

1. **Usa las clases de Tailwind** en lugar de las variables CSS directamente:
   ```tsx
   // ✅ Correcto
   <div className="bg-primary text-primary-content">

   // ❌ Evitar
   <div style={{ backgroundColor: 'var(--color-primary)' }}>
   ```

2. **Mantén la consistencia** usando siempre los colores del tema:
   ```tsx
   // ✅ Correcto
   <button className="bg-primary">

   // ❌ Evitar colores hardcodeados
   <button className="bg-[#3b4aa0]">
   ```

3. **Usa colores de contenido** para garantizar contraste:
   ```tsx
   // ✅ Correcto
   <div className="bg-primary text-primary-content">

   // ❌ Puede tener bajo contraste
   <div className="bg-primary text-gray-500">
   ```

4. **Aprovecha los colores de estado** para feedback al usuario:
   ```tsx
   {isSuccess && <div className="bg-success text-success-content">...</div>}
   {isError && <div className="bg-error text-error-content">...</div>}
   ```

---

## 🎨 Referencia Rápida

### **Fondos**
- `bg-primary` - Azul principal (#3b4aa0)
- `bg-secondary` - Azul secundario (#2d3561)
- `bg-accent` - Verde escudo (#52b455)
- `bg-base-100` - Blanco (#ffffff)
- `bg-base-200` - Gris claro (#f8f9fa)
- `bg-base-300` - Gris medio (#e9ecef)

### **Textos**
- `text-primary` - Azul principal
- `text-secondary` - Azul secundario
- `text-accent` - Verde escudo
- `text-base-content` - Negro/gris oscuro (#2a2a2a)
- `text-primary-content` - Blanco (para fondos oscuros)

### **Estados**
- `bg-success` / `text-success` - Verde (#52b455)
- `bg-error` / `text-error` - Rojo (#dc3545)
- `bg-warning` / `text-warning` - Naranja (#ff6b35)
- `bg-info` / `text-info` - Amarillo (#ffcd3c)

---

## 📚 Recursos Adicionales

- **DaisyUI Docs**: https://daisyui.com/docs/themes/
- **Tailwind CSS Colors**: https://tailwindcss.com/docs/customizing-colors
- **Archivo de configuración**: [`src/index.css`](file:///c:/Users/Vladimir/Documents/web-dev-projects/gimpa-platform/gimpa-frontend/src/index.css)

---

**Última actualización**: Noviembre 2025  
**Tema activo**: `gimpa` (definido en `index.css`)
