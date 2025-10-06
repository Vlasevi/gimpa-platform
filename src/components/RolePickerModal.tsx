import { UserRole } from '@/context/AuthContext';

interface RolePickerModalProps {
  isOpen: boolean;
  onSelectRole: (role: UserRole) => void;
}

const ROLES: { value: UserRole; label: string; description: string }[] = [
  {
    value: 'coordinadora',
    label: 'Coordinadora',
    description: 'Acceso completo: estudiantes, boletines, matrículas y pagos',
  },
  {
    value: 'profesor',
    label: 'Profesor',
    description: 'Acceso a estudiantes y notas',
  },
  {
    value: 'estudiante',
    label: 'Estudiante',
    description: 'Acceso a notas y matrículas',
  },
];

export const RolePickerModal = ({ isOpen, onSelectRole }: RolePickerModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-md">
        <h3 className="font-bold text-lg mb-4">Selecciona tu rol (Mock Auth)</h3>
        <p className="text-sm text-muted-foreground mb-6">
          En producción, el rol se obtiene automáticamente del servidor.
        </p>

        <div className="space-y-3">
          {ROLES.map((role) => (
            <button
              key={role.value}
              onClick={() => onSelectRole(role.value)}
              className="btn btn-outline w-full justify-start text-left h-auto py-4"
            >
              <div>
                <div className="font-semibold">{role.label}</div>
                <div className="text-xs opacity-70 mt-1">{role.description}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
