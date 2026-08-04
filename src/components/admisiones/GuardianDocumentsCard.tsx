import { useCallback, useEffect, useRef, useState } from "react";
import {
  Loader2,
  Upload,
  AlertCircle,
  CheckCircle2,
  Clock,
  Circle,
  MinusCircle,
  ExternalLink,
} from "lucide-react";

import { apiUrl, apiFetch, API_ENDPOINTS } from "@/utils/api";

interface DocumentRow {
  doc_type: string;
  label: string;
  status: string;
  status_label: string;
  url: string | null;
  reject_reason: string | null;
  note_public: string | null;
}

/** Estados en los que el acudiente puede (o debe) cargar el archivo. */
const CAN_UPLOAD = ["NO_CARGADO", "RECHAZADO"];

const STATUS_ICON: Record<string, { Icon: typeof CheckCircle2; className: string }> = {
  APROBADO: { Icon: CheckCircle2, className: "text-accent" },
  CARGADO: { Icon: Clock, className: "text-primary" },
  RECHAZADO: { Icon: AlertCircle, className: "text-warning" },
  NO_APLICA: { Icon: MinusCircle, className: "text-base-content/30" },
  PENDIENTE_POSTERIOR: { Icon: Clock, className: "text-base-content/40" },
};

export function GuardianDocumentsCard({
  code,
  onChanged,
}: {
  code: string;
  onChanged: () => void;
}) {
  const [documents, setDocuments] = useState<DocumentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputs = useRef<Record<string, HTMLInputElement | null>>({});

  const load = useCallback(async () => {
    try {
      const res = await apiFetch(API_ENDPOINTS.admissionsDocuments(code));
      if (res.ok) setDocuments((await res.json()).documents ?? []);
      else setError("No pudimos cargar los documentos.");
    } catch {
      setError("No pudimos conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  }, [code]);

  useEffect(() => {
    load();
  }, [load]);

  const upload = async (docType: string, file: File) => {
    setUploading(docType);
    setError(null);

    const body = new FormData();
    body.append("doc_type", docType);
    body.append("file", file);

    try {
      // FormData: sin Content-Type manual; el Bearer lo pone el interceptor global.
      const res = await fetch(apiUrl(API_ENDPOINTS.admissionsDocuments(code)), {
        method: "POST",
        body,
      });
      if (res.ok) {
        setDocuments((await res.json()).documents ?? []);
        onChanged();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(
          typeof data?.detail === "string"
            ? data.detail
            : "No pudimos subir el documento.",
        );
      }
    } catch {
      setError("No pudimos conectar con el servidor.");
    } finally {
      setUploading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-base-300 bg-base-100 p-6 text-base-content/60 shadow-sm">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
        Cargando documentos…
      </div>
    );
  }

  const pending = documents.filter((d) => CAN_UPLOAD.includes(d.status)).length;

  return (
    <div className="rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-display text-xl font-bold text-secondary">Documentos</h2>
        <span className="text-sm text-base-content/60">
          {pending === 0
            ? "No falta ninguno"
            : `${pending} por cargar`}
        </span>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-4 flex items-start gap-3 rounded-xl border border-error/25 bg-error/5 p-4 text-sm text-base-content/80"
        >
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-error" />
          <span>{error}</span>
        </div>
      )}

      <ul className="divide-y divide-base-300">
        {documents.map((doc) => {
          const { Icon, className } = STATUS_ICON[doc.status] ?? {
            Icon: Circle,
            className: "text-base-content/25",
          };
          const canUpload = CAN_UPLOAD.includes(doc.status);
          const busy = uploading === doc.doc_type;

          return (
            <li key={doc.doc_type} className="py-4 first:pt-0 last:pb-0">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-3">
                  <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${className}`} />
                  <div className="min-w-0">
                    <p className="font-medium text-base-content">{doc.label}</p>
                    <p className="text-sm text-base-content/60">{doc.status_label}</p>

                    {/* Motivo del rechazo: lo que el acudiente debe corregir */}
                    {doc.reject_reason && (
                      <p className="mt-1 text-sm text-warning">{doc.reject_reason}</p>
                    )}
                    {doc.note_public && (
                      <p className="mt-1 text-sm text-base-content/60">
                        {doc.note_public}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {doc.url && (
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-base-300 bg-base-100 px-3 text-sm font-medium text-base-content transition-colors hover:bg-base-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Ver
                    </a>
                  )}

                  {canUpload && (
                    <>
                      <input
                        ref={(el) => {
                          inputs.current[doc.doc_type] = el;
                        }}
                        type="file"
                        accept="image/*,application/pdf"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) upload(doc.doc_type, f);
                          e.target.value = "";
                        }}
                      />
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => inputs.current[doc.doc_type]?.click()}
                        className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-primary px-4 text-sm font-medium text-primary-content transition-all duration-200 ease-out hover:bg-primary/95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:transition-none"
                      >
                        {busy ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Subiendo…
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4" />
                            {doc.status === "RECHAZADO" ? "Reemplazar" : "Subir"}
                          </>
                        )}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
