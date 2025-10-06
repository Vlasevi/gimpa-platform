const MOCK_BOLETINES = [
  { id: '1', title: 'Resultados Periodo 1', date: '2025-03-15', students: 156 },
  { id: '2', title: 'Resultados Periodo 2', date: '2025-06-15', students: 152 },
  { id: '3', title: 'Resultados Periodo 3', date: '2025-09-15', students: 158 },
];

export default function Boletines() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Boletines</h1>
          <p className="text-muted-foreground mt-1">
            Gestión de boletines académicos
          </p>
        </div>

        <button className="btn btn-primary">+ Generar Boletín</button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {MOCK_BOLETINES.map((boletin) => (
          <div key={boletin.id} className="card bg-card shadow-lg">
            <div className="card-body">
              <h2 className="card-title">{boletin.title}</h2>
              <div className="space-y-2 text-sm">
                <p className="text-muted-foreground">
                  Fecha: {new Date(boletin.date).toLocaleDateString('es-ES')}
                </p>
                <p className="text-muted-foreground">
                  Estudiantes: {boletin.students}
                </p>
              </div>
              <div className="card-actions justify-end mt-4">
                <button className="btn btn-sm btn-ghost">Ver</button>
                <button className="btn btn-sm btn-primary">Descargar</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
