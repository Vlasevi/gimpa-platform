// components/matriculas/steps/Step4Documents.tsx
import { useState, useEffect } from "react";
import { Alert } from "@/components/ui/Alert";

// Componente reutilizable para subir firma
const SignatureUpload = ({
  label,
  dataKey,
  uploadedFiles,
  updateUploadedFiles,
  preloadedUrl,
}: any) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [useExisting, setUseExisting] = useState(!!preloadedUrl);

  useEffect(() => {
    const file = uploadedFiles?.[dataKey];
    if (file instanceof File && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      setUseExisting(false);
      return () => URL.revokeObjectURL(url);
    } else if (preloadedUrl && useExisting) {
      setPreview(preloadedUrl);
    } else {
      setPreview(null);
    }
  }, [uploadedFiles?.[dataKey], dataKey, preloadedUrl, useExisting]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    updateUploadedFiles({ [dataKey]: file });
    setUseExisting(false);
  };

  const handleRemove = () => {
    updateUploadedFiles({ [dataKey]: null });
    setUseExisting(false);
  };

  const handleKeepExisting = () => {
    updateUploadedFiles({ [dataKey]: null });
    setUseExisting(true);
  };

  return (
    <div className="space-y-2">
      <label className="label">
        <span className="label-text font-medium">{label}</span>
      </label>

      {/* Show preview if exists (either preloaded or new file) */}
      {preview && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-2 bg-white">
          <img
            src={preview}
            alt="Vista previa"
            className="max-w-full max-h-24 object-contain"
          />
          <div className="flex gap-2 mt-2">
            {useExisting && preloadedUrl ? (
              <span className="text-info text-xs">
                ✓ Firma existente cargada
              </span>
            ) : uploadedFiles?.[dataKey] ? (
              <span className="text-success text-xs">
                ✓ {uploadedFiles[dataKey].name}
              </span>
            ) : null}
          </div>
        </div>
      )}

      {/* File input or change button */}
      {useExisting && preloadedUrl ? (
        <button
          type="button"
          onClick={() => setUseExisting(false)}
          className="btn btn-sm btn-outline btn-primary w-full"
        >
          Cambiar firma
        </button>
      ) : (
        <>
          <input
            type="file"
            accept="image/*"
            className="file-input file-input-bordered file-input-sm w-full"
            onChange={handleFileChange}
            key={uploadedFiles?.[dataKey] ? "has-file" : "no-file"}
          />
          {uploadedFiles?.[dataKey] && (
            <button
              type="button"
              onClick={handleRemove}
              className="btn btn-xs btn-ghost"
            >
              ✕ Quitar
            </button>
          )}
          {preloadedUrl && !uploadedFiles?.[dataKey] && (
            <button
              type="button"
              onClick={handleKeepExisting}
              className="btn btn-sm btn-ghost w-full"
            >
              Mantener firma existente
            </button>
          )}
        </>
      )}
    </div>
  );
};

