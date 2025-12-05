# 🎨 Guía de Estilos - GIMPA Platform

## 📋 Sistemas de Estilos Configurados

Tu proyecto usa **dos sistemas complementarios**:

### 🧩 **shadcn/ui** (Principal)
- **Uso**: Componentes React interactivos
- **Variables**: CSS custom properties (`--primary`, `--background`, etc.)
- **Clases**: `bg-primary`, `text-foreground`, `border-border`

### 🎨 **DaisyUI** (Complementario)  
- **Uso**: Clases utilitarias específicas
- **Tema**: `gimpa` con colores institucionales
- **Clases**: `btn`, `card`, `modal`, `bg-base-100`

## ✅ **Reglas de Uso Recomendadas**

### **🎯 Para Componentes React (Usar shadcn/ui)**
```tsx
// ✅ CORRECTO - shadcn/ui
<div className="bg-background text-foreground">
<Button variant="default">Guardar</Button>
<Card className="p-4">Contenido</Card>

// ❌ EVITAR - DaisyUI en componentes React
<div className="bg-base-100 text-base-content">
<button className="btn btn-primary">Guardar</button>
```

### **🎨 Para Elementos HTML Simples (Usar DaisyUI)**
```tsx
// ✅ CORRECTO - DaisyUI para elementos simples
<button className="btn btn-primary">Acción Rápida</button>
<div className="card bg-base-100">Tarjeta simple</div>

// ✅ TAMBIÉN CORRECTO - shadcn/ui siempre funciona
<Button variant="default">Acción Rápida</Button>
<Card>Tarjeta con lógica</Card>
```

## 🎯 **Mapeo de Colores GIMPA**

### **Colores Institucionales**
| Concepto | shadcn/ui | DaisyUI | Hex |
|----------|-----------|---------|-----|
| **Azul Principal** | `bg-primary` | `bg-primary` | `#3b4aa0` |
| **Azul Secundario** | `bg-secondary` | `bg-secondary` | `#2d3561` |
| **Verde Escudo** | `bg-accent` | `bg-accent` | `#52b455` |
| **Fondo Blanco** | `bg-background` | `bg-base-100` | `#ffffff` |
| **Texto Principal** | `text-foreground` | `text-base-content` | `#2a2a2a` |

### **Colores de Estado**
| Estado | shadcn/ui | DaisyUI | Hex |
|--------|-----------|---------|-----|
| **Éxito** | `bg-accent` | `bg-success` | `#52b455` |
| **Error** | `bg-destructive` | `bg-error` | `#dc3545` |
| **Advertencia** | `bg-warning` | `bg-warning` | `#ff6b35` |
| **Información** | `bg-info` | `bg-info` | `#ffcd3c` |

## 📝 **Ejemplos Prácticos**

### **🔐 Página de Login**
```tsx
// ✅ CORRECTO
<div className="bg-background text-foreground">
  <Button variant="default">Iniciar Sesión</Button>
</div>

// ❌ EVITAR mezclar sistemas
<div className="bg-base-100 text-foreground">
  <button className="btn bg-primary">Iniciar Sesión</button>
</div>
```

### **📊 Tablas de Datos**
```tsx
// ✅ CORRECTO - shadcn/ui para componentes complejos
import { Table, TableBody, TableCell } from '@/components/ui/table';

<Table>
  <TableBody>
    <TableCell className="text-foreground">Estudiante</TableCell>
  </TableBody>
</Table>
```

### **🔔 Notificaciones**
```tsx
// ✅ CORRECTO - shadcn/ui toast system
import { useToast } from '@/hooks/use-toast';

const { toast } = useToast();
toast({
  title: "Éxito",
  description: "Matrícula guardada correctamente"
});
```

## 🚨 **Conflictos Comunes y Soluciones**

### **❌ Problema: Fondo Negro**
```tsx
// ❌ CAUSA: Mezclar sistemas
<div className="bg-base-100 border-border">

// ✅ SOLUCIÓN: Usar un solo sistema
<div className="bg-background border-border">
// O
<div className="bg-base-100 border-base-300">
```

### **❌ Problema: Colores Inconsistentes**
```tsx
// ❌ CAUSA: Variables no sincronizadas
<Button className="bg-blue-500">  // Color hardcodeado

// ✅ SOLUCIÓN: Usar variables del tema
<Button variant="default">        // Usa --primary automáticamente
```

## 🎨 **Fuentes Institucionales**

### **Jerarquía de Fuentes**
```css
/* Configurado en tailwind.config.ts */
font-inter    → Texto principal (UI, formularios)
font-poppins  → Títulos y encabezados  
font-nunito   → Texto secundario (descripciones)
```

### **Uso Recomendado**
```tsx
<h1 className="font-poppins text-2xl font-bold">Título Principal</h1>
<p className="font-inter text-base">Contenido del sistema</p>
<span className="font-nunito text-sm text-muted-foreground">Descripción</span>
```

## 🔧 **Comandos de Desarrollo**

### **Agregar Nuevos Componentes shadcn/ui**
```bash
npx shadcn-ui@latest add [componente]
# Ejemplo: npx shadcn-ui@latest add data-table
```

### **Verificar Tema DaisyUI**
```html
<!-- En index.html -->
<body data-theme="gimpa">
```

## 📋 **Checklist de Consistencia**

Antes de hacer commit, verifica:

- [ ] ¿Usas `bg-background` en lugar de `bg-base-100` para componentes React?
- [ ] ¿Los colores usan variables del tema (`bg-primary` vs `bg-blue-500`)?
- [ ] ¿Las fuentes usan las clases institucionales (`font-inter`)?
- [ ] ¿Los componentes complejos usan shadcn/ui?
- [ ] ¿Los elementos simples pueden usar DaisyUI si es más directo?

---

**Objetivo**: Mantener la identidad visual de GIMPA con código limpio y consistente.
