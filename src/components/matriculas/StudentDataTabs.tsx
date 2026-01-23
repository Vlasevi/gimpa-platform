import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Home, Heart, Users, FileText, Info, Download, Loader2, Camera, PenTool, FolderOpen, Building } from "lucide-react";
import { DisplayField } from "./matriculasUI/DisplayField";
import { apiUrl, API_ENDPOINTS, buildHeaders } from "@/utils/api";
import { useState } from "react";

interface StudentDataTabsProps {
    studentData: Record<string, any>;
    student: Record<string, any>;
    documentsMetadata?: Record<string, any> | null;
    enrollmentId?: number;
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
    documentsMetadata,
    enrollmentId,
}: StudentDataTabsProps) => {
    const [downloadingDoc, setDownloadingDoc] = useState<string | null>(null);

    // Mapeo de nombres de documentos a etiquetas legibles
    const documentLabels: Record<string, string> = {
        // Fotos
        student_photo: "Foto del Estudiante",
        father_photo: "Foto del Padre",
        mother_photo: "Foto de la Madre",
        // Firmas
        father_signature: "Firma del Padre",
        mother_signature: "Firma de la Madre",
        guardian_signature: "Firma del Acudiente",
        // Huellas
        father_fingerprint: "Huella del Padre",
        mother_fingerprint: "Huella de la Madre",
        guardian_fingerprint: "Huella del Acudiente",
        // Documentos requeridos
        registro_civil: "Registro Civil",
        registro_civil_ti: "Registro Civil / Tarjeta de Identidad",
        registro_vacunacion: "Registro de Vacunación",
        cert_eps: "Certificado EPS",
        cert_medico: "Certificado Médico",
        cert_vista: "Certificado de Vista",
        cert_auditivo: "Certificado Auditivo",
        cert_diagnostico: "Certificado de Diagnóstico",
        paz_salvo: "Paz y Salvo",
        convivencia: "Convivencia Escolar",
        ficha_psicologica: "Ficha Psicológica",
        cert_estudios: "Certificado de Estudios",
        retiro_simat: "Retiro SIMAT",
        // Cédulas
        father_id: "Cédula del Padre",
        mother_id: "Cédula de la Madre",
        guardian_id: "Cédula del Acudiente",
        // Otros
        work_certificate: "Certificado Laboral",
    };

    // Función para obtener etiqueta legible de un documento
    const getDocumentLabel = (docKey: string): string => {
        // Si tiene prefijo documentos/, extraer el nombre base
        const cleanKey = docKey.startsWith('documentos/') 
            ? docKey.replace('documentos/', '') 
            : docKey;
        
        // Documentos institucionales dinámicos (contrato, pagaré, hoja de matrícula)
        if (cleanKey.startsWith('contrato_')) {
            return `Contrato ${cleanKey.replace('contrato_', '')}`;
        }
        if (cleanKey.startsWith('pagare_')) {
            return `Pagaré ${cleanKey.replace('pagare_', '')}`;
        }
        if (cleanKey.startsWith('hoja_matricula_') || cleanKey.startsWith('hoja_de_matricula_') || cleanKey.startsWith('hoja_de_matrícula_')) {
            const year = cleanKey.match(/\d{4}/)?.[0] || '';
            return `Hoja de Matrícula ${year}`;
        }
        
        // Buscar en el mapeo estático
        if (documentLabels[cleanKey]) {
            return documentLabels[cleanKey];
        }
        
        // Fallback: convertir snake_case a título legible
        return cleanKey
            .replace(/_/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase());
    };

    const handleDownloadDocument = async (docKey: string) => {
        if (!enrollmentId) {
            alert("No se encontró el ID de matrícula");
            return;
        }

        setDownloadingDoc(docKey);

        try {
            const response = await fetch(
                apiUrl(API_ENDPOINTS.enrollmentDocuments(enrollmentId)),
                { credentials: "include", headers: buildHeaders() }
            );

            if (!response.ok) throw new Error("Error al obtener URL del documento");

            const data = await response.json();
            const docUrl = data.documents[docKey]?.url;

            if (docUrl) {
                window.open(docUrl, "_blank");
            } else {
                alert("Documento no disponible");
            }
        } catch (err: any) {
            alert(err.message || "Error al descargar documento");
            console.error(err);
        } finally {
            setDownloadingDoc(null);
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
                    {documentsMetadata && Object.keys(documentsMetadata).length > 0 ? (
                        <div className="p-4 bg-base-100 rounded-lg space-y-6">
                            {/* Categorizar documentos */}
                            {(() => {
                                const categories = {
                                    fotos: { 
                                        title: "Fotos", 
                                        icon: Camera,
                                        keys: ['student_photo', 'father_photo', 'mother_photo', 'foto_estudiante', 'foto_padre', 'foto_madre', 'foto_del_estudiante', 'foto_del_padre', 'foto_de_la_madre']
                                    },
                                    firmas: { 
                                        title: "Firmas y Huellas", 
                                        icon: PenTool,
                                        keys: ['father_signature', 'mother_signature', 'guardian_signature', 'father_fingerprint', 'mother_fingerprint', 'guardian_fingerprint', 'firma_padre', 'firma_madre', 'firma_acudiente', 'huella_padre', 'huella_madre', 'huella_acudiente', 'firma_del_padre', 'firma_de_la_madre', 'huella_del_padre', 'huella_de_la_madre']
                                    },
                                    documentos: { 
                                        title: "Documentos", 
                                        icon: FolderOpen,
                                        keys: ['registro_civil', 'registro_civil_ti', 'registro_vacunacion', 'cert_eps', 'cert_medico', 'cert_vista', 'cert_auditivo', 'cert_diagnostico', 'paz_salvo', 'convivencia', 'ficha_psicologica', 'cert_estudios', 'retiro_simat', 'father_id', 'mother_id', 'guardian_id', 'work_certificate', 'cedula_padre', 'cedula_madre', 'cedula_acudiente', 'certificado_eps', 'certificado_medico', 'certificado_laboral']
                                    },
                                    institucion: { 
                                        title: "Documentos Institución", 
                                        icon: Building,
                                        keys: [] // Se detecta por prefijo documentos/
                                    },
                                };

                                // Función para determinar categoría
                                const getCategory = (docKey: string) => {
                                    // Documentos institución (prefijo documentos/)
                                    if (docKey.startsWith('documentos/')) return 'institucion';
                                    
                                    const cleanKey = docKey.toLowerCase();
                                    
                                    for (const [cat, config] of Object.entries(categories)) {
                                        if (config.keys.some(k => cleanKey.includes(k) || k.includes(cleanKey))) {
                                            return cat;
                                        }
                                    }
                                    return 'documentos'; // default
                                };

                                // Agrupar documentos
                                const grouped: Record<string, [string, any][]> = {
                                    fotos: [],
                                    firmas: [],
                                    documentos: [],
                                    institucion: [],
                                };

                                Object.entries(documentsMetadata).forEach(([docKey, meta]) => {
                                    const cat = getCategory(docKey);
                                    grouped[cat].push([docKey, meta]);
                                });

                                // Renderizar cada sección
                                return Object.entries(categories).map(([catKey, config]) => {
                                    const docs = grouped[catKey];
                                    if (docs.length === 0) return null;

                                    const IconComponent = config.icon;

                                    return (
                                        <div key={catKey}>
                                            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                                <IconComponent className="h-5 w-5 text-primary" />
                                                {config.title}
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {docs.map(([docKey, meta]: [string, any]) => {
                                                    const label = getDocumentLabel(docKey);
                                                    const uploadedDate = meta.uploaded_at
                                                        ? new Date(meta.uploaded_at).toLocaleDateString('es-CO', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })
                                                        : 'Fecha desconocida';

                                                    return (
                                                        <div
                                                            key={docKey}
                                                            className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                                                        >
                                                            <div className="flex-1 min-w-0">
                                                                <p className="font-medium text-gray-900 truncate">{label}</p>
                                                                <p className="text-xs text-gray-500">{uploadedDate}</p>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleDownloadDocument(docKey)}
                                                                disabled={downloadingDoc === docKey}
                                                                className="ml-3 flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-focus disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                            >
                                                                {downloadingDoc === docKey ? (
                                                                    <>
                                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                                        Cargando...
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <Download className="h-4 w-4" />
                                                                        Abrir
                                                                    </>
                                                                )}
                                                            </button>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                });
                            })()}
                        </div>
                    ) : (
                        <EmptyState message="No hay documentos subidos aún" />
                    )}
                </TabsContent>
            </div>
        </Tabs>
    );
};

export default StudentDataTabs;
