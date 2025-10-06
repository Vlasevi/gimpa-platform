const MOCK_PAGOS = [
  { id: '1', student: 'Juan Pérez', concept: 'Matrícula 2025', amount: 500, status: 'Pagado' },
  { id: '2', student: 'María González', concept: 'Pensión Marzo', amount: 250, status: 'Pendiente' },
  { id: '3', student: 'Carlos Ramírez', concept: 'Pensión Marzo', amount: 250, status: 'Pagado' },
  { id: '4', student: 'Ana Martínez', concept: 'Materiales', amount: 150, status: 'Pendiente' },
];

export default function Pagos() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Pagos</h1>
          <p className="text-muted-foreground mt-1">
            Gestión de pagos y pensiones
          </p>
        </div>

        <button className="btn btn-primary">+ Registrar Pago</button>
      </div>

      <div className="stats shadow w-full">
        <div className="stat">
          <div className="stat-title">Total Recaudado</div>
          <div className="stat-value text-success">$125,400</div>
          <div className="stat-desc">Este mes</div>
        </div>
        <div className="stat">
          <div className="stat-title">Pendientes</div>
          <div className="stat-value text-warning">$18,600</div>
          <div className="stat-desc">Por cobrar</div>
        </div>
        <div className="stat">
          <div className="stat-title">Morosidad</div>
          <div className="stat-value text-error">3.2%</div>
          <div className="stat-desc">↘︎ Bajó 1% este mes</div>
        </div>
      </div>

      <div className="card bg-card shadow-lg">
        <div className="card-body">
          <h2 className="card-title">Movimientos Recientes</h2>

          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Estudiante</th>
                  <th>Concepto</th>
                  <th>Monto</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_PAGOS.map((pago) => (
                  <tr key={pago.id} className="hover">
                    <td>{pago.student}</td>
                    <td>{pago.concept}</td>
                    <td className="font-semibold">${pago.amount}</td>
                    <td>
                      <span
                        className={`badge badge-sm ${
                          pago.status === 'Pagado'
                            ? 'badge-success'
                            : 'badge-warning'
                        }`}
                      >
                        {pago.status}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-xs btn-ghost">Ver</button>
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
}
