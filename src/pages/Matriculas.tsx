// pages/Matriculas.tsx
import { useAuth } from "@/components/Login/loginLogic";
import { MatriculasEstudiantes } from "@/components/matriculas/MatriculasEstudiantes";
import { MatriculasAdmin } from "@/components/matriculas/MatriculasAdmin";

const Matriculas = () => {
  const { user } = useAuth();
  //console.log("Usuario actual:", user);

  if (!user) return null;

  if (user.role === "admin" || user.role === "rector") {
    return <MatriculasAdmin />;
  }

  if (user.role === "student") {
    return <MatriculasEstudiantes />;
  }
};

export default Matriculas;
