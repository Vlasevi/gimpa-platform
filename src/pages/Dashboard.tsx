import { useAuth } from "@/components/Login/loginLogic";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-primary font-poppins">
          ¡Bienvenido a la plataforma de GIMPA!
        </h1>
        <div className="space-y-2">
          <p className="text-lg text-secondary font-inter">
            Has iniciado sesión exitosamente
          </p>
          {user?.email && (
            <p className="text-base text-gray-700">
              <span className="font-semibold">Email:</span> {user.email}
            </p>
          )}
          {user?.displayname && (
            <p className="text-base text-gray-700">
              <span className="font-semibold">Usuario:</span> {user.displayname}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
