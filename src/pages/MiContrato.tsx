// pages/MiContrato.tsx — la contratación propia del usuario
import { Navigate } from "react-router-dom";
import { useAuth } from "@/components/Login/loginLogic";
import { ContratacionEmpleado } from "@/components/contratacion/ContratacionEmpleado";

const MiContrato = () => {
  const { user } = useAuth();
  if (!user) return null;

  const c = user.permissions?.contracting;
  if (!c || !c.canFillOwn) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <ContratacionEmpleado />;
};

export default MiContrato;
