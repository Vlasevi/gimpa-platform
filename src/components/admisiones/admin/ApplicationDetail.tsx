import { useCallback, useEffect, useState } from "react";
import {
  Loader2,
  X,
  AlertCircle,
  CheckCircle2,
  XCircle,
  MinusCircle,
  ExternalLink,
  ShieldAlert,
  Trash2,
  RotateCcw,
} from "lucide-react";

import { apiFetch, apiUrl, API_ENDPOINTS } from "@/utils/api";
import { usePermissions } from "@/components/Login/loginLogic";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { Alert } from "@/components/ui/Alert";
import { StatusBadge } from "@/components/admisiones/StatusBadge";
import { ApplicationDataView } from "@/components/admisiones/admin/ApplicationDataView";
import { InterviewsPanel } from "@/components/admisiones/admin/InterviewsPanel";
import { DecisionPanel } from "@/components/admisiones/admin/DecisionPanel";
import type { AdmissionApplication } from "@/components/admisiones/admissionTypes";

type Tab = "solicitud" | "validacion" | "pago" | "documentos" | "evaluacion" | "decision";

interface PaymentInfo {
  status: string;
  status_label?: string;
  amount: string | null;
  paid_at?: string | null;
  reference?: string | null;
  has_receipt?: boolean;
  receipt_url?: string | null;
  admin_note?: string | null;
}

interface DocumentRow {
  doc_type: string;
  label: string;
  sensitivity: string;
  status: string;
  status_label: string;
  url: string | null;
  reject_reason: string | null;
  note_public: string | null;
  note_internal?: string | null;
}

const DECISIONS = [
  { value: "CONTINUAR", label: "Continuar el proceso" },
  { value: "SOLICITAR_CORRECCION", label: "Solicitar corrección" },
  { value: "LISTA_ESPERA", label: "Dejar en lista de espera" },
  { value: "CASO_ESPECIAL", label: "Enviar a comité (caso especial)" },
  { value: "RECHAZAR_SIN_CUPO", label: "Rechazar por falta de cupo" },
];

// Estilo daisyui, igual que el resto (los dos usos son <select>).
const controlClass = "select select-bordered w-full focus:select-primary transition-all";

const primaryBtn =
  "inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-medium text-primary-content transition-all duration-200 ease-out hover:bg-primary/95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:transition-none";

const ghostBtn =
  "inline-flex h-10 items-center justify-center gap-1.5 rounded-lg border border-base-300 bg-base-100 px-3 text-sm font-medium text-base-content transition-colors hover:bg-base-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-60";

