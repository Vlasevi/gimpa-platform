import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, UserRole } from '@/context/AuthContext';
import { RolePickerModal } from '@/components/RolePickerModal';
import heroImage from '@/assets/login-hero.jpg';

const MOCK_AUTH = true; // TODO(prod): Set to false

export default function Login() {
  const [showRolePicker, setShowRolePicker] = useState(false);
  const { setAuth, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/app/estudiantes');
    }
  }, [isAuthenticated, navigate]);

  const handleMicrosoftLogin = () => {
    if (MOCK_AUTH) {
      setShowRolePicker(true);
    } else {
      // TODO(prod): Redirect to Microsoft OAuth
      // window.location.href = '/auth/login';
    }
  };

  const handleRoleSelect = (role: UserRole) => {
    // Mock user data
    const mockUser = {
      id: '1',
      name: role === 'coordinadora' ? 'Ana García' : role === 'profesor' ? 'Carlos López' : 'María Rodríguez',
      email: `${role}@escuela.edu`,
    };

    setAuth(mockUser, role);
    setShowRolePicker(false);
    navigate('/app/estudiantes');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-background to-secondary">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-primary-foreground text-3xl mb-4">
              📚
            </div>
          </div>

          {/* Title */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">Bienvenido</h1>
            <p className="text-muted-foreground">
              Sistema de gestión de matrículas y académico
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
          <p className="text-xs text-center text-muted-foreground px-8">
            Al continuar, aceptas nuestros{' '}
            <a href="#" className="underline hover:text-foreground">
              Términos de Servicio
            </a>{' '}
            y{' '}
            <a href="#" className="underline hover:text-foreground">
              Política de Privacidad
            </a>
          </p>
        </div>
      </div>

      {/* Right side - Hero Image */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <img
          src={heroImage}
          alt="Estudiantes colaborando"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
      </div>

      {/* Role Picker Modal (mock only) */}
      <RolePickerModal
        isOpen={showRolePicker}
        onSelectRole={handleRoleSelect}
      />
    </div>
  );
}
