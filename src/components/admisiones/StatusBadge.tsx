/**
 * Estado del expediente como pastilla de color.
 *
 * El texto viene del backend (`status_label`) para no duplicar los 29 estados en el
 * front; aquí solo se decide el **tono**.
 */

type Tone = "draft" | "progress" | "attention" | "success" | "closed";

const TONE_CLASSES: Record<Tone, string> = {
  draft: "border-base-300 bg-base-200 text-base-content/70",
  progress: "border-primary/25 bg-primary/10 text-primary",
  attention: "border-warning/30 bg-warning/10 text-warning",
  success: "border-accent/30 bg-accent/10 text-accent",
  closed: "border-error/25 bg-error/10 text-error",
};

const STATUS_TONES: Record<string, Tone> = {
  PRE_REGISTRO_INICIADO: "draft",
  SOLICITUD_EN_DILIGENCIAMIENTO: "draft",
  DEVUELTA_PARA_CORRECCION: "attention",
  PAGO_RECHAZADO: "attention",
  LISTA_ESPERA: "attention",
  REQUIERE_NUEVA_VALORACION: "attention",
  ADMITIDO: "success",
  ADMITIDO_CON_CONDICIONES: "success",
  ESTUDIANTE_MATRICULADO: "success",
  NO_ADMITIDO: "closed",
  DESISTIDO: "closed",
};

export function StatusBadge({
  status,
  label,
}: {
  status: string;
  label: string;
}) {
  // Cualquier estado intermedio del proceso cuenta como "en curso".
  const tone = STATUS_TONES[status] ?? "progress";
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${TONE_CLASSES[tone]}`}
    >
      {label}
    </span>
  );
}