// Componente reutilizable para subir huella
const FingerprintUpload = ({
  label,
  dataKey,
  uploadedFiles,
  updateUploadedFiles,
  preloadedUrl,
}: any) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [useExisting, setUseExisting] = useState(!!preloadedUrl);

  useEffect(() => {
    const file = uploadedFiles?.[dataKey];
    if (file instanceof File && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      setUseExisting(false);
      return () => URL.revokeObjectURL(url);
    } else if (preloadedUrl && useExisting) {
      setPreview(preloadedUrl);
    } else {
      setPreview(null);
    }
  }, [uploadedFiles?.[dataKey], dataKey, preloadedUrl, useExisting]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    updateUploadedFiles({ [dataKey]: file });
    setUseExisting(false);
  };

  const handleRemove = () => {
    updateUploadedFiles({ [dataKey]: null });
    setUseExisting(false);
  };

  const handleKeepExisting = () => {
    updateUploadedFiles({ [dataKey]: null });
    setUseExisting(true);
  };

  return (
    <div className="space-y-2">
      <label className="label">
        <span className="label-text font-medium">{label}</span>
      </label>

      {/* Show preview if exists (either preloaded or new file) */}
      {preview && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-2 bg-white flex justify-center">
          <img
            src={preview}
            alt="Vista previa huella"
            className="w-24 h-32 object-contain"
            style={{ maxWidth: "100px", maxHeight: "150px" }}
          />
        </div>
      )}
      {preview && (
        <div className="flex gap-2">
          {useExisting && preloadedUrl ? (
            <span className="text-info text-xs">
              ✓ Huella existente cargada
            </span>
          ) : uploadedFiles?.[dataKey] ? (
            <span className="text-success text-xs">
              ✓ {uploadedFiles[dataKey].name}
            </span>
          ) : null}
        </div>
      )}

      {/* File input or change button */}
      {useExisting && preloadedUrl ? (
        <button
          type="button"
          onClick={() => setUseExisting(false)}
          className="btn btn-sm btn-outline btn-primary w-full"
        >
          Cambiar huella
        </button>
      ) : (
        <>
          <input
            type="file"
            accept="image/*"
            className="file-input file-input-bordered file-input-sm w-full"
            onChange={handleFileChange}
            key={uploadedFiles?.[dataKey] ? "has-file" : "no-file"}
          />
          {uploadedFiles?.[dataKey] && (
            <button
              type="button"
              onClick={handleRemove}
              className="btn btn-xs btn-ghost"
            >
              ✕ Quitar
            </button>
          )}
          {preloadedUrl && !uploadedFiles?.[dataKey] && (
            <button
              type="button"
              onClick={handleKeepExisting}
              className="btn btn-sm btn-ghost w-full"
            >
              Mantener huella existente
            </button>
          )}
        </>
      )}
    </div>
  );
};

