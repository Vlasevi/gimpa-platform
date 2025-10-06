import { useAuth } from '@/context/AuthContext';
import { RoleGate } from '@/components/RoleGate';

// Vista para coordinadora
const CoordinadoraView = () => {
  const MOCK_SOLICITUDES = [
    { id: '1', student: 'Pedro Sánchez', grade: '10-A', status: 'Pendiente' },
    { id: '2', student: 'Laura Díaz', grade: '11-B', status: 'Aprobada' },
    { id: '3', student: 'Jorge Torres', grade: '9-A', status: 'Pendiente' },
  ];

  return (
    <div className="space-y-6">
      <div className="stats shadow w-full">
        <div className="stat">
          <div className="stat-title">Total Solicitudes</div>
          <div className="stat-value text-primary">24</div>
          <div className="stat-desc">↗︎ 4 nuevas esta semana</div>
        </div>
        <div className="stat">
          <div className="stat-title">Pendientes</div>
          <div className="stat-value text-warning">8</div>
          <div className="stat-desc">Requieren revisión</div>
        </div>
        <div className="stat">
          <div className="stat-title">Aprobadas</div>
          <div className="stat-value text-success">16</div>
          <div className="stat-desc">Completadas</div>
        </div>
      </div>

      <div className="card bg-card shadow-lg">
        <div className="card-body">
          <h2 className="card-title">Solicitudes Recientes</h2>

          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Estudiante</th>
                  <th>Grado</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_SOLICITUDES.map((sol) => (
                  <tr key={sol.id} className="hover">
                    <td>{sol.student}</td>
                    <td>{sol.grade}</td>
                    <td>
                      <span
                        className={`badge badge-sm ${
                          sol.status === 'Pendiente'
                            ? 'badge-warning'
                            : 'badge-success'
                        }`}
                      >
                        {sol.status}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-xs btn-ghost">Revisar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// Vista para estudiante
const EstudianteView = () => {
  return (
    <div className="space-y-6">
      <div className="alert alert-info">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="stroke-current shrink-0 w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>Tu matrícula está activa para el periodo 2025-2026</span>
      </div>

      <div className="card bg-card shadow-lg">
        <div className="card-body">
          <h2 className="card-title">Estado de Matrícula</h2>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Grado:</span>
              <span className="font-semibold">10-A</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Periodo:</span>
              <span className="font-semibold">2025-2026</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Estado de Pago:</span>
              <span className="badge badge-success">Al día</span>
            </div>
          </div>

          <div className="divider" />

          <h3 className="font-semibold mb-2">Documentos</h3>
          <div className="space-y-2">
            <button className="btn btn-outline btn-sm w-full justify-start">
              📄 Certificado de Matrícula
            </button>
            <button className="btn btn-outline btn-sm w-full justify-start">
              📄 Horario de Clases
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Matriculas() {
  const { role } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Matrículas</h1>
        <p className="text-muted-foreground mt-1">
          {role === 'coordinadora'
            ? 'Gestión de solicitudes de matrícula'
            : 'Información de tu matrícula'}
        </p>
      </div>

      <RoleGate
        allowedRoles={['coordinadora']}
        fallback={
          <RoleGate
            allowedRoles={['estudiante']}
            fallback={
              <div className="alert alert-warning">
                <span>Esta página no está disponible para tu rol.</span>
              </div>
            }
          >
            <EstudianteView />
          </RoleGate>
        }
      >
        <CoordinadoraView />
      </RoleGate>
    </div>
  );
}
