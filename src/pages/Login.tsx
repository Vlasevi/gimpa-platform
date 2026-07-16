import { useState } from "react";
import {
  Loader2,
  Eye,
  EyeOff,
  ArrowLeft,
  Info,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/login-hero.webp";
import Logo from "@/assets/logo.png";
import { useAuth } from "@/components/Login/loginLogic";
import { apiUrl, AUTH_PATHS } from "@/utils/api";

// ---- Clases compartidas (ver DESIGN_SYSTEM.md) --------------------------
const labelClass = "mb-1.5 block text-sm font-medium text-base-content/70";

const inputClass =
  "h-12 w-full rounded-lg border border-base-300 bg-base-200 px-4 text-base text-base-content placeholder:text-base-content/40 transition-colors focus:border-primary focus:bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary/40";

const primaryBtnClass =
  "flex h-12 w-full items-center justify-center gap-3 rounded-xl bg-primary px-6 text-base font-medium text-primary-content shadow-sm transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-primary/95 hover:shadow-lg hover:shadow-primary/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-base-100 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70 motion-reduce:transition-none motion-reduce:hover:translate-y-0";

const secondaryBtnClass =
  "flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-base-300 bg-base-100 px-6 text-base font-medium text-base-content transition-all duration-200 ease-out hover:bg-base-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-base-100 motion-reduce:transition-none";

const linkClass =
  "font-medium text-primary transition-colors hover:text-primary/80 hover:underline focus-visible:outline-none focus-visible:underline";

// ---- Subcomponentes -----------------------------------------------------
type FieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
};

function TextField({
  id,
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  autoComplete,
}: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={inputClass}
      />
    </div>
  );
}

function PasswordField({
  id,
  label,
  value,
  onChange,
  placeholder,
  autoComplete,
}: FieldProps) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`${inputClass} pr-12`}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute inset-y-0 right-0 flex items-center px-4 text-base-content/50 transition-colors hover:text-base-content focus-visible:outline-none focus-visible:text-primary"
          aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
        >
          {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>
    </div>
  );
}

function MicrosoftIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 21 21" fill="none" aria-hidden="true">
      <rect x="1" y="1" width="9" height="9" fill="#f25022" />
      <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
      <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
      <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
    </svg>
  );
}

function Divider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-px flex-1 bg-base-300" />
      <span className="text-sm text-base-content/50">{label}</span>
      <span className="h-px flex-1 bg-base-300" />
    </div>
  );
}

function Notice({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-2 rounded-lg border border-base-300 bg-base-200 px-4 py-3 text-sm text-base-content/70">
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
      <span>{message}</span>
    </div>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-base-content/60 transition-colors hover:text-base-content focus-visible:outline-none focus-visible:text-primary"
    >
      <ArrowLeft className="h-4 w-4" />
      Volver
    </button>
  );
}

// ---- Pantalla -----------------------------------------------------------
type View = "main" | "email" | "register";

// Aviso reutilizable para las acciones que aún no tienen backend.
const SOON = "Esta opción estará disponible próximamente.";

