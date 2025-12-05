import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "./Login/loginLogic";
import logo from "@/assets/platform-logo.png";
import { CreditCard, NotebookPen, BookUser, NotebookText } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface MenuItem {
  label: string;
  path: string;
  icon: LucideIcon;
  permissionKey: string[]; // <-- La llave que el backend debe enviar
}

const featureEnvMap = {
  Notas: import.meta.env.VITE_FEATURE_NOTAS === "true",
  Matrículas: import.meta.env.VITE_FEATURE_MATRICULAS === "true",
  Pagos: import.meta.env.VITE_FEATURE_PAGOS === "true",
  Certificados: import.meta.env.VITE_FEATURE_CERTIFICADOS === "true",
};

// 1. Esta lista es tu "mapa" del frontend
const ALL_MENU_ITEMS: MenuItem[] = [
  {
    label: "Notas",
    path: "/notas",
    icon: NotebookPen,
    permissionKey: ["manage_grades", "view_grades"],
  },
  {
    label: "Matrículas",
    path: "/matriculas",
    icon: BookUser,
    permissionKey: ["manage_enrollment", "make_enrollment"],
  },
  {
    label: "Pagos",
    path: "/pagos",
    icon: CreditCard,
    permissionKey: ["manage_payments"],
  },
  {
    label: "Certificados",
    path: "/certificados",
    icon: NotebookText,
    permissionKey: ["manage_certifications", "make_certification"],
  },
];
export const Sidebar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const filteredMenuItems = ALL_MENU_ITEMS.filter(
    (item) =>
      (Array.isArray(item.permissionKey)
        ? item.permissionKey.some((perm) => user.permissions.includes(perm))
        : user.permissions.includes(item.permissionKey)) &&
      featureEnvMap[item.label]
  );

  console.log("featureEnvMap:", featureEnvMap);
  console.log("user.permissions:", user.permissions);
  console.log("filteredMenuItems:", filteredMenuItems);

  if (!user) return null;

  return (
    <aside className="w-64 min-h-screen bg-[hsl(var(--accentlight))] border-r border-gray-200">
      {/* Logo con altura fija */}
      <div className="flex h-18 justify-center items-center px-4 py-6 mb-4 border-b border-gray-200">
        <img
          onClick={() => {
            navigate("/dashboard", { replace: true });
          }}
          src={logo}
          alt="GIMPA"
          className="cursor-pointer"
        />
      </div>

      <nav className="px-4 space-y-1">
        {filteredMenuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 text-sm font-inter rounded-lg transition-colors ${
                isActive
                  ? "bg-[hsl(var(--accent))] text-white shadow-sm"
                  : "text-gray-700 hover:bg-gray-100 hover:text-primary"
              }`
            }
          >
            <span className="text-lg mr-3">
              <item.icon />
            </span>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