export function ApplicationDetail({
  code,
  onClose,
  onChanged,
}: {
  code: string;
  onClose: () => void;
  onChanged: () => void;
}) {
  useBodyScrollLock(true);
  const perms = usePermissions("admissions");

  const [tab, setTab] = useState<Tab>("solicitud");
  const [application, setApplication] = useState<AdmissionApplication | null>(null);
  const [payment, setPayment] = useState<PaymentInfo | null>(null);
  const [documents, setDocuments] = useState<DocumentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Formulario de decisión (P7)
  const [decision, setDecision] = useState("CONTINUAR");
  const [comment, setComment] = useState("");
  const [nextStep, setNextStep] = useState("pago");
  // Nota para las acciones de pago
  const [paymentNote, setPaymentNote] = useState("");
  // Rechazo de un documento: formulario en línea (sin diálogos nativos, ver DESIGN_SYSTEM §6)
  const [rejecting, setRejecting] = useState<{ docType: string; reason: string } | null>(
    null,
  );
  // Confirmación de borrado (soft/hard)
  const [confirm, setConfirm] = useState<{
    title: string;
    message: string;
    acceptText: string;
    onAccept: () => void;
  } | null>(null);

  // Toast de feedback + qué acción concreta está en curso (para su spinner).
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [pending, setPending] = useState<string | null>(null);
  const flash = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const load = useCallback(async () => {
    setError(null);
    try {
      const [appRes, payRes, docRes] = await Promise.all([
        apiFetch(API_ENDPOINTS.admissionsApplicationByCode(code)),
        apiFetch(API_ENDPOINTS.admissionsPayment(code)),
        apiFetch(API_ENDPOINTS.admissionsDocuments(code)),
      ]);
      if (appRes.ok) setApplication(await appRes.json());
      if (payRes.ok) setPayment(await payRes.json());
      if (docRes.ok) setDocuments((await docRes.json()).documents ?? []);
    } catch {
      setError("No pudimos cargar el expediente.");
    } finally {
      setLoading(false);
    }
  }, [code]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [onClose]);

  /** POST + recarga. `pendingKey` = qué botón muestra spinner; `successMsg` = toast al terminar. */
  const post = async (
    path: string,
    body: unknown,
    opts: { pendingKey?: string; successMsg?: string } = {},
  ) => {
    setBusy(true);
    setPending(opts.pendingKey ?? "busy");
    try {
      const res = await apiFetch(path, {
        method: "POST",
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        flash(
          "error",
          typeof data?.detail === "string" ? data.detail : "No se pudo completar la acción.",
        );
        return false;
      }
      await load();
      onChanged();
      if (opts.successMsg) flash("success", opts.successMsg);
      return true;
    } catch {
      flash("error", "No pudimos conectar con el servidor.");
      return false;
    } finally {
      setBusy(false);
      setPending(null);
    }
  };

  const submitDecision = async () => {
    const ok = await post(
      API_ENDPOINTS.admissionsValidation(code),
      {
        decision,
        comment: comment || undefined,
        next_step: decision === "CONTINUAR" ? nextStep : undefined,
      },
      { pendingKey: "decision", successMsg: "Decisión aplicada." },
    );
    if (ok) setComment("");
  };

  const PAYMENT_MSG: Record<string, string> = {
    validate: "Pago validado.",
    reject: "Comprobante rechazado.",
    exempt: "Marcado como exento.",
  };

  const reviewPayment = async (action: "validate" | "reject" | "exempt") => {
    const ok = await post(
      API_ENDPOINTS.admissionsPaymentReview(code),
      { action, note: paymentNote || undefined },
      { pendingKey: `pay-${action}`, successMsg: PAYMENT_MSG[action] },
    );
    if (ok) setPaymentNote("");
  };

  const reviewDocument = async (
    docType: string,
    action: "approve" | "reject" | "not_applicable",
    rejectReason?: string,
  ) =>
    post(
      API_ENDPOINTS.admissionsDocumentReview(code),
      { doc_type: docType, action, reject_reason: rejectReason },
      {
        pendingKey: `doc-${docType}-${action}`,
        successMsg:
          action === "approve"
            ? "Documento aprobado."
            : action === "reject"
              ? "Documento rechazado."
              : "Documento marcado como no aplica.",
      },
    );

  /** Elimina el expediente (soft o hard). Al terminar cierra el modal. */
  const doDelete = async (hard: boolean) => {
    setBusy(true);
    setError(null);
    try {
      const url = apiUrl(
        `${API_ENDPOINTS.admissionsApplicationByCode(code)}${hard ? "?hard=true" : ""}`,
      );
      const res = await fetch(url, { method: "DELETE" });
      if (res.ok) {
        onChanged();
        onClose();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.detail || "No se pudo eliminar.");
      }
    } catch {
      setError("No pudimos conectar con el servidor.");
    } finally {
      setBusy(false);
    }
  };

  const doRestore = () =>
    post(API_ENDPOINTS.admissionsApplicationRestore(code), {}, {
      pendingKey: "restore",
      successMsg: "Expediente restaurado.",
    });

  // Las pestañas se muestran por permiso: un usuario asignado a una entrevista (sin
  // permisos de validación/pago) solo ve Solicitud, Documentos y Evaluación.
  const TABS: { key: Tab; label: string }[] = [
    { key: "solicitud", label: "Solicitud" },
    ...(perms.canValidate ? [{ key: "validacion" as Tab, label: "Validación" }] : []),
    ...(perms.canManagePayments ? [{ key: "pago" as Tab, label: "Pago" }] : []),
    { key: "documentos", label: `Documentos (${documents.length})` },
    { key: "evaluacion", label: "Evaluación" },
    // La decisión solo la ve/gestiona el comité (rector/admin).
    ...(perms.canManageCommittee || perms.canDecide
      ? [{ key: "decision" as Tab, label: "Decisión" }]
      : []),
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-secondary/40 p-4 backdrop-blur-sm">
      {/* Toast de feedback (arriba a la derecha, por encima del modal) */}
      {toast && (
        <div
          role="status"
          className={`fixed right-4 top-4 z-[60] flex max-w-[calc(100vw-2rem)] items-center gap-2 rounded-xl border bg-base-100 px-4 py-3 text-sm shadow-lg duration-300 animate-in fade-in slide-in-from-top-2 slide-in-from-right-4 ${
            toast.type === "success" ? "border-accent/40 text-accent" : "border-error/40 text-error"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 shrink-0" />
          ) : (
            <XCircle className="h-5 w-5 shrink-0" />
          )}
          <span className="text-base-content/90">{toast.msg}</span>
        </div>
      )}
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-xl">
        {/* Header */}
        <div className="shrink-0 border-b border-base-300 px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h2 className="font-display text-xl font-bold text-secondary">
                {application?.applicant.full_name ?? "Expediente"}
              </h2>
              <p className="mt-0.5 text-sm text-base-content/60">
                {application
                  ? `${application.grade_name} · ${application.academic_year} · ${application.code}`
                  : code}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {application && (
                <StatusBadge
                  status={application.status}
                  label={application.status_label}
                />
              )}
              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar"
                className="rounded-full p-2 text-base-content/40 transition-colors hover:bg-base-200 hover:text-base-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Pestañas */}
          <div className="mt-4 flex gap-1">
            {TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  tab === t.key
                    ? "bg-primary/10 text-primary"
                    : "text-base-content/60 hover:bg-base-200"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Cuerpo — único con scroll (ver DESIGN_SYSTEM §12) */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {loading ? (
            <div className="flex items-center justify-center gap-3 py-12 text-base-content/60">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              Cargando expediente…
            </div>
          ) : (
            <>
              {error && (
                <div
                  role="alert"
                  className="mb-4 flex items-start gap-3 rounded-xl border border-error/25 bg-error/5 p-4 text-sm text-base-content/80"
                >
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-error" />
                  <span>{error}</span>
                </div>
              )}

              {/* -------------------- Solicitud (datos del acudiente) -------------------- */}
              {tab === "solicitud" && application && (
                <ApplicationDataView data={application.data} />
              )}

              {/* -------------------- Validación -------------------- */}
              {tab === "validacion" && (
                <div className="space-y-5">
                  {application?.correction_comment && (
                    <div className="rounded-xl border border-base-300 bg-base-200 p-4 text-sm">
                      <p className="font-medium text-base-content">
                        Última devolución
                      </p>
                      <p className="mt-1 whitespace-pre-line text-base-content/70">
                        {application.correction_comment}
                      </p>
                    </div>
                  )}

                  {perms.canValidate ? (
                    <div className="space-y-4 rounded-xl border border-base-300 p-4">
                      <h3 className="font-display font-semibold text-secondary">
                        Decisión de validación
                      </h3>

                      <div>
                        <label htmlFor="decision" className="mb-1.5 block text-sm font-medium text-base-content/70">
                          Decisión
                        </label>
                        <select
                          id="decision"
                          className={controlClass}
                          value={decision}
                          onChange={(e) => setDecision(e.target.value)}
                        >
                          {DECISIONS.map((d) => (
                            <option key={d.value} value={d.value}>
                              {d.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {decision === "CONTINUAR" && (
                        <div>
                          <label htmlFor="next-step" className="mb-1.5 block text-sm font-medium text-base-content/70">
                            Siguiente paso
                          </label>
                          <select
                            id="next-step"
                            className={controlClass}
                            value={nextStep}
                            onChange={(e) => setNextStep(e.target.value)}
                          >
                            <option value="pago">Pago de inscripción</option>
                            <option value="documentos">Documentos</option>
                          </select>
                        </div>
                      )}

                      <div>
                        <label htmlFor="comment" className="mb-1.5 block text-sm font-medium text-base-content/70">
                          Comentario
                          {decision === "SOLICITAR_CORRECCION" && (
                            <span className="text-error"> *</span>
                          )}
                        </label>
                        <textarea
                          id="comment"
                          rows={3}
                          className="w-full rounded-lg border border-base-300 bg-base-200 px-3 py-2 text-sm transition-colors focus:border-primary focus:bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary/40"
                          placeholder={
                            decision === "SOLICITAR_CORRECCION"
                              ? "Qué debe corregir el acudiente (lo recibirá por correo)"
                              : "Opcional"
                          }
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        />
                      </div>

                      <button
                        type="button"
                        onClick={submitDecision}
                        disabled={busy}
                        className={primaryBtn}
                      >
                        {pending === "decision" && (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        )}
                        Aplicar decisión
                      </button>
                    </div>
                  ) : (
                    <p className="text-sm text-base-content/60">
                      No tienes permiso para validar solicitudes.
                    </p>
                  )}
                </div>
              )}

              {/* -------------------- Pago -------------------- */}
              {tab === "pago" && (
                <div className="space-y-5">
                  <dl className="grid grid-cols-2 gap-4 rounded-xl border border-base-300 p-4 text-sm">
                    <div>
                      <dt className="text-base-content/60">Estado</dt>
                      <dd className="font-medium text-base-content">
                        {payment?.status_label ?? payment?.status ?? "—"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-base-content/60">Valor</dt>
                      <dd className="font-medium text-base-content">
                        {payment?.amount ? `$${payment.amount}` : "—"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-base-content/60">Fecha de pago</dt>
                      <dd className="text-base-content">{payment?.paid_at ?? "—"}</dd>
                    </div>
                    <div>
                      <dt className="text-base-content/60">Referencia</dt>
                      <dd className="text-base-content">{payment?.reference ?? "—"}</dd>
                    </div>
                    <div className="col-span-2">
                      <dt className="text-base-content/60">Comprobante</dt>
                      <dd className="text-base-content">
                        {payment?.receipt_url ? (
                          <a
                            href={payment.receipt_url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline"
                          >
                            <ExternalLink className="h-4 w-4" />
                            Ver comprobante
                          </a>
                        ) : payment?.has_receipt ? (
                          "Cargado (no se pudo abrir)"
                        ) : (
                          "Sin cargar"
                        )}
                      </dd>
                    </div>
                  </dl>

                  {payment?.admin_note && (
                    <p className="rounded-xl border border-base-300 bg-base-200 p-4 text-sm text-base-content/70">
                      {payment.admin_note}
                    </p>
                  )}

                  {perms.canManagePayments && (
                    <div className="space-y-3 rounded-xl border border-base-300 p-4">
                      <h3 className="font-display font-semibold text-secondary">
                        Revisar pago
                      </h3>
                      <textarea
                        rows={2}
                        className="w-full rounded-lg border border-base-300 bg-base-200 px-3 py-2 text-sm transition-colors focus:border-primary focus:bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary/40"
                        placeholder="Nota (obligatoria al rechazar: el acudiente la leerá)"
                        value={paymentNote}
                        onChange={(e) => setPaymentNote(e.target.value)}
                      />
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => reviewPayment("validate")}
                          disabled={busy}
                          className={`${ghostBtn} text-accent hover:bg-accent/10`}
                        >
                          {pending === "pay-validate" ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <CheckCircle2 className="h-4 w-4" />
                          )}
                          Validar
                        </button>
                        <button
                          type="button"
                          onClick={() => reviewPayment("reject")}
                          disabled={busy}
                          className={`${ghostBtn} text-error hover:bg-error/10`}
                        >
                          {pending === "pay-reject" ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <XCircle className="h-4 w-4" />
                          )}
                          Rechazar
                        </button>
                        <button
                          type="button"
                          onClick={() => reviewPayment("exempt")}
                          disabled={busy}
                          className={ghostBtn}
                        >
                          {pending === "pay-exempt" ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <MinusCircle className="h-4 w-4" />
                          )}
                          Eximir
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* -------------------- Documentos -------------------- */}
              {tab === "documentos" && (
                <ul className="divide-y divide-base-300">
                  {documents.map((doc) => (
                    <li key={doc.doc_type} className="py-4 first:pt-0 last:pb-0">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-medium text-base-content">{doc.label}</p>
                          <p className="text-sm text-base-content/60">
                            {doc.status_label}
                            {doc.sensitivity !== "normal" && (
                              <span className="ml-2 rounded-full border border-base-300 px-2 py-0.5 text-xs text-base-content/50">
                                {doc.sensitivity === "medical" ? "médico" : "sensible"}
                              </span>
                            )}
                          </p>
                          {doc.reject_reason && (
                            <p className="mt-1 text-sm text-error">{doc.reject_reason}</p>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5">
                          {doc.url && (
                            <a
                              href={doc.url}
                              target="_blank"
                              rel="noreferrer"
                              className={ghostBtn}
                            >
                              <ExternalLink className="h-4 w-4" />
                              Ver
                            </a>
                          )}
                          {perms.canReviewDocuments && doc.status === "CARGADO" && (
                            <>
                              <button
                                type="button"
                                onClick={() => reviewDocument(doc.doc_type, "approve")}
                                disabled={busy}
                                title="Aprobar"
                                className="rounded-full p-2 text-base-content/40 transition-colors hover:bg-accent/10 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-60"
                              >
                                {pending === `doc-${doc.doc_type}-approve` ? (
                                  <Loader2 className="h-5 w-5 animate-spin text-accent" />
                                ) : (
                                  <CheckCircle2 className="h-5 w-5" />
                                )}
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setRejecting({ docType: doc.doc_type, reason: "" })
                                }
                                disabled={busy}
                                title="Rechazar"
                                className="rounded-full p-2 text-base-content/40 transition-colors hover:bg-error/10 hover:text-error focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                              >
                                <XCircle className="h-5 w-5" />
                              </button>
                            </>
                          )}
                          {perms.canReviewDocuments && doc.status === "NO_CARGADO" && (
                            <button
                              type="button"
                              onClick={() =>
                                reviewDocument(doc.doc_type, "not_applicable")
                              }
                              disabled={busy}
                              title="Marcar como no aplica"
                              className="rounded-full p-2 text-base-content/40 transition-colors hover:bg-base-200 hover:text-base-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-60"
                            >
                              {pending === `doc-${doc.doc_type}-not_applicable` ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                              ) : (
                                <MinusCircle className="h-5 w-5" />
                              )}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Motivo del rechazo, en línea */}
                      {rejecting?.docType === doc.doc_type && (
                        <div className="mt-3 rounded-xl border border-error/25 bg-error/5 p-3">
                          <label
                            htmlFor={`reject-${doc.doc_type}`}
                            className="mb-1.5 block text-sm font-medium text-base-content/70"
                          >
                            ¿Por qué se rechaza? El acudiente lo va a leer.
                          </label>
                          <textarea
                            id={`reject-${doc.doc_type}`}
                            rows={2}
                            autoFocus
                            className="w-full rounded-lg border border-base-300 bg-base-100 px-3 py-2 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                            value={rejecting.reason}
                            onChange={(e) =>
                              setRejecting({ ...rejecting, reason: e.target.value })
                            }
                          />
                          <div className="mt-2 flex gap-2">
                            <button
                              type="button"
                              disabled={busy || !rejecting.reason.trim()}
                              onClick={async () => {
                                const ok = await reviewDocument(
                                  doc.doc_type,
                                  "reject",
                                  rejecting.reason,
                                );
                                if (ok) setRejecting(null);
                              }}
                              className={`${ghostBtn} text-error hover:bg-error/10`}
                            >
                              {pending === `doc-${doc.doc_type}-reject` && (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              )}
                              Confirmar rechazo
                            </button>
                            <button
                              type="button"
                              onClick={() => setRejecting(null)}
                              className={ghostBtn}
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      )}
                    </li>
                  ))}
                  {documents.length === 0 && (
                    <li className="py-8 text-center text-sm text-base-content/60">
                      No hay documentos visibles para tu rol.
                    </li>
                  )}
                </ul>
              )}

              {/* -------------------- Agenda + Evaluación -------------------- */}
              {tab === "evaluacion" && (
                <InterviewsPanel
                  code={code}
                  perms={perms}
                  flash={flash}
                  onChanged={onChanged}
                />
              )}

              {/* -------------------- Comité / Decisión -------------------- */}
              {tab === "decision" && (
                <DecisionPanel
                  code={code}
                  perms={perms}
                  flash={flash}
                  onChanged={onChanged}
                />
              )}
            </>
          )}
        </div>

        {/* Pie: eliminar / restaurar (solo con permiso) */}
        {perms.canDelete && !loading && application && (
          <div className="shrink-0 border-t border-base-300 px-6 py-4">
            {application.is_deleted ? (
              <button
                type="button"
                onClick={doRestore}
                disabled={busy}
                className={`${ghostBtn} text-accent hover:bg-accent/10`}
              >
                <RotateCcw className="h-4 w-4" />
                Restaurar
              </button>
            ) : (
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() =>
                    setConfirm({
                      title: "Eliminar solicitud",
                      message: `La solicitud de ${application.applicant.full_name} (${application.code}) se ocultará de los listados.`,
                      acceptText: "Eliminar",
                      onAccept: () => doDelete(false),
                    })
                  }
                  className={`${ghostBtn} text-error hover:bg-error/10`}
                >
                  <Trash2 className="h-4 w-4" />
                  Eliminar
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() =>
                    setConfirm({
                      title: "Eliminar permanentemente",
                      message: `Esto borra la solicitud de ${application.applicant.full_name} (${application.code}), con sus pagos, documentos y archivos. No se puede deshacer.`,
                      acceptText: "Eliminar para siempre",
                      onAccept: () => doDelete(true),
                    })
                  }
                  className={`${ghostBtn} text-error hover:bg-error/10`}
                >
                  <Trash2 className="h-4 w-4" />
                  Eliminar permanentemente
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {confirm && (
        <Alert
          isOpen={true}
          onClose={() => setConfirm(null)}
          onAccept={() => {
            const cb = confirm.onAccept;
            setConfirm(null);
            cb();
          }}
          title={confirm.title}
          variant="error"
          acceptText={confirm.acceptText}
          cancelText="Cancelar"
          acceptButtonVariant="destructive"
        >
          <p className="text-base-content/80">{confirm.message}</p>
        </Alert>
      )}
    </div>
  );
}
