import { NavLink, useNavigate } from "react-router-dom";
import {
  useAuth,
  type UserPermissions,
  type SectionPermissions,
} from "./Login/loginLogic";
import logo from "@/assets/platform-logo.png";
import {
  CreditCard,
  NotebookPen,
  BookUser,
  NotebookText,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface MenuItem {
  label: string;
  path: string;
  icon: LucideIcon;
  section: keyof UserPermissions;
  anyOf: Array<keyof SectionPermissions>;
}

const featureEnvMap: Record<string, boolean> = {
  Notas: import.meta.env.VITE_FEATURE_NOTAS === "true",
  Matriculas: import.meta.env.VITE_FEATURE_MATRICULAS === "true",
  Pagos: import.meta.env.VITE_FEATURE_PAGOS === "true",
  Certificados: import.meta.env.VITE_FEATURE_CERTIFICADOS === "true",
  Usuarios: import.meta.env.VITE_FEATURE_USUARIOS === "true",
};

const ALL_MENU_ITEMS: MenuItem[] = [
  {
    label: "Notas",
    path: "/notas",
    icon: NotebookPen,
    section: "grades",
    anyOf: ["canView", "canManage"],
  },
  {
    label: "Matriculas",
    path: "/matriculas",
    icon: BookUser,
    section: "enrollments",
    anyOf: ["canView"],
  },
  {
    label: "Pagos",
    path: "/pagos",
    icon: CreditCard,
    section: "payments",
    anyOf: ["canView", "canManage"],
  },
  {
    label: "Certificados",
    path: "/certificados",
    icon: NotebookText,
    section: "certifications",
    anyOf: ["canView", "canManage"],
  },
  {
    label: "Usuarios",
    path: "/usuarios",
    icon: Users,
    section: "users",
    anyOf: ["canCreate", "canEdit", "canDelete"],
  },
];

const hasSectionPermission = (
  permissions: UserPermissions | undefined,
  section: keyof UserPermissions,
  anyOf: Array<keyof SectionPermissions>,
) => {
  if (!permissions) return false;
  const sectionPermissions = permissions[section];
  return anyOf.some((action) => Boolean(sectionPermissions?.[action]));
};

export const Sidebar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const filteredMenuItems = ALL_MENU_ITEMS.filter(
    (item) =>
      hasSectionPermission(user?.permissions, item.section, item.anyOf) &&
      featureEnvMap[item.label],
  );

  if (!user) return null;

  return (
    <aside className="w-64 min-h-screen bg-[hsl(var(--accentlight))] border-r border-gray-200">
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
