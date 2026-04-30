// pages/Matriculas.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "@/components/Login/loginLogic";
import { MatriculasEstudiantes } from "@/components/matriculas/MatriculasEstudiantes";
import { MatriculasAdmin } from "@/components/matriculas/MatriculasAdmin";

const Matriculas = () => {
  const { user } = useAuth();

  if (!user) return null;

  const enrollmentPermissions = user.permissions?.enrollments;
  if (!enrollmentPermissions?.canView) {
    return <Navigate to="/unauthorized" replace />;
  }

  const isEnrollmentOperator =
    Boolean(enrollmentPermissions.canApprove) ||
    Boolean(enrollmentPermissions.canCreate) ||
    Boolean(enrollmentPermissions.canDelete);

  const isStudentFlow =
    Boolean(enrollmentPermissions.canEdit) &&
    !Boolean(enrollmentPermissions.canApprove);

  if (isEnrollmentOperator) {
    return <MatriculasAdmin />;
  }

  if (isStudentFlow) {
    return <MatriculasEstudiantes />;
  }

  // Teacher/read-only users with view access use admin list in read-only mode
  return <MatriculasAdmin />;
};

export default Matriculas;
