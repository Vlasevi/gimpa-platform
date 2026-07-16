import { NavLink, useNavigate } from "react-router-dom";
import {
  useAuth,
  type UserPermissions,
  type PermissionSection,
  type SectionPermissions,
} from "./Login/loginLogic";
import logo from "@/assets/platform-logo.png";
import {
  CreditCard,
  NotebookPen,
  BookUser,
  NotebookText,
  Users,
  FileSignature,
  FileText,
  ShieldCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface MenuItem {
  label: string;
  path: string;
  icon: LucideIcon;
  section: PermissionSection;
  anyOf: Array<keyof SectionPermissions>;
}

const featureEnvMap: Record<string, boolean> = {
  Notas: import.meta.env.VITE_FEATURE_NOTAS === "true",
  Matriculas: import.meta.env.VITE_FEATURE_MATRICULAS === "true",
  Pagos: import.meta.env.VITE_FEATURE_PAGOS === "true",
  Certificados: import.meta.env.VITE_FEATURE_CERTIFICADOS === "true",
  Usuarios: import.meta.env.VITE_FEATURE_USUARIOS === "true",
  Contratacion: import.meta.env.VITE_FEATURE_CONTRATACION === "true",
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
    anyOf: ["canView"],
  },
];

const hasSectionPermission = (
  permissions: UserPermissions | undefined,
  section: PermissionSection,
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

  const c = user?.permissions?.contracting;
  const featContrat = featureEnvMap["Contratacion"];
  const showContratacionesAll = featContrat && Boolean(c && (c.canManage || c.canViewAll));
  const showMiContrato = featContrat && Boolean(c && c.canFillOwn);

  if (!user) return null;

  const isAdminRector = user.role === "admin" || user.role === "rector";
  // Cambio visual: los roles que no son admin/rector ven "Matriculas" como "Estudiantes".
  const displayLabel = (label: string) =>
    label === "Matriculas" && !isAdminRector ? "Estudiantes" : label;

  // Estilo compartido de cada ítem del menú (activo = verde oscuro para
  // contrastar con el fondo verde claro del sidebar).
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
      isActive
        ? "bg-[hsl(var(--accent-dark))] text-white shadow-sm"
        : "text-base-content/80 hover:bg-white/60 hover:text-primary"
    }`;

  return (
    <aside className="w-64 min-h-screen border-r border-base-300 bg-[hsl(var(--accentlight))]">
      <div className="mb-4 flex h-18 items-center justify-center border-b border-base-300 px-4 py-6">
        <img
          onClick={() => {
            navigate("/dashboard", { replace: true });
          }}
          src={logo}
          alt="GIMPA"
          className="cursor-pointer"
        />
      </div>

      <nav className="space-y-1 px-4">
        {filteredMenuItems.map((item) => (
          <NavLink key={item.path} to={item.path} className={navLinkClass}>
            <item.icon className="h-5 w-5 shrink-0" />
            {displayLabel(item.label)}
          </NavLink>
        ))}

        {showContratacionesAll && (
          <NavLink to="/contratacion" className={navLinkClass}>
            <FileSignature className="h-5 w-5 shrink-0" />
            Contrataciones
          </NavLink>
        )}

        {showMiContrato && (
          <NavLink to="/mi-contrato" className={navLinkClass}>
            <FileText className="h-5 w-5 shrink-0" />
            Mi Contrato
          </NavLink>
        )}

        {user.role === "admin" && (
          <NavLink to="/roles" className={navLinkClass}>
            <ShieldCheck className="h-5 w-5 shrink-0" />
            Roles y Permisos
          </NavLink>
        )}
      </nav>
    </aside>
  );
};
