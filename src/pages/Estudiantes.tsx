import { useAuth } from '@/context/AuthContext';

const MOCK_STUDENTS = [
  { id: '1', name: 'Juan Pérez', grade: '10-A', status: 'Activo' },
  { id: '2', name: 'María González', grade: '10-A', status: 'Activo' },
  { id: '3', name: 'Carlos Ramírez', grade: '10-B', status: 'Activo' },
  { id: '4', name: 'Ana Martínez', grade: '11-A', status: 'Activo' },
];

export default function Estudiantes() {
  const { role } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Estudiantes</h1>
          <p className="text-muted-foreground mt-1">
            {role === 'coordinadora'
              ? 'Gestiona todos los estudiantes del centro'
              : 'Lista de estudiantes asignados'}
          </p>
        </div>

        {role === 'coordinadora' && (
          <button className="btn btn-primary">+ Nuevo Estudiante</button>
        )}
      </div>

      <div className="card bg-card shadow-lg">
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Grado</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_STUDENTS.map((student) => (
                <tr key={student.id} className="hover">
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar placeholder">
                        <div className="bg-primary text-primary-foreground rounded-full w-10">
                          <span>{student.name.charAt(0)}</span>
                        </div>
                      </div>
                      <span className="font-medium">{student.name}</span>
                    </div>
                  </td>
                  <td>{student.grade}</td>
                  <td>
                    <span className="badge badge-success badge-sm">
                      {student.status}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-ghost btn-xs">Ver Detalles</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
