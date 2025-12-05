// components/matriculas/steps/Step4Documents.tsx
import { useState, useEffect } from "react";

// Componente reutilizable para subir firma
const SignatureUpload = ({ label, dataKey, data, update, preloadedUrl }: any) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [useExisting, setUseExisting] = useState(!!preloadedUrl);

  useEffect(() => {
    const file = data[dataKey];
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
  }, [data[dataKey], dataKey, preloadedUrl, useExisting]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    update({ [dataKey]: file });
    setUseExisting(false);
  };

  const handleRemove = () => {
    update({ [dataKey]: null });
    setUseExisting(false);
  };

  const handleKeepExisting = () => {
    update({ [dataKey]: null });
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
              <span className="text-info text-xs">✓ Firma existente cargada</span>
            ) : data[dataKey] ? (
              <span className="text-success text-xs">✓ {data[dataKey].name}</span>
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
            key={data[dataKey] ? 'has-file' : 'no-file'}
          />
          {data[dataKey] && (
            <button
              type="button"
              onClick={handleRemove}
              className="btn btn-xs btn-ghost"
            >
              ✕ Quitar
            </button>
          )}
          {preloadedUrl && !data[dataKey] && (
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
const FingerprintUpload = ({ label, dataKey, data, update, preloadedUrl }: any) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [useExisting, setUseExisting] = useState(!!preloadedUrl);

  useEffect(() => {
    const file = data[dataKey];
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
  }, [data[dataKey], dataKey, preloadedUrl, useExisting]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    update({ [dataKey]: file });
    setUseExisting(false);
  };

  const handleRemove = () => {
    update({ [dataKey]: null });
    setUseExisting(false);
  };

  const handleKeepExisting = () => {
    update({ [dataKey]: null });
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
            <span className="text-info text-xs">✓ Huella existente cargada</span>
          ) : data[dataKey] ? (
            <span className="text-success text-xs">✓ {data[dataKey].name}</span>
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
            key={data[dataKey] ? 'has-file' : 'no-file'}
          />
          {data[dataKey] && (
            <button
              type="button"
              onClick={handleRemove}
              className="btn btn-xs btn-ghost"
            >
              ✕ Quitar
            </button>
          )}
          {preloadedUrl && !data[dataKey] && (
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
  enrollmentInfo,
  preloadedDocuments,
}: any) => {


  const handleViewDocument = (documentType: "pagare" | "compromiso") => {
    const documentPaths = {
      pagare: "/documents/Pagaré.pdf",
      compromiso: "/documents/Servicios.pdf",
    };

    window.open(documentPaths[documentType], "_blank");
  };

  // Determinar si el acudiente es diferente de padre o madre
  const guardianType = data.guardian_type || "";
  const showGuardianFields = guardianType !== "Padre" && guardianType !== "Madre";

  const isValid = data.pagareAccepted && data.compromiseAccepted;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-secondary">Firmas y Documentos</h2>

      {/* Sección de Firmas y Huellas de Padres/Acudiente */}
      <div className="border p-4 rounded-lg bg-blue-50">
        <h3 className="font-bold mb-4">1. Firmas y Huellas (Opcional)</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Padre */}
          <div className="space-y-4 bg-white p-4 rounded-lg">
            <h4 className="font-semibold text-primary">Padre</h4>
            <SignatureUpload
              label="Firma del Padre"
              dataKey="father_signature"
              data={data}
              update={update}
              preloadedUrl={preloadedDocuments?.father_signature?.preview_base64}
            />
            <FingerprintUpload
              label="Huella del Padre"
              dataKey="father_fingerprint"
              data={data}
              update={update}
              preloadedUrl={preloadedDocuments?.father_fingerprint?.preview_base64}
            />
          </div>

          {/* Madre */}
          <div className="space-y-4 bg-white p-4 rounded-lg">
            <h4 className="font-semibold text-primary">Madre</h4>
            <SignatureUpload
              label="Firma de la Madre"
              dataKey="mother_signature"
              data={data}
              update={update}
              preloadedUrl={preloadedDocuments?.mother_signature?.preview_base64}
            />
            <FingerprintUpload
              label="Huella de la Madre"
              dataKey="mother_fingerprint"
              data={data}
              update={update}
              preloadedUrl={preloadedDocuments?.mother_fingerprint?.preview_base64}
            />
          </div>

          {/* Acudiente (solo si no es padre ni madre) */}
          {showGuardianFields && (
            <div className="space-y-4 bg-white p-4 rounded-lg md:col-span-2">
              <h4 className="font-semibold text-primary">Acudiente</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SignatureUpload
                  label="Firma del Acudiente"
                  dataKey="guardian_signature"
                  data={data}
                  update={update}
                  preloadedUrl={preloadedDocuments?.guardian_signature?.preview_base64}
                />
                <FingerprintUpload
                  label="Huella del Acudiente"
                  dataKey="guardian_fingerprint"
                  data={data}
                  update={update}
                  preloadedUrl={preloadedDocuments?.guardian_fingerprint?.preview_base64}
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
                <h4 className="font-semibold">Contrato prestación servicios educativos</h4>
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
          onClick={() => {
            if (!isValid) return;
            next();
          }}
          disabled={!isValid}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};
