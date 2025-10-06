import { useAuth } from '@/context/AuthContext';

const MOCK_NOTAS_PROFESOR = [
  { student: 'Juan Pérez', math: 4.2, science: 4.5, english: 3.8 },
  { student: 'María González', math: 4.8, science: 4.6, english: 4.9 },
  { student: 'Carlos Ramírez', math: 3.5, science: 3.9, english: 4.0 },
];

const MOCK_NOTAS_ESTUDIANTE = [
  { subject: 'Matemáticas', period1: 4.2, period2: 4.5, period3: 4.3, final: 4.3 },
  { subject: 'Ciencias', period1: 4.5, period2: 4.6, period3: 4.8, final: 4.6 },
  { subject: 'Inglés', period1: 3.8, period2: 4.0, period3: 4.2, final: 4.0 },
  { subject: 'Historia', period1: 4.0, period2: 4.1, period3: 4.3, final: 4.1 },
];

export default function Notas() {
  const { role } = useAuth();

  if (role === 'profesor') {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Notas</h1>
          <p className="text-muted-foreground mt-1">
            Registro y gestión de calificaciones
          </p>
        </div>

        <div className="card bg-card shadow-lg">
          <div className="card-body">
            <div className="flex justify-between items-center mb-4">
              <h2 className="card-title">Grado 10-A</h2>
              <button className="btn btn-primary btn-sm">Actualizar Notas</button>
            </div>

            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Estudiante</th>
                    <th>Matemáticas</th>
                    <th>Ciencias</th>
                    <th>Inglés</th>
                    <th>Promedio</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_NOTAS_PROFESOR.map((nota, idx) => {
                    const avg = ((nota.math + nota.science + nota.english) / 3).toFixed(1);
                    return (
                      <tr key={idx} className="hover">
                        <td>{nota.student}</td>
                        <td>{nota.math.toFixed(1)}</td>
                        <td>{nota.science.toFixed(1)}</td>
                        <td>{nota.english.toFixed(1)}</td>
                        <td className="font-semibold">{avg}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Vista de estudiante
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Mis Notas</h1>
        <p className="text-muted-foreground mt-1">
          Consulta tu historial académico
        </p>
      </div>

      <div className="alert alert-success">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="stroke-current shrink-0 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>Promedio general: 4.25 - ¡Excelente trabajo!</span>
      </div>

      <div className="card bg-card shadow-lg">
        <div className="card-body">
          <h2 className="card-title">Periodo Actual</h2>

          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Materia</th>
                  <th>Periodo 1</th>
                  <th>Periodo 2</th>
                  <th>Periodo 3</th>
                  <th>Final</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_NOTAS_ESTUDIANTE.map((nota, idx) => (
                  <tr key={idx} className="hover">
                    <td className="font-medium">{nota.subject}</td>
                    <td>{nota.period1.toFixed(1)}</td>
                    <td>{nota.period2.toFixed(1)}</td>
                    <td>{nota.period3.toFixed(1)}</td>
                    <td className="font-semibold">{nota.final.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
