import { useAuth, UserRole } from '@/context/AuthContext';

interface RoleGateProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const RoleGate = ({ allowedRoles, children, fallback }: RoleGateProps) => {
  const { role } = useAuth();

  if (!role || !allowedRoles.includes(role)) {
    return <>{fallback || null}</>;
  }

  return <>{children}</>;
};
