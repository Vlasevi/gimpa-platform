// Utility function to translate enrollment status to user-friendly Spanish text
export const getStatusLabel = (status: string): string => {
  const statusLabels: Record<string, string> = {
    PENDING: "Pendiente",
    IN_REVIEW: "En Revisión",
    ACTIVE: "Activa",
    CANCELLED: "Cancelada",
  };

  return statusLabels[status] || status;
};

// Utility function to get status badge color class
export const getStatusBadgeClass = (status: string): string => {
  const badgeClasses: Record<string, string> = {
    PENDING: "badge-warning",
    IN_REVIEW: "badge-info",
    ACTIVE: "badge-success",
    CANCELLED: "badge-error",
  };

  return badgeClasses[status] || "badge-ghost";
};
