# Checklist de regresión — eliminación de shadcn (→ daisyui)

Verificación tras: reescribir `ui/tabs` y `ui/Alert` en daisyui (sin Radix), borrar
`ui/button`, `ui/dialog`, `components.json` y las deps `@radix-ui/*` + `cva`.

> Estado typecheck: 5 errores **preexistentes** ajenos a este cambio
> (`Step4Documents.tsx` tipos de `pdfjs`/`Uint8Array`, y `use-toast.ts` importa
> `@/components/ui/toast` que nunca existió). Ningún error nuevo.

Marca cada punto al verificarlo en el navegador.

---

## A. Alto riesgo — componentes reescritos (probar sí o sí)

### A1. Tabs — `components/ui/tabs.tsx`
Usado en **`contratacion/ContratacionAdmin.tsx`** (controlado: `value`/`onValueChange`)
y **`matriculas/StudentDataTabs.tsx`** (no controlado: `defaultValue="info"`).

- [ ] Al hacer clic en una pestaña cambia el contenido mostrado.
- [ ] La pestaña activa se pinta azul (`data-[state=active]:bg-primary text-white`).
- [ ] Las inactivas se ven grises y con hover (`data-[state=inactive]:hover:bg-base-300`).
- [ ] El scroll horizontal de la barra de pestañas funciona en pantallas angostas.
- [ ] **ContratacionAdmin**: la pestaña seleccionada se mantiene al editar/guardar
      (estado controlado externo).
- [ ] **StudentDataTabs**: arranca en "Información" y las 7 pestañas cambian bien
      (incluida "Documentos").
- [ ] El foco por teclado en una pestaña muestra el anillo (`focus-visible:ring-primary`).

### A2. Alert (modal) — `components/ui/Alert.tsx`
Único uso: **`matriculas/Step3StudentData.tsx`** (modal legal de oficialización).

- [ ] El modal abre cuando corresponde (autorización de matrícula).
- [ ] `requireScrollToBottom`: el botón **ACEPTO** está deshabilitado hasta bajar al
      final del texto; se habilita al llegar abajo.
- [ ] Si el texto no necesita scroll, ACEPTO queda habilitado de una.
- [ ] **ACEPTO** dispara la acción (`onAccept`) y **Cancelar** cierra (`onClose`).
- [ ] Cierran también: clic en el fondo oscuro y tecla **Escape**.
- [ ] El scroll del fondo queda bloqueado mientras el modal está abierto.
- [ ] Estilo correcto: ícono ámbar (variante `warning`), botón ACEPTO azul
      (`acceptButtonClassName`), bordes redondeados y animación de entrada.

---

## B. Arranque sin imports rotos

- [ ] La app compila y arranca (`npm run dev`) sin errores en consola.
- [ ] No hay errores del tipo "Failed to resolve import `@/components/ui/button`"
      ni `.../ui/dialog` (ambos eliminados).
- [ ] `npm install` corrido para podar `@radix-ui/*` y `class-variance-authority`.

---

## C. Deuda: tokens shadcn muertos (preexistente — revisar y priorizar)

Estas clases **nunca se generaron** (no se cablearon a Tailwind v4): hoy dejan inputs
sin borde/fondo, texto atenuado sin color y hover que se pone **verde**. No es
regresión de este cambio, pero conviene arreglarlas (equivalencias en
`DESIGN_SYSTEM.md`).

- [ ] `auxiliar/userRegister.tsx` — inputs (`bg-background`, `border-input`, `ring-ring`).
- [ ] `auxiliar/userUpdate.tsx` — inputs y botones (`hover:bg-accent`).
- [ ] `auxiliar/userEnroll.tsx` — botones (`hover:bg-accent hover:text-accent-foreground`).
- [ ] `pages/Pagos.tsx` — `bg-card`, `text-muted-foreground`.
- [ ] `pages/NotAuthorized.tsx` — `bg-background`, `text-muted-foreground`.
- [ ] `pages/Index.tsx` — `bg-background`, `text-muted-foreground` (¿página aún en uso?).
- [ ] `matriculas/MatriculasAdmin.tsx` — `text-muted-foreground`.

---

## D. Smoke test por ruta (botones / inputs / labels / selects / modales)

Rutas según `App.tsx`. Revisa que se vea y funcione como antes.

| Ruta | Qué mirar |
| --- | --- |
| `/login` | ✅ ya verificado |
| `/dashboard` | carga, tarjetas, navegación del sidebar |
| `/estudiantes` | listado, botones de acción |
| `/matriculas` | **wizard 6 pasos**: tabs (Step3), modal Alert (Step3), selects de grado (Step2), uploads (Step4/5), confirmación (Step6) |
| `/notas` | tabla/edición, inputs numéricos |
| `/pagos` | tarjetas (revisar tokens muertos, sección C) |
| `/certificados` | generación/descarga |
| `/usuarios` | **modal `UserFormModal`** (crear/editar), selects, labels |
| `/contratacion` | **tabs (`ContratacionAdmin`)**, `FieldWidget` inputs/selects, `ContratacionEmpleado` |
| `/mi-contrato` | formulario/lectura |
| `/unauthorized`, `/404` | textos y estilos (tokens muertos en NotAuthorized) |

---

## E. Modales daisyui NO tocados (verificación ligera)

Estos usan `modal`/`<dialog>` nativos, no nuestro `Alert` — no deberían verse
afectados, pero confírmalos de pasada:

- [ ] `users/UserFormModal.tsx`
- [ ] `pages/Usuarios.tsx`
- [ ] `matriculas/MatriculasAdmin.tsx`
- [ ] `matriculas/Step4Documents.tsx`

---

## F. Transversal (todas las pantallas)

- [ ] Botones daisyui (`btn btn-primary`, `btn btn-outline`, …) se ven consistentes.
- [ ] Ningún hover queda verde por accidente (síntoma de `hover:bg-accent` muerto).
- [ ] Labels asociados a sus inputs (clic en label enfoca el campo).
- [ ] Responsivo hasta móvil sin scroll horizontal de la página.
- [ ] Foco visible por teclado en controles interactivos.
