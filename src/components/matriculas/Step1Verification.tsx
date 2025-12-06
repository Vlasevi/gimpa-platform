// components/matriculas/steps/Step1Verification.tsx
import { useState } from "react";
import { apiUrl, API_ENDPOINTS, buildHeaders } from "@/utils/api";

export const Step1Verification = ({
  next,
  userEmail,
  onEnrollmentInfoLoaded,
  onDocumentsLoaded,
}: {
  next: () => void;
  userEmail: any;
  onEnrollmentInfoLoaded: (info: any) => void;
  onDocumentsLoaded: (docs: any) => void;
}) => {
  const [tokenSent, setTokenSent] = useState(false);
  const [inputToken, setInputToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [error, setError] = useState("");

  const handleRequestToken = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(apiUrl(API_ENDPOINTS.requestOtp), {
        method: "POST",
        credentials: "include",
        headers: buildHeaders(),
      });

      if (response.ok) {
        setTokenSent(true);
        console.log("📧 Código enviado al correo");
      } else {
        const data = await response.json();
        setError(data.message || "Error al enviar el código");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Error de conexión. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleValidateToken = async () => {
    setLoading(true);
    setLoadingMessage("Validando...");
    setError("");

    try {
      // 1. Validate OTP
      const response = await fetch(apiUrl(API_ENDPOINTS.validateOtp), {
        method: "POST",
        credentials: "include",
        headers: buildHeaders(),
        body: JSON.stringify({ code: inputToken }),
      });

      const data = await response.json();

      if (!response.ok || !data.valid) {
        setError(data.message || "Código incorrecto");
        setLoading(false);
        setLoadingMessage("");
        return;
      }

      console.log("✅ Código validado correctamente");

      // 2. Load enrollment info
      setLoadingMessage("Cargando información...");

      const enrollmentResponse = await fetch(
        apiUrl(API_ENDPOINTS.enrollments),
        { credentials: "include" }
      );

      if (!enrollmentResponse.ok) {
        setError("Error al cargar información de matrícula");
        setLoading(false);
        setLoadingMessage("");
        return;
      }

      const enrollmentData = await enrollmentResponse.json();
      onEnrollmentInfoLoaded(enrollmentData);
      console.log("📋 Información de matrícula cargada");

      // 3. Load documents if enrollment exists
      const enrollmentId = enrollmentData?.current_enrollment?.id;

      if (enrollmentId) {
        setLoadingMessage("Cargando documentos...");

        try {
          const docsResponse = await fetch(
            apiUrl(API_ENDPOINTS.enrollmentDocuments(enrollmentId)),
            { credentials: "include" }
          );

          if (docsResponse.ok) {
            const docsData = await docsResponse.json();
            const docs = docsData.documents || {};

            // Save ALL documents (photos, signatures, PDFs, etc.)
            onDocumentsLoaded(docs);
            console.log(
              "📄 Documentos cargados:",
              Object.keys(docs).filter((k) => docs[k])
            );
          }
        } catch (docError) {
          console.error("Error loading documents:", docError);
          // Continue anyway - documents are optional
        }
      }

      // 4. Advance to next step
      next();
    } catch (error) {
      console.error("Error:", error);
      setError("Error de conexión. Intenta nuevamente.");
    } finally {
      setLoading(false);
      setLoadingMessage("");
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-secondary mb-4">
        Verificación de Identidad
      </h2>
      <p className="text-gray-600">
        Para iniciar la matrícula, necesitamos validar tu identidad. Enviaremos
        un código al correo del acudiente registrado.
      </p>

      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      )}

      {!tokenSent ? (
        <button
          className="btn btn-primary"
          onClick={handleRequestToken}
          disabled={loading}
        >
          {loading ? (
            <span className="loading loading-spinner"></span>
          ) : (
            "Enviar Código"
          )}
        </button>
      ) : (
        <div className="form-control w-full max-w-xs animate-fade-in">
          <label className="label">
            <span className="label-text">Ingresa el código recibido</span>
          </label>
          <input
            type="text"
            placeholder="123456"
            className="input input-bordered w-full mb-4"
            value={inputToken}
            onChange={(e) => setInputToken(e.target.value)}
            maxLength={6}
            disabled={loading}
          />

          <button
            className="btn btn-secondary w-full mb-2"
            onClick={handleValidateToken}
            disabled={loading || inputToken.length !== 6}
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                {loadingMessage}
              </>
            ) : (
              "Validar y Continuar"
            )}
          </button>

          {/* Resend OTP button - separated */}
          <button
            type="button"
            className="btn btn-ghost btn-sm w-full"
            onClick={handleRequestToken}
            disabled={loading}
          >
            ¿No recibiste el código? Reenviar
          </button>
        </div>
      )}
    </div>
  );
};
