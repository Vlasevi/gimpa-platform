import { useEffect } from "react";

/**
 * Bloquea el scroll del `<body>` mientras `active` sea true (p. ej. con un modal
 * abierto): el fondo no se desplaza, solo el modal. Compensa el ancho de la
 * scrollbar con padding para que el contenido del fondo no “salte” al ocultarla.
 *
 * Soporta anidamiento (un modal dentro de otro): cada instancia captura y
 * restaura el estado que había al montarse, así el lock se mantiene mientras
 * quede algún modal abierto.
 */
export function useBodyScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;

    const body = document.body;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const prevOverflow = body.style.overflow;
    const prevPaddingRight = body.style.paddingRight;

    body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      const currentPad = parseFloat(getComputedStyle(body).paddingRight) || 0;
      body.style.paddingRight = `${currentPad + scrollbarWidth}px`;
    }

    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPaddingRight;
    };
  }, [active]);
}

export default useBodyScrollLock;
