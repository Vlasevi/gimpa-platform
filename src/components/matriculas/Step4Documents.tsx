// components/matriculas/steps/Step4Documents.tsx
import { useState, useEffect } from "react";

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

  // Determinar si el acudiente es diferente de padre o madre
  const guardianType = data.guardian_type || "";
  const showGuardianFields =
    guardianType !== "Padre" && guardianType !== "Madre";

  // Determinar qué firmas/huellas mostrar según con quién vive el estudiante
  const showFatherFields = data.father_lives_with_student || false;
  const showMotherFields = data.mother_lives_with_student || false;
  const showOtherGuardianFields = data.lives_with_other || false;

  const isValid = data.pagareAccepted && data.compromiseAccepted;

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

      {/* Sección de Firmas y Huellas de Padres/Acudiente */}
      <div className="border p-4 rounded-lg bg-blue-50">
        <h3 className="font-bold mb-4">1. Firmas y Huellas</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Padre - solo si vive con el estudiante */}
          {showFatherFields && (
            <div className="space-y-4 bg-white p-4 rounded-lg">
              <h4 className="font-semibold text-primary">
                {showMotherFields ? "Acudiente 1 (Padre)" : "Acudiente 1 (Padre)"}
              </h4>
              <SignatureUpload
                label={showMotherFields ? "Firma Acudiente 1 (Padre)" : "Firma Acudiente 1 (Padre)"}
                dataKey="father_signature"
                uploadedFiles={uploadedFiles}
                updateUploadedFiles={updateUploadedFiles}
                preloadedUrl={
                  preloadedDocuments?.father_signature?.preview_base64
                }
              />
              <FingerprintUpload
                label={showMotherFields ? "Huella Acudiente 1 (Padre)" : "Huella Acudiente 1 (Padre)"}
                dataKey="father_fingerprint"
                uploadedFiles={uploadedFiles}
                updateUploadedFiles={updateUploadedFiles}
                preloadedUrl={
                  preloadedDocuments?.father_fingerprint?.preview_base64
                }
              />
            </div>
          )}

          {/* Madre - solo si vive con el estudiante */}
          {showMotherFields && (
            <div className="space-y-4 bg-white p-4 rounded-lg">
              <h4 className="font-semibold text-primary">
                {showFatherFields ? "Acudiente 2 (Madre)" : "Acudiente 1 (Madre)"}
              </h4>
              <SignatureUpload
                label={showFatherFields ? "Firma Acudiente 2 (Madre)" : "Firma Acudiente 1 (Madre)"}
                dataKey="mother_signature"
                uploadedFiles={uploadedFiles}
                updateUploadedFiles={updateUploadedFiles}
                preloadedUrl={
                  preloadedDocuments?.mother_signature?.preview_base64
                }
              />
              <FingerprintUpload
                label={showFatherFields ? "Huella Acudiente 2 (Madre)" : "Huella Acudiente 1 (Madre)"}
                dataKey="mother_fingerprint"
                uploadedFiles={uploadedFiles}
                updateUploadedFiles={updateUploadedFiles}
                preloadedUrl={
                  preloadedDocuments?.mother_fingerprint?.preview_base64
                }
              />
            </div>
          )}

          {/* Acudiente - solo si vive con otra persona */}
          {showOtherGuardianFields && showGuardianFields && (
            <div className="space-y-4 bg-white p-4 rounded-lg md:col-span-2">
              <h4 className="font-semibold text-primary">Acudiente</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SignatureUpload
                  label="Firma del Acudiente"
                  dataKey="guardian_signature"
                  uploadedFiles={uploadedFiles}
                  updateUploadedFiles={updateUploadedFiles}
                  preloadedUrl={
                    preloadedDocuments?.guardian_signature?.preview_base64
                  }
                />
                <FingerprintUpload
                  label="Huella del Acudiente"
                  dataKey="guardian_fingerprint"
                  uploadedFiles={uploadedFiles}
                  updateUploadedFiles={updateUploadedFiles}
                  preloadedUrl={
                    preloadedDocuments?.guardian_fingerprint?.preview_base64
                  }
                />
              </div>
            </div>
          )}
        </div>
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
      {showLegalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Fondo difuminado */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
            onClick={handleDeclineLegal}
          ></div>
          
          {/* Modal */}
          <div className="relative bg-white rounded-lg shadow-2xl max-w-2xl w-full mx-4 p-8 z-10">
            <div className="flex items-start mb-6">
              <div className="shrink-0">
                <svg 
                  className="w-12 h-12 text-warning" 
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
              </div>
              <div className="ml-4 flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Aviso Legal Importante
                </h3>
                <div className="text-gray-700 leading-relaxed space-y-4">
                  <p className="text-justify">
                    La persona que sea registrada como <strong>tutor y/o acudiente responsable</strong> del estudiante será, para todos los efectos legales, la <strong>única persona que responde legal, académica y económicamente</strong> por él ante la institución educativa.
                  </p>
                  <p className="text-justify">
                    En consecuencia, es esta persona quien <strong>obligatoriamente deberá firmar todos los documentos</strong> relacionados con la matrícula, el contrato de prestación de servicios educativos, los pagarés, autorizaciones y demás documentos institucionales, entendiéndose que su firma implica la <strong>aceptación de las obligaciones, condiciones y compromisos</strong> derivados del servicio educativo.
                  </p>
                </div>
              </div>
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-3 mt-8">
              <button
                className="btn btn-ghost"
                onClick={handleDeclineLegal}
              >
                Cancelar
              </button>
              <button
                className="btn btn-primary"
                onClick={handleAcceptLegal}
              >
                Acepto y Continuar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
