import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Home, Heart, Users, FileText, Info } from "lucide-react";
import { DisplayField } from "./matriculasUI/DisplayField";

interface StudentDataTabsProps {
    studentData: Record<string, any>;
    student: Record<string, any>;
    documentsFolderUrl?: string | null;
}

const tabs = [
    { name: "Información", value: "info", icon: User },
    { name: "Residencia", value: "residencia", icon: Home },
    { name: "Médica", value: "medica", icon: Heart },
    { name: "Padre", value: "padre", icon: User },
    { name: "Madre", value: "madre", icon: User },
    { name: "Acudiente", value: "acudiente", icon: Users },
    { name: "Documentos", value: "documentos", icon: FileText },
];

// Componente para estado vacío
const EmptyState = ({ message = "Aún no hay información registrada" }: { message?: string }) => (
    <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-gray-400">
        <Info className="h-12 w-12 mb-3 opacity-50" />
        <p className="text-sm">{message}</p>
    </div>
);

// Verifica si hay al menos un valor válido en un conjunto de campos
const hasData = (data: Record<string, any>, fields: string[]): boolean => {
    return fields.some(field => {
        const value = data[field];
        return value !== null && value !== undefined && value !== "";
    });
};

export const StudentDataTabs = ({
    studentData,
    student,
    documentsFolderUrl,
}: StudentDataTabsProps) => {
    const openDocumentsFolder = () => {
        if (documentsFolderUrl) {
            window.open(documentsFolderUrl, "_blank");
        } else {
            alert("No se encontró la carpeta del estudiante en OneDrive");
        }
    };

    // Campos por cada tab para verificar si hay datos
    const infoFields = ["student_firstname1", "student_lastname1", "student_id_type", "student_id_number", "student_birth_date", "student_gender"];
    const residenciaFields = ["residence_address", "residence_barrio", "residence_city", "residence_department"];
    const medicaFields = ["student_health_eps", "medical_has_allergies", "medical_has_medications", "medical_has_history"];
    const padreFields = ["father_firstname1", "father_lastname1", "father_id_number", "father_email", "father_phone"];
    const madreFields = ["mother_firstname1", "mother_lastname1", "mother_id_number", "mother_email", "mother_phone"];
    const acudienteFields = ["guardian_type", "guardian_firstname1", "guardian_lastname1", "guardian_id_number"];

    return (
        <Tabs defaultValue="info" className="w-full">
            {/* Tabs horizontales con scroll */}
            <div className="overflow-x-auto mb-4 pb-1">
                <TabsList className="inline-flex gap-1 p-1 bg-base-200 rounded-lg min-w-max">
                    {tabs.map((tab) => (
                        <TabsTrigger
                            key={tab.value}
                            value={tab.value}
                            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md transition-colors data-[state=active]:bg-primary data-[state=active]:text-white data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:bg-base-300 whitespace-nowrap"
                        >
                            <tab.icon className="h-4 w-4" />
                            <span>{tab.name}</span>
                        </TabsTrigger>
                    ))}
                </TabsList>
            </div>

            {/* Contenido de cada tab - altura fija para evitar saltos */}
            <div className="h-[400px] overflow-y-auto">
                {/* Tab: Información del Estudiante */}
                <TabsContent value="info" className="mt-0 h-full">
                    {hasData(studentData, infoFields) || student.email ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-base-100 rounded-lg">
                            <DisplayField label="Primer Nombre" value={studentData.student_firstname1} />
                            <DisplayField label="Segundo Nombre" value={studentData.student_firstname2} />
                            <DisplayField label="Primer Apellido" value={studentData.student_lastname1} />
                            <DisplayField label="Segundo Apellido" value={studentData.student_lastname2} />
                            <DisplayField label="Email" value={student.email} />
                            <DisplayField label="Tipo de Documento" value={studentData.student_id_type} />
                            <DisplayField label="Número de Documento" value={studentData.student_id_number} />
                            <DisplayField label="Fecha de Nacimiento" value={studentData.student_birth_date} />
                            <DisplayField label="Edad" value={studentData.student_age} />
                            <DisplayField label="Género" value={studentData.student_gender} />
                            <DisplayField label="Grupo Sanguíneo" value={studentData.student_blood_abo} />
                            <DisplayField label="RH" value={studentData.student_blood_rh} />
                            <DisplayField label="Ciudad de Nacimiento" value={studentData.student_birth_city} />
                            <DisplayField label="Religión" value={studentData.student_religion} />
                        </div>
                    ) : (
                        <EmptyState />
                    )}
                </TabsContent>

                {/* Tab: Datos de Residencia */}
                <TabsContent value="residencia" className="mt-0 h-full">
                    {hasData(studentData, residenciaFields) ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-base-100 rounded-lg">
                            <DisplayField label="Dirección" value={studentData.residence_address} />
                            <DisplayField label="Complemento" value={studentData.residence_address_complement} />
                            <DisplayField label="Barrio" value={studentData.residence_barrio} />
                            <DisplayField label="Estrato" value={studentData.residence_stratum} />
                            <DisplayField label="Ciudad" value={studentData.residence_city} />
                            <DisplayField label="Departamento" value={studentData.residence_department} />
                            <DisplayField label="País" value={studentData.residence_country} />
                        </div>
                    ) : (
                        <EmptyState />
                    )}
                </TabsContent>

                {/* Tab: Información Médica */}
                <TabsContent value="medica" className="mt-0 h-full">
                    {hasData(studentData, medicaFields) ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-base-100 rounded-lg">
                            <DisplayField label="EPS" value={studentData.student_health_eps} />
                            <DisplayField label="Tiene Alergias" value={studentData.medical_has_allergies} />
                            <DisplayField label="Detalle de Alergias" value={studentData.medical_allergies_detail} />
                            <DisplayField label="Toma Medicamentos" value={studentData.medical_has_medications} />
                            <DisplayField label="Detalle de Medicamentos" value={studentData.medical_medications_detail} />
                            <DisplayField label="Tiene Historial Médico" value={studentData.medical_has_history} />
                            <DisplayField label="Detalle de Historial" value={studentData.medical_history_detail} />
                            <DisplayField label="Tiene Diagnóstico" value={studentData.medical_has_diagnosis} />
                            <DisplayField label="Información Adicional" value={studentData.medical_diagnosis_additional_info} />
                        </div>
                    ) : (
                        <EmptyState />
                    )}
                </TabsContent>

                {/* Tab: Datos del Padre */}
                <TabsContent value="padre" className="mt-0 h-full">
                    {hasData(studentData, padreFields) ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-base-100 rounded-lg">
                            <DisplayField label="Primer Nombre" value={studentData.father_firstname1} />
                            <DisplayField label="Segundo Nombre" value={studentData.father_firstname2} />
                            <DisplayField label="Primer Apellido" value={studentData.father_lastname1} />
                            <DisplayField label="Segundo Apellido" value={studentData.father_lastname2} />
                            <DisplayField label="Tipo de Documento" value={studentData.father_document_type} />
                            <DisplayField label="Número de Documento" value={studentData.father_id_number} />
                            <DisplayField label="Ciudad de Expedición" value={studentData.father_id_city} />
                            <DisplayField label="Email" value={studentData.father_email} />
                            <DisplayField label="Teléfono" value={studentData.father_phone} />
                            <DisplayField label="Ocupación" value={studentData.father_occupation} />
                            <DisplayField label="Lugar de Trabajo" value={studentData.father_workplace} />
                            <DisplayField label="Dirección de Trabajo" value={studentData.father_work_address} />
                            <DisplayField label="Teléfono de Trabajo" value={studentData.father_work_phone} />
                            <DisplayField label="País" value={studentData.father_country} />
                            <DisplayField label="Departamento" value={studentData.father_department} />
                            <DisplayField label="Ciudad" value={studentData.father_city} />
                            <DisplayField label="Vive con el Estudiante" value={studentData.father_lives_with_student} />
                        </div>
                    ) : (
                        <EmptyState />
                    )}
                </TabsContent>

                {/* Tab: Datos de la Madre */}
                <TabsContent value="madre" className="mt-0 h-full">
                    {hasData(studentData, madreFields) ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-base-100 rounded-lg">
                            <DisplayField label="Primer Nombre" value={studentData.mother_firstname1} />
                            <DisplayField label="Segundo Nombre" value={studentData.mother_firstname2} />
                            <DisplayField label="Primer Apellido" value={studentData.mother_lastname1} />
                            <DisplayField label="Segundo Apellido" value={studentData.mother_lastname2} />
                            <DisplayField label="Tipo de Documento" value={studentData.mother_document_type} />
                            <DisplayField label="Número de Documento" value={studentData.mother_id_number} />
                            <DisplayField label="Ciudad de Expedición" value={studentData.mother_id_city} />
                            <DisplayField label="Email" value={studentData.mother_email} />
                            <DisplayField label="Teléfono" value={studentData.mother_phone} />
                            <DisplayField label="Ocupación" value={studentData.mother_occupation} />
                            <DisplayField label="Lugar de Trabajo" value={studentData.mother_workplace} />
                            <DisplayField label="Dirección de Trabajo" value={studentData.mother_work_address} />
                            <DisplayField label="Teléfono de Trabajo" value={studentData.mother_work_phone} />
                            <DisplayField label="País" value={studentData.mother_country} />
                            <DisplayField label="Departamento" value={studentData.mother_department} />
                            <DisplayField label="Ciudad" value={studentData.mother_city} />
                            <DisplayField label="Vive con el Estudiante" value={studentData.mother_lives_with_student} />
                        </div>
                    ) : (
                        <EmptyState />
                    )}
                </TabsContent>

                {/* Tab: Datos del Acudiente */}
                <TabsContent value="acudiente" className="mt-0 h-full">
                    {hasData(studentData, acudienteFields) ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-base-100 rounded-lg">
                            <DisplayField label="Tipo de Acudiente" value={studentData.guardian_type} />
                            <DisplayField label="Relación" value={studentData.guardian_relationship} />
                            <DisplayField label="Primer Nombre" value={studentData.guardian_firstname1} />
                            <DisplayField label="Segundo Nombre" value={studentData.guardian_firstname2} />
                            <DisplayField label="Primer Apellido" value={studentData.guardian_lastname1} />
                            <DisplayField label="Segundo Apellido" value={studentData.guardian_lastname2} />
                            <DisplayField label="Nombre Completo" value={studentData.guardian_full_name} />
                            <DisplayField label="Tipo de Documento" value={studentData.guardian_document_type} />
                            <DisplayField label="Número de Documento" value={studentData.guardian_id_number} />
                            <DisplayField label="Ciudad de Expedición" value={studentData.guardian_id_city} />
                            <DisplayField label="Email" value={studentData.guardian_email} />
                            <DisplayField label="Teléfono" value={studentData.guardian_phone} />
                            <DisplayField label="Ocupación" value={studentData.guardian_occupation} />
                            <DisplayField label="Lugar de Trabajo" value={studentData.guardian_workplace} />
                            <DisplayField label="País" value={studentData.guardian_country} />
                            <DisplayField label="Departamento" value={studentData.guardian_department} />
                            <DisplayField label="Ciudad" value={studentData.guardian_city} />
                        </div>
                    ) : (
                        <EmptyState />
                    )}
                </TabsContent>


                {/* Tab: Documentos */}
                <TabsContent value="documentos" className="mt-0">
                    <div className="flex flex-col items-center justify-center p-8 bg-base-100 rounded-lg min-h-[200px]">
                        <FileText className="h-16 w-16 text-primary/30 mb-4" />
                        <p className="text-gray-500 mb-4 text-center">
                            Accede a la carpeta de documentos del estudiante en OneDrive
                        </p>
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={openDocumentsFolder}
                        >
                            <FileText className="h-5 w-5 mr-2" />
                            Abrir Carpeta de Documentos
                        </button>
                    </div>
                </TabsContent>
            </div>
        </Tabs>
    );
};

export default StudentDataTabs;