export default function Login() {
  const navigate = useNavigate();
  const { loginWithPayload } = useAuth();
  const [view, setView] = useState<View>("main");
  const [isConnecting, setIsConnecting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);

  // Formulario de correo (mock)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Formulario de registro (mock)
  const [reg, setReg] = useState({
    fullName: "",
    email: "",
    password: "",
    confirm: "",
  });

  const goTo = (next: View) => {
    setNotice(null);
    setSubmitting(false);
    setView(next);
  };

  // SSO de Microsoft: navegación de página completa hacia el back.
  const handleMicrosoftLogin = () => {
    setIsConnecting(true);
    window.location.href = apiUrl(AUTH_PATHS.loginSocial);
  };

  // Mock: simula una llamada breve y luego muestra el aviso correspondiente.
  const mockSubmit = (message: string) => {
    setSubmitting(true);
    setNotice(null);
    setTimeout(() => {
      setSubmitting(false);
      setNotice(message);
    }, 700);
  };

  // Login real por correo/contraseña (acudientes de admisiones).
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setNotice(null);
    try {
      const res = await fetch(apiUrl(AUTH_PATHS.loginAdmissions), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        loginWithPayload(data);
        navigate("/dashboard", { replace: true });
      } else {
        setNotice(data.detail || "Correo o contraseña incorrectos.");
        setSubmitting(false);
      }
    } catch {
      setNotice("Error de conexión. Intenta nuevamente.");
      setSubmitting(false);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock: aquí, más adelante, dispararemos la verificación por correo.
    mockSubmit(
      "Cuenta creada (simulado). Pronto te enviaremos un correo para verificar tu cuenta.",
    );
  };

  return (
    <div className="flex min-h-screen bg-base-100">
      {/* Panel izquierdo — hero */}
      <div className="relative hidden overflow-hidden lg:block lg:w-1/2 xl:w-3/5">
        <img
          src={heroImage}
          alt="Estudiantes de Gimnasio El Paraíso"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-secondary/95 via-secondary/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 via-transparent to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-10 xl:p-14">
          {/* Acento de marca */}
          <div className="mb-4 h-1 w-12 rounded-full bg-accent" />
          <h2 className="font-display text-3xl font-semibold text-white xl:text-4xl">
            Gimnasio El Paraíso
          </h2>
          <p className="mt-3 max-w-md font-display text-lg font-light italic leading-snug text-white/85 xl:text-xl">
            «Con Fe, Esfuerzo y Sabiduría, formamos la Esperanza del Mañana»
          </p>
        </div>
        {/* Filo de acento en el borde interior del hero */}
        <div className="absolute inset-y-0 right-0 w-1 bg-accent/70" />
      </div>

      {/* Panel derecho — acceso (panel plano, estilo Figma) */}
      <div className="flex w-full flex-col items-center justify-center overflow-y-auto bg-base-100 px-6 py-10 sm:px-10 lg:w-1/2 xl:w-2/5">
        <div className="w-full max-w-sm">
          <div>
            {/* Marca */}
            <div className="mb-8 flex flex-col items-center text-center">
              <img
                src={Logo}
                alt="Escudo de Gimnasio El Paraíso"
                className="h-16 w-auto select-none"
                draggable={false}
              />
            </div>

            {/* ---------------- Vista principal ---------------- */}
            {view === "main" && (
              <div key="main" className="animate-view-in space-y-6">
                <div className="text-center">
                  <h1 className="font-display text-3xl font-bold tracking-tight text-secondary">
                    Bienvenid@s
                  </h1>
                  <p className="mt-2 text-base text-base-content/60">
                    Plataforma de gestión institucional
                  </p>
                </div>

                {notice && <Notice message={notice} />}

                <button
                  type="button"
                  onClick={handleMicrosoftLogin}
                  disabled={isConnecting}
                  className={primaryBtnClass}
                >
                  {isConnecting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Conectando…
                    </>
                  ) : (
                    <>
                      <MicrosoftIcon />
                      Continuar con Microsoft
                    </>
                  )}
                </button>

                <Divider label="o" />

                <div>
                  <button
                    type="button"
                    onClick={() => goTo("email")}
                    className={secondaryBtnClass}
                  >
                    Iniciar sesión con correo
                  </button>
                  <p className="mt-2.5 text-center text-sm text-base-content/60">
                    Solo para{" "}
                    <span className="font-semibold text-primary">
                      aspirantes en proceso de admisión
                    </span>
                  </p>
                </div>
              </div>
            )}

            {/* ---------------- Vista correo/contraseña ---------------- */}
            {view === "email" && (
              <div key="email" className="animate-view-in">
                <BackButton onClick={() => goTo("main")} />

                <div className="mb-5">
                  <h1 className="font-display text-2xl font-bold tracking-tight text-secondary">
                    Iniciar sesión
                  </h1>
                  <p className="mt-1 text-sm text-base-content/60">
                    Ingresa con tu correo y contraseña.
                  </p>
                </div>

                {/* Aviso permanente: este acceso es solo para admisiones */}
                <div className="mb-5 flex items-start gap-2 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-base-content/70">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>
                    Acceso exclusivo para{" "}
                    <strong className="font-semibold text-base-content">
                      aspirantes de admisiones
                    </strong>
                    . Si perteneces al colegio, ingresa con Microsoft.
                  </span>
                </div>

                {notice && (
                  <div className="mb-5">
                    <Notice message={notice} />
                  </div>
                )}

                <form onSubmit={handleEmailSubmit} className="space-y-5">
                  <TextField
                    id="email"
                    label="Correo electrónico"
                    type="email"
                    value={email}
                    onChange={setEmail}
                    placeholder="tucorreo@ejemplo.com"
                    autoComplete="email"
                  />
                  <PasswordField
                    id="password"
                    label="Contraseña"
                    value={password}
                    onChange={setPassword}
                    placeholder="Tu contraseña"
                    autoComplete="current-password"
                  />

                  <div className="flex items-center justify-between">
                    <label className="flex cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        className="toggle toggle-primary toggle-sm"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                      <span className="text-sm text-base-content/70">
                        Recuérdame
                      </span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setNotice(SOON)}
                      className={`text-sm ${linkClass}`}
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className={primaryBtnClass}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Verificando…
                      </>
                    ) : (
                      "Iniciar sesión"
                    )}
                  </button>
                </form>

                <p className="mt-6 text-center text-sm text-base-content/60">
                  ¿No tienes cuenta?{" "}
                  <button
                    type="button"
                    onClick={() => goTo("register")}
                    className={linkClass}
                  >
                    Regístrate
                  </button>
                </p>
              </div>
            )}

            {/* ---------------- Vista registro ---------------- */}
            {view === "register" && (
              <div key="register" className="animate-view-in">
                <BackButton onClick={() => goTo("email")} />

                <div className="mb-6">
                  <h1 className="font-display text-2xl font-bold tracking-tight text-secondary">
                    Crear cuenta
                  </h1>
                  <p className="mt-1 text-sm text-base-content/60">
                    Regístrate para el proceso de admisiones.
                  </p>
                </div>

                {notice && (
                  <div className="mb-5">
                    <Notice message={notice} />
                  </div>
                )}

                <form onSubmit={handleRegisterSubmit} className="space-y-5">
                  <TextField
                    id="reg-name"
                    label="Nombre completo"
                    value={reg.fullName}
                    onChange={(v) => setReg({ ...reg, fullName: v })}
                    placeholder="Ej: María Pérez"
                    autoComplete="name"
                  />
                  <TextField
                    id="reg-email"
                    label="Correo electrónico"
                    type="email"
                    value={reg.email}
                    onChange={(v) => setReg({ ...reg, email: v })}
                    placeholder="tucorreo@ejemplo.com"
                    autoComplete="email"
                  />
                  <PasswordField
                    id="reg-password"
                    label="Contraseña"
                    value={reg.password}
                    onChange={(v) => setReg({ ...reg, password: v })}
                    placeholder="Crea una contraseña"
                    autoComplete="new-password"
                  />
                  <PasswordField
                    id="reg-confirm"
                    label="Confirmar contraseña"
                    value={reg.confirm}
                    onChange={(v) => setReg({ ...reg, confirm: v })}
                    placeholder="Repite la contraseña"
                    autoComplete="new-password"
                  />

                  <button
                    type="submit"
                    disabled={submitting}
                    className={primaryBtnClass}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Creando cuenta…
                      </>
                    ) : (
                      "Crear cuenta"
                    )}
                  </button>
                </form>

                <p className="mt-6 text-center text-sm text-base-content/60">
                  ¿Ya tienes cuenta?{" "}
                  <button
                    type="button"
                    onClick={() => goTo("email")}
                    className={linkClass}
                  >
                    Inicia sesión
                  </button>
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <p className="mt-6 text-center text-xs text-base-content/40">
            © {new Date().getFullYear()} Gimnasio El Paraíso
          </p>
        </div>
      </div>
    </div>
  );
}
