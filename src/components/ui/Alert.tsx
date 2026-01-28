// components/ui/Alert.tsx
import { ReactNode, useRef, useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface AlertProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  acceptText?: string;
  cancelText?: string;
  variant?: "warning" | "info" | "error" | "success";
  // Personalización de botones
  acceptButtonClassName?: string;
  cancelButtonClassName?: string;
  acceptButtonVariant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  cancelButtonVariant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  // Requiere scroll hasta el final para habilitar el botón de aceptar
  requireScrollToBottom?: boolean;
}

const variantStyles = {
  warning: "text-amber-500",
  info: "text-blue-500",
  error: "text-red-500",
  success: "text-green-500",
};

const variantIcons = {
  warning: (
    <svg
      className="w-8 h-8"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    </svg>
  ),
  info: (
    <svg
      className="w-8 h-8"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  error: (
    <svg
      className="w-8 h-8"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  success: (
    <svg
      className="w-8 h-8"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
};

export const Alert = ({
  isOpen,
  onClose,
  onAccept,
  title = "Aviso Importante",
  description,
  children,
  acceptText = "Aceptar",
  cancelText = "Cancelar",
  variant = "warning",
  acceptButtonClassName,
  cancelButtonClassName,
  acceptButtonVariant = "default",
  cancelButtonVariant = "outline",
  requireScrollToBottom = false,
}: AlertProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);

  // Resetear el estado cuando el modal se abre
  useEffect(() => {
    if (isOpen) {
      setHasScrolledToBottom(false);
    }
  }, [isOpen]);

  // Verificar si el contenido necesita scroll
  useEffect(() => {
    if (isOpen && contentRef.current && requireScrollToBottom) {
      const element = contentRef.current;
      // Si el contenido no necesita scroll, habilitar el botón directamente
      if (element.scrollHeight <= element.clientHeight) {
        setHasScrolledToBottom(true);
      }
    }
  }, [isOpen, requireScrollToBottom, children]);

  const handleScroll = useCallback(() => {
    if (contentRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
      // Considerar que llegó al final con un margen de 10px
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;
      if (isAtBottom) {
        setHasScrolledToBottom(true);
      }
    }
  }, []);

  const isAcceptDisabled = requireScrollToBottom && !hasScrolledToBottom;
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col bg-white">
        {/* Header fijo */}
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-3 text-xl">
            <span className={variantStyles[variant]}>
              {variantIcons[variant]}
            </span>
            {title}
          </DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        {/* Contenido scrollable */}
        <div
          ref={contentRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto text-gray-700 leading-relaxed space-y-4 py-4 pl-4 pr-6"
        >
          {children}
        </div>

        {/* Footer fijo */}
        <DialogFooter className="flex-shrink-0 gap-2 sm:gap-0 pt-4 border-t">
          <Button
            variant={cancelButtonVariant}
            className={cancelButtonClassName}
            onClick={onClose}
          >
            {cancelText}
          </Button>
          <Button
            variant={acceptButtonVariant}
            className={`${acceptButtonClassName || ""} ${isAcceptDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={onAccept}
            disabled={isAcceptDisabled}
          >
            {acceptText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
