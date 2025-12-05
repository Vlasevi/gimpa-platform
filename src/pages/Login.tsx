import heroImage from "@/assets/login-hero.webp";
import Logo from "@/assets/logo.png";
import { loginUrl } from "@/components/Login/loginLogic";

export default function Login() {
  const handleMicrosoftLogin = () => {
    window.location.href = loginUrl;
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="basis-2/5 flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl text-primary text-3xl mb-4">
              <img src={Logo} alt="Logo" />
            </div>
          </div>

          {/* Title */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold tracking-tight text-accent">
              Bienvenid@s
            </h1>
            <p className="text-gray-600">
              Sistema de notas y matriculas de Gimnasio el Paraíso
            </p>
          </div>

          {/* Microsoft Login Button */}
          <button
            onClick={handleMicrosoftLogin}
            className="btn btn-primary w-full h-14 text-base gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 21 21" fill="none">
              <rect x="1" y="1" width="9" height="9" fill="#f25022" />
              <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
              <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
              <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
            </svg>
            Continuar con Microsoft
          </button>

          {/* Legal text */}
          <p className="text-xs text-center text-gray-500 px-8">
            Al continuar, aceptas nuestros{" "}
            <a href="#" className="underline hover:text-gray-900">
              Términos de Servicio
            </a>{" "}
            y{" "}
            <a href="#" className="underline hover:text-gray-900">
              Política de Privacidad
            </a>
          </p>
        </div>
      </div>

      {/* Right side - Hero Image */}
      <div className="hidden lg:flex basis-3/5 flex-1 relative overflow-hidden">
        <img
          src={heroImage}
          alt="Estudiantes colaborando"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
      </div>
    </div>
  );
}
