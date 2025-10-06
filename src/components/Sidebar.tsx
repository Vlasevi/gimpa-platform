import { NavLink } from 'react-router-dom';
import { useAuth, UserRole } from '@/context/AuthContext';

interface MenuItem {
  label: string;
  path: string;
  icon: string;
}

const MENU_BY_ROLE: Record<UserRole, MenuItem[]> = {
  coordinadora: [
    { label: 'Estudiantes', path: '/app/estudiantes', icon: '👥' },
    { label: 'Boletines', path: '/app/boletines', icon: '📰' },
    { label: 'Matrículas', path: '/app/matriculas', icon: '📁' },
    { label: 'Pagos', path: '/app/pagos', icon: '💳' },
  ],
  profesor: [
    { label: 'Estudiantes', path: '/app/estudiantes', icon: '👥' },
    { label: 'Notas', path: '/app/notas', icon: '📚' },
  ],
  estudiante: [
    { label: 'Notas', path: '/app/notas', icon: '📚' },
    { label: 'Matrículas', path: '/app/matriculas', icon: '📁' },
  ],
};

export const Sidebar = () => {
  const { role } = useAuth();

  if (!role) return null;

  const menuItems = MENU_BY_ROLE[role];

  return (
    <aside className="w-64 min-h-screen bg-sidebar-background border-r border-sidebar-border">
      <div className="p-6">
        <h2 className="text-xl font-bold text-sidebar-foreground">
          Sistema de Matrículas
        </h2>
      </div>

      <ul className="menu px-4 text-sidebar-foreground">
        {menuItems.map((item) => (
          <li key={item.path}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                  : 'hover:bg-sidebar-accent/50'
              }
            >
              <span className="text-xl mr-2">{item.icon}</span>
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
};
