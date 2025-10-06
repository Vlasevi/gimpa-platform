import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export const Navbar = () => {
  const { user, clearAuth } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    navigate('/');
  };

  return (
    <header className="navbar bg-card border-b border-border px-6">
      <div className="flex-1">
        <span className="text-xl font-bold">📚 Matrículas</span>
      </div>

      <div className="flex-none gap-4">
        {user && (
          <>
            <div className="flex items-center gap-2">
              <div className="avatar placeholder">
                <div className="bg-primary text-primary-foreground rounded-full w-10">
                  <span className="text-lg">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <span className="font-medium hidden sm:inline">{user.name}</span>
            </div>

            <button onClick={handleLogout} className="btn btn-ghost btn-sm">
              Salir
            </button>
          </>
        )}
      </div>
    </header>
  );
};
