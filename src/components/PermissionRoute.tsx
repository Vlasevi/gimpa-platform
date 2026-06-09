import { Navigate } from "react-router-dom";
import {
  useAuth,
  type PermissionSection,
  type SectionPermissions,
} from "@/components/Login/loginLogic";

interface PermissionRouteProps {
  section: PermissionSection;
  anyOf?: Array<keyof SectionPermissions>;
  children: React.ReactNode;
}

export const PermissionRoute = ({
  section,
  anyOf = ["canView"],
  children,
}: PermissionRouteProps) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  const sectionPermissions = user?.permissions?.[section];
  const allowed = anyOf.some((action) => Boolean(sectionPermissions?.[action]));

  if (!allowed) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};
