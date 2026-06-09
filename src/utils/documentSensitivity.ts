/**
 * Clasificación de sensibilidad de documentos (espejo del backend
 * enrollment/documents.py). Se usa para gatear los controles de edición
 * en la UI. La visibilidad real la impone el backend.
 */

export type DocClass = "normal" | "medical" | "sensitive";

const DOCUMENT_SENSITIVITY: Record<string, DocClass> = {
  // Normal / no sensible
  student_photo: "normal",
  father_photo: "normal",
  mother_photo: "normal",
  cert_estudios: "normal",
  paz_salvo: "normal",
  convivencia: "normal",
  retiro_simat: "normal",
  hoja_matricula_signed: "normal",

  // Médico
  cert_eps: "medical",
  cert_medico: "medical",
  registro_vacunacion: "medical",
  cert_vista: "medical",
  cert_auditivo: "medical",
  cert_diagnostico: "medical",
  ficha_psicologica: "medical",

  // Sensible
  registro_civil: "sensitive",
  registro_civil_ti: "sensitive",
  father_id: "sensitive",
  mother_id: "sensitive",
  guardian_id: "sensitive",
  contrato_signed: "sensitive",
  pagare_signed: "sensitive",
  work_certificate: "sensitive",
};

/**
 * Devuelve la clase de sensibilidad de un documento por su clave.
 * Maneja claves generadas (documentos/contrato_2026, etc.).
 * Las claves desconocidas se consideran 'sensitive' por seguridad.
 */
export function classifyDocument(docKey: string): DocClass {
  if (docKey in DOCUMENT_SENSITIVITY) {
    return DOCUMENT_SENSITIVITY[docKey];
  }

  const key = docKey.toLowerCase();
  if (key.includes("contrato") || key.includes("pagare") || key.includes("pagaré")) {
    return "sensitive";
  }
  if (key.includes("hoja_matricula")) {
    return "normal";
  }

  return "sensitive";
}
