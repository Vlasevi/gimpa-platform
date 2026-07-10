import { useAuth } from "@/components/Login/loginLogic";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="rounded-2xl border border-base-300 bg-base-100 p-8 shadow-sm">
      <div className="text-center space-y-4">
        <h1 className="font-display text-3xl font-bold text-secondary">
          ¡Bienvenido a la plataforma de GIMPA!
        </h1>
        <div className="space-y-2">
          <p className="text-lg text-base-content/70">
            Has iniciado sesión exitosamente
          </p>
          {user?.email && (
            <p className="text-base text-base-content/70">
              <span className="font-semibold text-base-content">Email:</span> {user.email}
            </p>
          )}
          {user?.displayname && (
            <p className="text-base text-base-content/70">
              <span className="font-semibold text-base-content">Usuario:</span>{" "}
              {user.displayname}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