export const Step4Documents = ({
  next,
  back,
  data,
  update,
  uploadedFiles,
  updateUploadedFiles,
  enrollmentInfo,
  preloadedDocuments,
}: any) => {
  const [showLegalModal, setShowLegalModal] = useState(false);

  const handleViewDocument = (documentType: "pagare" | "compromiso") => {
    const documentPaths = {
      pagare: "/documents/Pagaré.pdf",
      compromiso: "/documents/Servicios.pdf",
    };

    window.open(documentPaths[documentType], "_blank");
  };

  // Tipo de acudiente seleccionado en Step3
  const guardianType = data.guardian_type || "";

  // Determinar las claves de firma/huella según el tipo de acudiente
  const getGuardianDataKeys = () => {
    switch (guardianType) {
      case "Padre":
        return {
          signatureKey: "father_signature",
          fingerprintKey: "father_fingerprint",
          signaturePreloaded:
            preloadedDocuments?.father_signature?.preview_base64,
          fingerprintPreloaded:
            preloadedDocuments?.father_fingerprint?.preview_base64,
        };
      case "Madre":
        return {
          signatureKey: "mother_signature",
          fingerprintKey: "mother_fingerprint",
          signaturePreloaded:
            preloadedDocuments?.mother_signature?.preview_base64,
          fingerprintPreloaded:
            preloadedDocuments?.mother_fingerprint?.preview_base64,
        };
      case "Otro":
      case "Empresa":
      default:
        return {
          signatureKey: "guardian_signature",
          fingerprintKey: "guardian_fingerprint",
          signaturePreloaded:
            preloadedDocuments?.guardian_signature?.preview_base64,
          fingerprintPreloaded:
            preloadedDocuments?.guardian_fingerprint?.preview_base64,
        };
    }
  };

  const guardianDataKeys = getGuardianDataKeys();

  // Verificar si la firma y huella del acudiente están subidas (nuevo archivo O precargado)
  const hasGuardianSignature =
    uploadedFiles?.[guardianDataKeys.signatureKey] instanceof File ||
    !!guardianDataKeys.signaturePreloaded;
  const hasGuardianFingerprint =
    uploadedFiles?.[guardianDataKeys.fingerprintKey] instanceof File ||
    !!guardianDataKeys.fingerprintPreloaded;

  // Determinar si mostrar firmas opcionales de padres (solo si viven con el estudiante Y no son el acudiente)
  const showOptionalFatherFields =
    data.father_lives_with_student && guardianType !== "Padre";
  const showOptionalMotherFields =
    data.mother_lives_with_student && guardianType !== "Madre";

  // Obtener el nombre del acudiente para mostrar en el título
  const getGuardianLabel = () => {
    switch (guardianType) {
      case "Padre":
        return "Padre (Acudiente)";
      case "Madre":
        return "Madre (Acudiente)";
      case "Empresa":
        return data.guardian_full_name || "Empresa (Acudiente)";
      case "Otro":
        return data.guardian_full_name || "Acudiente";
      default:
        return "Acudiente";
    }
  };

  const isValid =
    data.pagareAccepted &&
    data.compromiseAccepted &&
    hasGuardianSignature &&
    hasGuardianFingerprint;

  const handleNext = () => {
    if (!isValid) return;
    setShowLegalModal(true);
  };

  const handleAcceptLegal = () => {
    setShowLegalModal(false);
    next();
  };

  const handleDeclineLegal = () => {
    setShowLegalModal(false);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-secondary">Firmas y Documentos</h2>

      {/* Sección de Firmas y Huellas */}
      <div className="border p-4 rounded-lg bg-blue-50">
        <h3 className="font-bold mb-4">1. Firmas y Huellas</h3>

        {/* Firma/Huella del Acudiente (OBLIGATORIO) */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <h4 className="font-semibold text-primary">{getGuardianLabel()}</h4>
            <span className="badge badge-error badge-sm">Obligatorio</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4 bg-white p-4 rounded-lg">
              <SignatureUpload
                label={`Firma del ${getGuardianLabel()}`}
                dataKey={guardianDataKeys.signatureKey}
                uploadedFiles={uploadedFiles}
                updateUploadedFiles={updateUploadedFiles}
                preloadedUrl={guardianDataKeys.signaturePreloaded}
              />
            </div>
            <div className="space-y-4 bg-white p-4 rounded-lg">
              <FingerprintUpload
                label={`Huella del ${getGuardianLabel()}`}
                dataKey={guardianDataKeys.fingerprintKey}
                uploadedFiles={uploadedFiles}
                updateUploadedFiles={updateUploadedFiles}
                preloadedUrl={guardianDataKeys.fingerprintPreloaded}
              />
            </div>
          </div>
        </div>

        {/* Firmas/Huellas Opcionales de Padres */}
        {(showOptionalFatherFields || showOptionalMotherFields) && (
          <div className="border-t border-blue-200 pt-6 mt-6">
            <div className="flex items-center gap-2 mb-4">
              <h4 className="font-semibold text-gray-600">
                Firmas Adicionales (Padres que viven con el estudiante)
              </h4>
              <span className="badge badge-info badge-sm">Opcional</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Padre (opcional) */}
              {showOptionalFatherFields && (
                <div className="space-y-4 bg-white p-4 rounded-lg border border-dashed border-gray-300">
                  <h5 className="font-medium text-gray-700">Padre</h5>
                  <SignatureUpload
                    label="Firma del Padre"
                    dataKey="father_signature"
                    uploadedFiles={uploadedFiles}
                    updateUploadedFiles={updateUploadedFiles}
                    preloadedUrl={
                      preloadedDocuments?.father_signature?.preview_base64
                    }
                  />
                  <FingerprintUpload
                    label="Huella del Padre"
                    dataKey="father_fingerprint"
                    uploadedFiles={uploadedFiles}
                    updateUploadedFiles={updateUploadedFiles}
                    preloadedUrl={
                      preloadedDocuments?.father_fingerprint?.preview_base64
                    }
                  />
                </div>
              )}

              {/* Madre (opcional) */}
              {showOptionalMotherFields && (
                <div className="space-y-4 bg-white p-4 rounded-lg border border-dashed border-gray-300">
                  <h5 className="font-medium text-gray-700">Madre</h5>
                  <SignatureUpload
                    label="Firma de la Madre"
                    dataKey="mother_signature"
                    uploadedFiles={uploadedFiles}
                    updateUploadedFiles={updateUploadedFiles}
                    preloadedUrl={
                      preloadedDocuments?.mother_signature?.preview_base64
                    }
                  />
                  <FingerprintUpload
                    label="Huella de la Madre"
                    dataKey="mother_fingerprint"
                    uploadedFiles={uploadedFiles}
                    updateUploadedFiles={updateUploadedFiles}
                    preloadedUrl={
                      preloadedDocuments?.mother_fingerprint?.preview_base64
                    }
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Documentos Legales */}
      <div className="space-y-4">
        <h3 className="font-bold">2. Documentos Legales</h3>

        {/* Pagaré */}
        <div className="card bg-base-100 border shadow-sm">
          <div className="card-body p-4">
            <div className="flex items-center gap-3">
              <div className="bg-red-100 p-2 rounded text-red-600 font-bold">
                PDF
              </div>
              <div className="flex-1">
                <h4 className="font-semibold">Pagaré educativo</h4>
                <button
                  type="button"
                  onClick={() => handleViewDocument("pagare")}
                  className="link link-primary text-xs"
                >
                  Ver documento
                </button>
              </div>
              <input
                type="checkbox"
                className="checkbox checkbox-primary"
                checked={data.pagareAccepted}
                onChange={(e) => update({ pagareAccepted: e.target.checked })}
              />
            </div>
          </div>
        </div>

        {/* Compromiso */}
        <div className="card bg-base-100 border shadow-sm">
          <div className="card-body p-4">
            <div className="flex items-center gap-3">
              <div className="bg-red-100 p-2 rounded text-red-600 font-bold">
                PDF
              </div>
              <div className="flex-1">
                <h4 className="font-semibold">
                  Contrato prestación servicios educativos
                </h4>
                <button
                  type="button"
                  onClick={() => handleViewDocument("compromiso")}
                  className="link link-primary text-xs"
                >
                  Ver documento
                </button>
              </div>
              <input
                type="checkbox"
                className="checkbox checkbox-primary"
                checked={data.compromiseAccepted}
                onChange={(e) =>
                  update({ compromiseAccepted: e.target.checked })
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* Botones de navegación */}
      <div className="flex justify-between mt-8">
        <button className="btn btn-ghost" onClick={back}>
          Atrás
        </button>
        <button
          className="btn btn-primary"
          onClick={handleNext}
          disabled={!isValid}
        >
          Siguiente
        </button>
      </div>

      {/* Modal de Advertencia Legal */}
      <Alert
        isOpen={showLegalModal}
        onClose={handleDeclineLegal}
        onAccept={handleAcceptLegal}
        title="Aviso Legal Importante"
        variant="warning"
        acceptText="Acepto y Continuar"
        // Personalización de botones:
        acceptButtonClassName="bg-primary hover:bg-primary/80 text-white"
        // O usar variantes de shadcn:
        acceptButtonVariant="default"
      >
        <p className="text-justify">
          La persona que sea registrada como{" "}
          <strong>tutor y/o acudiente responsable</strong> del estudiante será,
          para todos los efectos legales, la{" "}
          <strong>
            única persona que responde legal, académica y económicamente
          </strong>{" "}
          por él ante la institución educativa.
        </p>
        <p className="text-justify">
          En consecuencia, es esta persona quien{" "}
          <strong>obligatoriamente deberá firmar todos los documentos</strong>{" "}
          relacionados con la matrícula, el contrato de prestación de servicios
          educativos, los pagarés, autorizaciones y demás documentos
          institucionales, entendiéndose que su firma implica la{" "}
          <strong>
            aceptación de las obligaciones, condiciones y compromisos
          </strong>{" "}
          derivados del servicio educativo.
        </p>
      </Alert>
    </div>
  );
};
