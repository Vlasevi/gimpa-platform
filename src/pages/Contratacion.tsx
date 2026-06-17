// pages/Contratacion.tsx — listado de todas las contrataciones (admin/rector)
import { Navigate } from "react-router-dom";
import { useAuth } from "@/components/Login/loginLogic";
import { ContratacionAdmin } from "@/components/contratacion/ContratacionAdmin";

const Contratacion = () => {
  const { user } = useAuth();
  if (!user) return null;

  const c = user.permissions?.contracting;
  if (!c || (!c.canManage && !c.canViewAll)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <ContratacionAdmin readOnly={!c.canManage} />;
};

export default Contratacion;
