import { useEffect, useState, useRef } from "react";

// --- CONSTANTES (Listas para desplegables) ---
const BARRIOS_BARRANQUILLA = [
  "7 de Abril",
  "7 de Agosto",
  "Adela de Char",
  "Alameda del Río",
  "Alfonso López",
  "Alianza",
  "Altamira",
  "Alto Prado",
  "Altos de Riomar",
  "Altos del Limón",
  "América",
  "Andalucia",
  "Atlántico",
  "Barlovento",
  "Barrio Abajo",
  "Bella Arena",
  "Bellavista",
  "Bendición de Dios",
  "Bernardo Hoyos",
  "Bethania",
  "Bosque",
  "Boston",
  "Boyacá",
  "Buena Esperanza",
  "Buenos Aires",
  "California",
  "Campito",
  "Campo Alegre",
  "Carlos Meisel",
  "Carrizal",
  "Casa Blanca",
  "Centro",
  "Centro Histórico",
  "Cevillar",
  "Chiquinquirá",
  "Ciudadela 20 de Julio",
  "Ciudadela de Paz",
  "Colombia",
  "Concepción",
  "Conjunto Residencial",
  "Country",
  "Cuchilla de Villate",
  "El Campito",
  "El Carmen",
  "El Castillo",
  "El Edén",
  "El Ferry",
  "El Golf",
  "El Limón",
  "El Limoncito",
  "El Milagro",
  "El Oasis",
  "El Paraíso",
  "El Parque",
  "El Poblado",
  "El Pueblo",
  "El Recreo",
  "El Santuario",
  "El Silencio",
  "El Valle",
  "Galán",
  "Gerlein y Villate",
  "Granadillo",
  "Hipódromo",
  "Juan Mina (Corregimiento)",
  "Kennedy",
  "La Ceiba",
  "La Chinita",
  "La Cumbre",
  "La Floresta",
  "La Florida",
  "La Luz",
  "La Magdalena",
  "La Manga",
  "La María",
  "La Paz",
  "La Peña",
  "La Playa",
  "La Pradera",
  "La Sierrita",
  "La Trinidad",
  "La Unión",
  "La Victoria",
  "Las Américas",
  "Las Colinas",
  "Las Delicias",
  "Las Estrellas",
  "Las Flores",
  "Las Gardenias",
  "Las Malvinas",
  "Las Mercedes",
  "Las Nieves",
  "Las Palmas",
  "Las Terrazas",
  "Lipaya",
  "Loma Fresca",
  "Los Alpes",
  "Los Andes",
  "Los Continentes",
  "Los Girasoles",
  "Los Jobos",
  "Los Nogales",
  "Los Olivos",
  "Los Pinos",
  "Lucero",
  "Me Quejo",
  "Modelo",
  "Montecristo",
  "Montes",
  "Nueva Colombia",
  "Nueva Granada",
  "Olaya",
  "Pasadena",
  "Pumarejo",
  "Rebolo",
  "Recreo",
  "Riomar",
  "Rosales",
  "San Felipe",
  "San Isidro",
  "San José",
  "San Luis",
  "San Martín",
  "San Nicolás",
  "San Pedro",
  "San Vicente",
  "Santa Ana",
  "Santa Lucía",
  "Santa María",
  "Santa Mónica",
  "Santo Domingo",
  "Santo Domingo de Guzmán",
  "Siape",
  "Simón Bolívar",
  "Tabor",
  "Tayrona",
  "Universal",
  "Villa Blanca",
  "Villa Campestre",
  "Villa Carolina",
  "Villa del Carmen",
  "Villa del Rosario",
  "Villa del Sol",
  "Villa del Sur",
  "Villa San Carlos",
  "Villa San Pedro",
  "Villa Santos",
  "Villate",
  "Villas de San Pablo",
  "Zona Franca",
  "Otro",
];
const COUNTRIES = [
  "Colombia",
  "Venezuela",
  "Estados Unidos",
  "España",
  "México",
  "Ecuador",
  "Perú",
  "Otro",
];
const MARITAL_STATUS = [
  "Casados",
  "Divorciados",
  "Separados",
  "Unión Libre",
  "Soltero/a",
  "Viudo/a",
];
const RELIGIONS = [
  "Católica",
  "Cristiana",
  "Judía",
  "Musulmana",
  "Atea",
  "Otra",
];
const DOCUMENT_TYPES = [
  "Registro Civil",
  "Tarjeta de Identidad",
  "Cédula de Ciudadanía",
  "Cédula de Extranjería",
  "Pasaporte",
];
const EPS_LIST = [
  "Nueva EPS",
  "Coosalud EPS-S",
  "Mutual SER",
  "Salud Total EPS S.A.",
  "Asmet Salud",
  "Capital Salud EPS-S S.A.S.",
  "Savia Salud EPS",
  "EPS Sanitas (Actualmente intervenida)",
  "EPS Sura",
  "Compensar EPS",
  "Comfenalco Valle",
  "Famisanar (Actualmente intervenida)",
  "Servicio Occidental de Salud (SOS) (Actualmente intervenida)",
  "Aliansalud EPS",
  "Empresas Públicas de Medellín (EPM)",
  "Fondo de Pasivo Social de Ferrocarriles Nacionales de Colombia",
  "Cajacopi Atlántico",
  "Capresoca",
  "Comfachocó",
  "EPS Familiar de Colombia",
  "Salud Mía",
  "Dusakawi EPSI",
  "Asociación Indígena del Cauca",
  "Anas Wayuu EPSI",
  "Mallamas EPSI",
  "Pijaos Salud EPSI",
];
const ADDRESS_EXAMPLES = [
  "Calle 7 # 13-14",
  "Carrera 45 # 22-10",
  "Transversal 54 # 10-20",
  "Avenida 30 # 5-60",
  "Manzana 12 Casa 4",
];
const ESTRATOS = ["1", "2", "3", "4", "5", "6", "Comercial"];
const COLOMBIA_DEPARTMENTS = [
  "Amazonas",
  "Antioquia",
  "Arauca",
  "Atlántico",
  "Bolívar",
  "Boyacá",
  "Caldas",
  "Caquetá",
  "Casanare",
  "Cauca",
  "Cesar",
  "Chocó",
  "Córdoba",
  "Cundinamarca",
  "Guainía",
  "Guaviare",
  "Huila",
  "La Guajira",
  "Magdalena",
  "Meta",
  "Nariño",
  "Norte de Santander",
  "Putumayo",
  "Quindío",
  "Risaralda",
  "San Andrés y Providencia",
  "Santander",
  "Sucre",
  "Tolima",
  "Valle del Cauca",
  "Vaupés",
  "Vichada",
];

// --- COMPONENTES AUXILIARES ---
const FormInput = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  disabled,
  ...props
}: any) => (
  <div className="form-control w-full">
    <label className="label">
      <span className="label-text font-medium text-gray-600">
        {label}
        {props.required && <span className="text-error ml-1">*</span>}
      </span>
    </label>
    <input
      name={name}
      type={type}
      placeholder={placeholder || label}
      className={`input input-bordered w-full focus:input-primary transition-all ${disabled ? "bg-gray-100 text-gray-500" : ""
        }`}
      value={value || ""}
      onChange={onChange}
      disabled={disabled}
      {...props}
    />
  </div>
);

const FormSelect = ({
  label,
  name,
  value,
  onChange,
  options,
  disabled,
  placeholder = "Selecciona una opción",
  ...props
}: any) => (
  <div className="form-control w-full">
    <label className="label">
      <span className="label-text font-medium text-gray-600">
        {label}
        {disabled
          ? ""
          : props.required && <span className="text-error ml-1">*</span>}
      </span>
    </label>
    <select
      name={name}
      className={`select select-bordered w-full focus:select-primary ${disabled ? "bg-gray-100" : ""
        }`}
      value={value || ""}
      onChange={onChange}
      disabled={disabled}
      {...props}
    >
      <option value="">{placeholder}</option>
      {options.map((opt: string) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

const PhotoUploadField = ({
  dataKey,
  data,
  update,
  uploadedFiles,
  updateUploadedFiles,
  label,
  preloadedUrl,
}: {
  dataKey: string;
  data: any;
  update: Function;
  uploadedFiles: any;
  updateUploadedFiles: Function;
  label: string;
  preloadedUrl?: string;
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [useExisting, setUseExisting] = useState(!!preloadedUrl);

  // Key to track if photo was manually removed (persists in data object)
  const removedKey = `${dataKey}_manually_removed`;

  // Helper function to check if a value is empty (null, undefined, or empty object)
  const isEmpty = (value: any) => {
    if (!value) return true;
    if (typeof value === "object" && !(value instanceof File)) {
      return Object.keys(value).length === 0;
    }
    return false;
  };

  // Update useExisting when preloadedUrl changes (e.g., when photos are loaded)
  useEffect(() => {
    // Only set useExisting if the user hasn't manually removed the photo
    if (preloadedUrl && isEmpty(data[dataKey]) && !data[removedKey]) {
      setUseExisting(true);
    }
  }, [preloadedUrl, data, dataKey, removedKey]);

  useEffect(() => {
    // Check if there's an uploaded file
    const uploadedFile = uploadedFiles[dataKey];

    if (uploadedFile instanceof File) {
      // Show preview of uploaded file
      const objectUrl = URL.createObjectURL(uploadedFile);
      setPreview(objectUrl);
      setUseExisting(false);
      return () => URL.revokeObjectURL(objectUrl);
    }

    // No uploaded file - check if we should show preloaded photo
    if (preloadedUrl && useExisting && !data[removedKey]) {
      setPreview(preloadedUrl);
    } else {
      setPreview(null);
    }
  }, [uploadedFiles, dataKey, preloadedUrl, useExisting, data, removedKey]);

  const handleRemovePhoto = () => {
    // Mark as manually removed in the data object (persists across navigation)
    update({
      [dataKey]: null,
      [`${dataKey}_uploaded`]: false,
      [removedKey]: true,
    });

    // Also remove from uploaded files
    updateUploadedFiles({
      [dataKey]: null,
    });

    setUseExisting(false);
    setPreview(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Store the File object separately (not in formData JSON)
      updateUploadedFiles({
        [dataKey]: selectedFile,
      });

      // Mark that we have a new file (for form validation)
      update({
        [`${dataKey}_uploaded`]: true,
        [removedKey]: false, // Reset manually removed flag
      });
    }
  };

  return (
    <div className="form-control w-full bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm col-span-1">
      <label className="label pt-0">
        <span className="label-text font-medium text-gray-600">{label}</span>
      </label>
      <div className="flex items-center gap-4">
        <div className="avatar relative group shrink-0">
          <div className="w-20 h-20 rounded-lg bg-gray-200 shadow-md overflow-hidden border border-gray-300">
            {preview ? (
              <img
                src={preview}
                alt="Foto"
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                {/* SVG omitido */}
              </div>
            )}
          </div>
          {preview && (
            <button
              type="button"
              onClick={handleRemovePhoto}
              className="absolute -top-1 -right-1 btn btn-circle btn-xs btn-error text-white shadow-md"
              title="Eliminar foto"
            >
              ✕
            </button>
          )}
        </div>
        <label className="flex flex-col cursor-pointer">
          <span className="btn btn-sm btn-outline btn-primary gap-2">
            {preview ? "Cambiar" : "Subir Foto"}
          </span>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
        </label>
      </div>
    </div>
  );
};

const SectionCard = ({ title, isOpen, onToggle, children }: any) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-md">
    <button
      type="button"
      className="w-full px-6 py-4 flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-colors"
      onClick={onToggle}
    >
      <h3 className="text-lg font-bold text-primary uppercase tracking-wide flex items-center gap-2">
        {title}
      </h3>
      <span
        className={`transform transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"
          }`}
      >
        {/* SVG omitido */}
      </span>
    </button>

    <div
      className={`border-t border-gray-100 transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0"
        }`}
    >
      <div className="p-6">{children}</div>
    </div>
  </div>
);

const ComboBox = ({
  value,
  setValue,
  options,
  label,
  disabled,
  required,
}: any) => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);

  // Sincronizar query con value cuando el dropdown está cerrado
  useEffect(() => {
    if (!open) {
      setQuery(value || "");
    }
  }, [value, open]);

  // Cerrar el dropdown cuando se hace scroll en la página (no en el dropdown)
  useEffect(() => {
    const handleScroll = (e: Event) => {
      // No cerrar si el scroll es dentro del dropdown
      if (
        dropdownRef.current &&
        dropdownRef.current.contains(e.target as Node)
      ) {
        return;
      }

      if (open) {
        setOpen(false);
      }
    };

    if (open) {
      window.addEventListener("scroll", handleScroll, true);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [open]);

  const inputValue = typeof query === "string" ? query : "";

  // Función para normalizar texto (eliminar tildes)
  const normalizeText = (text: string) => {
    return text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  };

  const filteredOptions =
    inputValue === ""
      ? options
      : options.filter((o) => {
        const normalizedOption = normalizeText(o);
        const normalizedInput = normalizeText(inputValue);

        // Buscar si el nombre completo empieza con el input O si alguna palabra empieza con el input
        if (normalizedOption.startsWith(normalizedInput)) {
          return true;
        }

        // Buscar si alguna palabra del barrio empieza con el input
        const words = normalizedOption.split(" ");
        return words.some((word) => word.startsWith(normalizedInput));
      });

  return (
    <div className="form-control w-full relative">
      <label className="label">
        <span className="label-text font-medium text-gray-600">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </span>
      </label>
      <input
        ref={inputRef}
        type="text"
        className={`input input-bordered w-full focus:input-primary transition-all truncate ${disabled ? "!bg-base-200 text-gray-500 cursor-not-allowed" : ""
          }`}
        placeholder={label}
        value={inputValue}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => {
          setOpen(true);
          setQuery(value || "");
        }}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        disabled={disabled}
        required={required}
        autoComplete="off"
        title={value}
      />
      {open && filteredOptions.length > 0 && (
        <ul
          ref={dropdownRef}
          className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-auto"
          style={{
            top: inputRef.current
              ? inputRef.current.getBoundingClientRect().bottom + 4
              : 0,
            left: inputRef.current
              ? inputRef.current.getBoundingClientRect().left
              : 0,
            width: inputRef.current
              ? inputRef.current.getBoundingClientRect().width
              : "auto",
          }}
        >
          {filteredOptions.map((o) => (
            <li
              key={o}
              className={`px-4 py-2 cursor-pointer hover:bg-primary hover:text-white truncate ${o === value ? "bg-primary text-white" : ""
                }`}
              onMouseDown={() => {
                setValue(o);
                setQuery(o);
                setOpen(false);
                if (inputRef.current) inputRef.current.blur();
              }}
              title={o}
            >
              {o}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// --- COMPONENTE PRINCIPAL ---
export const Step3StudentData = ({
  next,
  back,
  data,
  update,
  uploadedFiles,
  updateUploadedFiles,
  enrollmentInfo,
  enrollmentId,
  preloadedDocuments,
}: any) => {
  console.log("Step3StudentData - enrollmentInfo:", enrollmentInfo);
  console.log("Step3StudentData - enrollmentId:", enrollmentId);
  console.log("Step3StudentData - preloadedDocuments:", preloadedDocuments);

  // Estado para colapsar secciones
  const [openSections, setOpenSections] = useState({
    estudiante: true,
    residencia: false,
    medica: false,
    ahorro: false,
    padre: false,
    madre: false,
    acudiente: false,
  });

  // Fecha actual
  const currentDate = new Date().toISOString().split("T")[0];

  // Datos clave del backend
  const canEnroll = enrollmentInfo?.eligibility?.can_enroll;
  const existingData = enrollmentInfo?.eligibility?.existing_data || {};
  const suggestedGradeObj =
    enrollmentInfo?.suggested_enrollment?.grade || null;
  const suggestedGrade =
    enrollmentInfo?.suggested_enrollment?.grade?.description || "";
  const targetYear = enrollmentInfo?.suggested_enrollment?.academic_year || "";
  const isFirstEnrollment =
    enrollmentInfo?.actual_enrollment?.is_first_enrollment === true;

  // Inicialización (existing_data + grado + año) solo una vez
  const initializedRef = useRef(false);

  useEffect(() => {
    if (data.student_birth_date) {
      const birthDate = new Date(data.student_birth_date);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (data.student_age !== age) {
        update({ student_age: age });
      }
    }
  }, [data.student_birth_date, data.student_age, update]);

  useEffect(() => {
    if (initializedRef.current) return;

    const updates: Record<string, any> = {};

    // Determinar si necesita corrección
    const needsCorrection =
      enrollmentInfo?.actual_enrollment?.needs_correction || false;


    // Precargar existing_data si:
    // 1. Puede matricularse Y
    // 2. (NO es primera matrícula O necesita corrección) Y
    // 3. Hay datos existentes
    const shouldPreloadExisting =
      canEnroll &&
      existingData &&
      Object.keys(existingData).length > 0;

    if (shouldPreloadExisting) {
      Object.assign(updates, existingData);
    }

    // Fecha del formulario
    if (!data.form_date) {
      updates.form_date = currentDate;
    }

    // Grado sugerido
    if (suggestedGradeObj) {
      if (!data.grade) {
        updates.grade = suggestedGradeObj.description;
      }
      if (!data.grade_id) {
        updates.grade_id = suggestedGradeObj.id;
      }
    }

    // Año escolar
    if (targetYear && !data.school_year) {
      updates.school_year = targetYear;
    }

    if (Object.keys(updates).length > 0) {
      update(updates);
    }

    initializedRef.current = true;
  }, [
    canEnroll,
    isFirstEnrollment,
    existingData,
    suggestedGradeObj,
    targetYear,
    currentDate,
    data.form_date,
    data.grade,
    data.grade_id,
    data.school_year,
    update,
  ]);

  // Handler para input/select
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox" && e.target instanceof HTMLInputElement) {
      update({ [name]: e.target.checked });
    } else {
      update({ [name]: value });
    }
  };

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // --- EFFECT: Auto-llenado acudiente (Padre/Madre) ---
  useEffect(() => {
    if (data.guardian_type === "Padre") {
      const newGuardian = {
        guardian_lastname1: data.father_lastname1,
        guardian_lastname2: data.father_lastname2,
        guardian_firstname1: data.father_firstname1,
        guardian_firstname2: data.father_firstname2,
        guardian_full_name: [
          data.father_firstname1,
          data.father_firstname2,
          data.father_lastname1,
          data.father_lastname2,
        ]
          .filter(Boolean)
          .join(" "),
        guardian_id_number: data.father_id_number,
        guardian_email: data.father_email,
        guardian_phone: data.father_phone,
        guardian_country: data.father_country,
        guardian_department: data.father_department,
        guardian_city: data.father_city,
        guardian_residence_country: data.father_residence_country,
        guardian_residence_department: data.father_residence_department,
        guardian_residence_city: data.father_residence_city,
        guardian_residence_barrio: data.father_residence_barrio,
        guardian_residence_address: data.father_residence_address,
        guardian_residence_address_complement:
          data.father_residence_address_complement,
        guardian_residence_stratum: data.father_residence_stratum,
        guardian_document_type: data.father_document_type,
        guardian_religion: data.father_religion,
        guardian_relationship: "Padre",
        guardian_profession: data.father_profession,
        guardian_company_name: data.father_company_name,
        guardian_company_address: data.father_company_address,
        guardian_work_phone: data.father_work_phone,
      };
      const needsUpdate = Object.keys(newGuardian).some(
        (key) => data[key] !== newGuardian[key]
      );
      if (needsUpdate) {
        update(newGuardian);
      }
    } else if (data.guardian_type === "Madre") {
      const newGuardian = {
        guardian_lastname1: data.mother_lastname1,
        guardian_lastname2: data.mother_lastname2,
        guardian_firstname1: data.mother_firstname1,
        guardian_firstname2: data.mother_firstname2,
        guardian_full_name: [
          data.mother_firstname1,
          data.mother_firstname2,
          data.mother_lastname1,
          data.mother_lastname2,
        ]
          .filter(Boolean)
          .join(" "),
        guardian_id_number: data.mother_id_number,
        guardian_email: data.mother_email,
        guardian_phone: data.mother_phone,
        guardian_country: data.mother_country,
        guardian_department: data.mother_department,
        guardian_city: data.mother_city,
        guardian_residence_country: data.mother_residence_country,
        guardian_residence_department: data.mother_residence_department,
        guardian_residence_city: data.mother_residence_city,
        guardian_residence_barrio: data.mother_residence_barrio,
        guardian_residence_address: data.mother_residence_address,
        guardian_residence_address_complement:
          data.mother_residence_address_complement,
        guardian_residence_stratum: data.mother_residence_stratum,
        guardian_document_type: data.mother_document_type,
        guardian_religion: data.mother_religion,
        guardian_relationship: "Madre",
        guardian_profession: data.mother_profession,
        guardian_company_name: data.mother_company_name,
        guardian_company_address: data.mother_company_address,
        guardian_work_phone: data.mother_work_phone,
      };
      const needsUpdate = Object.keys(newGuardian).some(
        (key) => data[key] !== newGuardian[key]
      );
      if (needsUpdate) {
        update(newGuardian);
      }
    } else if (data.guardian_type === "Otro") {
      // Limpiar los campos de acudiente cuando se selecciona "Otro"
      const fieldsToClean = {
        guardian_lastname1: "",
        guardian_lastname2: "",
        guardian_firstname1: "",
        guardian_firstname2: "",
        guardian_full_name: "",
        guardian_id_number: "",
        guardian_email: "",
        guardian_phone: "",
        guardian_country: "",
        guardian_department: "",
        guardian_city: "",
        guardian_residence_country: "",
        guardian_residence_department: "",
        guardian_residence_city: "",
        guardian_residence_barrio: "",
        guardian_residence_address: "",
        guardian_residence_address_complement: "",
        guardian_residence_stratum: "",
        guardian_document_type: "",
        guardian_religion: "",
        guardian_relationship: "",
        guardian_profession: "",
        guardian_company_name: "",
        guardian_company_address: "",
        guardian_work_phone: "",
      };
      const needsCleaning = Object.keys(fieldsToClean).some(
        (key) => data[key] !== ""
      );
      if (needsCleaning) {
        update(fieldsToClean);
      }
    } else if (data.guardian_type === "Empresa") {
      // Limpiar campos de persona natural cuando se selecciona "Empresa"
      const fieldsToClean = {
        // Nombres separados (para Empresa se usa guardian_full_name = Razón Social)
        guardian_lastname1: "",
        guardian_lastname2: "",
        guardian_firstname1: "",
        guardian_firstname2: "",
        // Tipo de documento (para Empresa se usa NIT directamente en guardian_id_number)
        guardian_document_type: "",
        // Datos personales que no aplican para empresas
        guardian_country: "",
        guardian_department: "",
        guardian_city: "",
        guardian_religion: "",
        guardian_residence_stratum: "",
        guardian_relationship: "",
        // Información laboral (no aplica para empresas)
        guardian_profession: "",
        guardian_company_name: "",
        guardian_company_address: "",
        guardian_work_phone: "",
      };
      const needsCleaning = Object.keys(fieldsToClean).some(
        (key) => data[key] !== ""
      );
      if (needsCleaning) {
        update(fieldsToClean);
      }
    }
  }, [
    data.guardian_type,
    // Padre
    data.father_lastname1,
    data.father_lastname2,
    data.father_firstname1,
    data.father_firstname2,
    data.father_id_number,
    data.father_email,
    data.father_phone,
    data.father_country,
    data.father_department,
    data.father_city,
    data.father_residence_country,
    data.father_residence_department,
    data.father_residence_city,
    data.father_residence_barrio,
    data.father_residence_address,
    data.father_residence_address_complement,
    data.father_residence_stratum,
    data.father_document_type,
    data.father_religion,
    // Madre
    data.mother_lastname1,
    data.mother_lastname2,
    data.mother_firstname1,
    data.mother_firstname2,
    data.mother_id_number,
    data.mother_email,
    data.mother_phone,
    data.mother_country,
    data.mother_department,
    data.mother_city,
    data.mother_residence_country,
    data.mother_residence_department,
    data.mother_residence_city,
    data.mother_residence_barrio,
    data.mother_residence_address,
    data.mother_residence_address_complement,
    data.mother_residence_stratum,
    data.mother_document_type,
    data.mother_religion,
    update,
  ]);

  // --- EFFECT: Auto-llenado residencia padre si vive con estudiante ---
  useEffect(() => {
    if (data.father_lives_with_student) {
      const needsUpdate =
        data.father_residence_country !== data.residence_country ||
        data.father_residence_department !== data.residence_department ||
        data.father_residence_city !== data.residence_city ||
        data.father_residence_barrio !== data.residence_barrio ||
        data.father_residence_address !== data.residence_address ||
        data.father_residence_address_complement !==
        data.residence_address_complement ||
        data.father_residence_stratum !== data.residence_stratum;
      if (needsUpdate) {
        update({
          father_residence_country: data.residence_country,
          father_residence_department: data.residence_department,
          father_residence_city: data.residence_city,
          father_residence_barrio: data.residence_barrio,
          father_residence_address: data.residence_address,
          father_residence_address_complement:
            data.residence_address_complement,
          father_residence_stratum: data.residence_stratum,
        });
      }
    }
  }, [
    data.father_lives_with_student,
    data.residence_country,
    data.residence_department,
    data.residence_city,
    data.residence_barrio,
    data.residence_address,
    data.residence_address_complement,
    data.residence_stratum,
    data.father_residence_country,
    data.father_residence_department,
    data.father_residence_city,
    data.father_residence_barrio,
    data.father_residence_address,
    data.father_residence_address_complement,
    data.father_residence_stratum,
    update,
  ]);

  // --- EFFECT: Auto-llenado residencia madre si vive con estudiante ---
  useEffect(() => {
    if (data.mother_lives_with_student) {
      const needsUpdate =
        data.mother_residence_country !== data.residence_country ||
        data.mother_residence_department !== data.residence_department ||
        data.mother_residence_city !== data.residence_city ||
        data.mother_residence_barrio !== data.residence_barrio ||
        data.mother_residence_address !== data.residence_address ||
        data.mother_residence_address_complement !==
        data.residence_address_complement ||
        data.mother_residence_stratum !== data.residence_stratum;
      if (needsUpdate) {
        update({
          mother_residence_country: data.residence_country,
          mother_residence_department: data.residence_department,
          mother_residence_city: data.residence_city,
          mother_residence_barrio: data.residence_barrio,
          mother_residence_address: data.residence_address,
          mother_residence_address_complement:
            data.residence_address_complement,
          mother_residence_stratum: data.residence_stratum,
        });
      }
    }
  }, [
    data.mother_lives_with_student,
    data.residence_country,
    data.residence_department,
    data.residence_city,
    data.residence_barrio,
    data.residence_address,
    data.residence_address_complement,
    data.residence_stratum,
    data.mother_residence_country,
    data.mother_residence_department,
    data.mother_residence_city,
    data.mother_residence_barrio,
    data.mother_residence_address,
    data.mother_residence_address_complement,
    data.mother_residence_stratum,
    update,
  ]);

  // --- MANEJO DE DATOS / localStorage ---
  const storageKey =
    enrollmentId !== null && enrollmentId !== undefined
      ? `enrollment_step3_${enrollmentId}`
      : null;

  const handleSubmit = async (e?: React.FormEvent) => {
    console.log("🚀 handleSubmit ejecutado");

    if (e) {
      e.preventDefault();
      console.log("✋ preventDefault llamado");
    }

    // Obtener todos los inputs, selects y textareas del formulario
    const form = document.querySelector("form");
    console.log("📋 Formulario encontrado:", form);
    console.log("✅ Formulario válido?:", form?.checkValidity());

    if (form && !form.checkValidity()) {
      // Encontrar el primer campo inválido
      const invalidField = form.querySelector(":invalid") as
        | HTMLInputElement
        | HTMLSelectElement;

      if (invalidField) {
        // Determinar a qué sección pertenece basándose en el nombre del campo
        let sectionToOpen = "";
        const fieldName = invalidField.name || "";

        console.log("🔍 Campo inválido detectado:", fieldName);
        console.log("🔍 Elemento completo:", invalidField);
        console.log("🔍 ID del campo:", invalidField.id);
        console.log(
          "🔍 Placeholder:",
          (invalidField as HTMLInputElement).placeholder
        );
        console.log(
          "🔍 Label asociado:",
          invalidField.labels?.[0]?.textContent
        );

        // Si no tiene name, intentar usar el placeholder para identificar la sección
        if (!fieldName) {
          const placeholder =
            (invalidField as HTMLInputElement).placeholder || "";
          console.log("⚠️ Campo sin name, usando placeholder:", placeholder);

          // Identificar sección por palabras clave en el placeholder
          if (
            placeholder.includes("Estudiante") ||
            placeholder.includes("Fecha") ||
            placeholder.includes("Matrícula")
          ) {
            sectionToOpen = "estudiante";
          } else if (
            placeholder.includes("Residencia") ||
            placeholder.includes("Barrio")
          ) {
            sectionToOpen = "residencia";
          } else if (
            placeholder.includes("Médica") ||
            placeholder.includes("EPS") ||
            placeholder.includes("Salud")
          ) {
            sectionToOpen = "medica";
          } else if (placeholder.includes("Padre")) {
            sectionToOpen = "padre";
          } else if (placeholder.includes("Madre")) {
            sectionToOpen = "madre";
          } else if (
            placeholder.includes("Acudiente") ||
            placeholder.includes("Tutor") ||
            placeholder.includes("Guardian")
          ) {
            sectionToOpen = "acudiente";
          }
        }

        if (
          fieldName.startsWith("student_") ||
          fieldName === "enrollment_date" ||
          fieldName === "enrollment_id"
        ) {
          sectionToOpen = "estudiante";
        } else if (fieldName.startsWith("residence_")) {
          sectionToOpen = "residencia";
        } else if (fieldName.startsWith("medical_")) {
          sectionToOpen = "medica";
        } else if (
          fieldName === "father_lives_with_student" ||
          fieldName === "mother_lives_with_student" ||
          fieldName === "lives_with_other"
        ) {
          sectionToOpen = "convivencia";
        } else if (fieldName.startsWith("father_")) {
          sectionToOpen = "padre";
        } else if (fieldName.startsWith("mother_")) {
          sectionToOpen = "madre";
        } else if (fieldName.startsWith("guardian_")) {
          sectionToOpen = "acudiente";
        }

        console.log("📂 Sección a abrir:", sectionToOpen);
        console.log("📊 Estado actual de secciones:", openSections);

        // Expandir la sección si está colapsada
        if (
          sectionToOpen &&
          !openSections[sectionToOpen as keyof typeof openSections]
        ) {
          console.log("✅ Expandiendo sección:", sectionToOpen);
          toggleSection(sectionToOpen as keyof typeof openSections);

          // Esperar un momento para que la sección se expanda antes de mostrar el error
          setTimeout(() => {
            console.log("⏰ Mostrando validación después de expandir");
            form.reportValidity();
            invalidField.focus();
            invalidField.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }, 300);
          return;
        } else {
          console.log("⚠️ Sección ya está abierta o no se encontró");
        }
      }

      // Si el formulario no es válido, mostrar los mensajes de error nativos
      form.reportValidity();
      return; // No permitir avanzar
    }

    try {
      if (storageKey) {
        localStorage.setItem(storageKey, JSON.stringify(data));
      }
      next();
    } catch (error) {
      console.error("Error al avanzar:", error);
      next();
    }
  };

  // --- ESTADOS PARA SELECTS DEPENDIENTES ---
  const [studentDept, setStudentDept] = useState("");
  const [studentCity, setStudentCity] = useState("");
  const [studentBarrio, setStudentBarrio] = useState("");
  const [studentOtroBarrio, setStudentOtroBarrio] = useState("");
  const [residenceDept, setResidenceDept] = useState("");
  const [residenceCity, setResidenceCity] = useState("");
  const [residenceBarrio, setResidenceBarrio] = useState("");
  const [residenceOtroBarrio, setResidenceOtroBarrio] = useState("");
  const [fatherDept, setFatherDept] = useState("");
  const [fatherCity, setFatherCity] = useState("");
  const [fatherBarrio, setFatherBarrio] = useState("");
  const [fatherOtroBarrio, setFatherOtroBarrio] = useState("");
  const [motherDept, setMotherDept] = useState("");
  const [motherCity, setMotherCity] = useState("");
  const [motherBarrio, setMotherBarrio] = useState("");
  const [motherOtroBarrio, setMotherOtroBarrio] = useState("");
  const [guardianBarrio, setGuardianBarrio] = useState("");
  const [guardianOtroBarrio, setGuardianOtroBarrio] = useState("");

  // Sincronizar estado local de guardianBarrio con data
  useEffect(() => {
    if (data.guardian_residence_barrio) {
      setGuardianBarrio(data.guardian_residence_barrio);
    }
  }, [data.guardian_residence_barrio]);

  // Sincronizar residenceBarrio con data
  useEffect(() => {
    if (data.residence_barrio) {
      setResidenceBarrio(data.residence_barrio);
    }
  }, [data.residence_barrio]);

  // Sincronizar fatherDept con data (para país de nacimiento del padre)
  useEffect(() => {
    if (data.father_country) {
      setFatherDept(data.father_country);
    }
  }, [data.father_country]);

  // Sincronizar fatherCity con data (para ciudad de nacimiento del padre)
  useEffect(() => {
    if (data.father_city) {
      setFatherCity(data.father_city);
    }
  }, [data.father_city]);

  // Sincronizar motherDept con data (para país de nacimiento de la madre)
  useEffect(() => {
    if (data.mother_country) {
      setMotherDept(data.mother_country);
    }
  }, [data.mother_country]);

  // Sincronizar motherCity con data (para ciudad de nacimiento de la madre)
  useEffect(() => {
    if (data.mother_city) {
      setMotherCity(data.mother_city);
    }
  }, [data.mother_city]);

  return (
    <form onSubmit={handleSubmit} noValidate={true}>
      <div className="space-y-6 animate-fade-in max-w-5xl mx-auto pb-10">
        {/* 1. Datos del Estudiante */}
        <SectionCard
          title="1. Información del Estudiante"
          isOpen={openSections.estudiante}
          onToggle={() => toggleSection("estudiante")}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Foto */}
            <div className="row-span-2 mt-3">
              <PhotoUploadField
                dataKey="student_photo"
                data={data}
                update={update}
                uploadedFiles={uploadedFiles}
                updateUploadedFiles={updateUploadedFiles}
                label="Foto de perfil"
                preloadedUrl={preloadedDocuments?.student_photo?.preview_base64}
              />
            </div>

            {/* Datos de matrícula */}
            <FormInput
              label="Fecha"
              name="form_date"
              value={data.form_date || currentDate}
              onChange={handleChange}
              disabled
            />
            <FormInput
              label="Grado"
              name="grade"
              value={data.grade || suggestedGrade}
              onChange={handleChange}
              disabled
            />
            <FormInput
              label="Año escolar"
              name="school_year"
              value={data.school_year || targetYear}
              onChange={handleChange}
              disabled
            />

            {/* Nombres y apellidos */}
            <FormInput
              label="Primer Apellido"
              name="student_lastname1"
              value={data.student_lastname1}
              onChange={handleChange}
              pattern="[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+"
              required={true}
            />
            <FormInput
              label="Segundo Apellido"
              name="student_lastname2"
              value={data.student_lastname2}
              onChange={handleChange}
              pattern="[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+"
              required={true}
            />
            <FormInput
              label="Primer Nombre"
              name="student_firstname1"
              value={data.student_firstname1}
              onChange={handleChange}
              pattern="[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+"
              required={true}
            />
            <FormInput
              label="Segundo Nombre"
              name="student_firstname2"
              value={data.student_firstname2}
              onChange={handleChange}
              pattern="[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+"
              required={true}
            />

            {/* Sexo */}
            <FormSelect
              label="Sexo"
              name="student_gender"
              value={data.student_gender}
              onChange={handleChange}
              options={["Masculino", "Femenino"]}
              required={true}
            />

            {/* Nacimiento */}
            <FormInput
              label="Fecha de Nacimiento"
              name="student_birth_date"
              type="date"
              value={data.student_birth_date}
              onChange={handleChange}
              required={true}
            />
            <FormInput
              label="Edad"
              name="student_age"
              value={data.student_age}
              onChange={handleChange}
              disabled
            />
            <ComboBox
              value={data.student_birth_country}
              setValue={(value) => update({ student_birth_country: value })}
              options={COUNTRIES}
              label="País de Nacimiento"
              disabled={false}
              required={true}
            />
            {data.student_birth_country === "Colombia" ? (
              <ComboBox
                value={data.student_birth_department}
                setValue={(value) =>
                  update({ student_birth_department: value })
                }
                options={COLOMBIA_DEPARTMENTS}
                label="Departamento"
                disabled={data.student_birth_country !== "Colombia"}
                required={true}
              />
            ) : (
              <FormInput
                label="Departamento"
                name="student_birth_department"
                value={data.student_birth_department}
                onChange={handleChange}
                disabled={false}
                required={true}
              />
            )}
            {data.student_birth_country === "Colombia" &&
              data.student_birth_department === "Atlántico" ? (
              <ComboBox
                value={data.student_birth_city}
                setValue={(value) => update({ student_birth_city: value })}
                options={ATLANTICO_CITIES}
                label="Ciudad"
                disabled={false}
                required={true}
              />
            ) : (
              <FormInput
                label="Ciudad"
                name="student_birth_city"
                value={data.student_birth_city}
                onChange={handleChange}
                required={true}
              />
            )}

            {/* Identificación */}
            <FormSelect
              label="Tipo de identificación"
              name="student_id_type"
              value={data.student_id_type}
              onChange={handleChange}
              options={DOCUMENT_TYPES}
              placeholder="Selecciona ID"
              required={true}
            />
            <FormInput
              label="Número de ID"
              name="student_id_number"
              value={data.student_id_number}
              onChange={handleChange}
              pattern="[0-9]*"
              inputMode="numeric"
              required={true}
            />

            {/* Expedición */}
            <ComboBox
              value={data.student_id_country}
              setValue={(value) => update({ student_id_country: value })}
              options={COUNTRIES}
              label="País de Expedición"
              disabled={false}
              required={true}
            />
            {data.student_id_country === "Colombia" ? (
              <ComboBox
                value={data.student_id_department}
                setValue={(value) => update({ student_id_department: value })}
                options={COLOMBIA_DEPARTMENTS}
                label="Departamento"
                disabled={data.student_id_country !== "Colombia"}
                required={true}
              />
            ) : (
              <FormInput
                label="Departamento"
                name="student_id_department"
                value={data.student_id_department}
                onChange={handleChange}
                disabled={false}
                required={true}
              />
            )}
            {data.student_id_country === "Colombia" &&
              data.student_id_department === "Atlántico" ? (
              <ComboBox
                value={data.student_id_city}
                setValue={(value) => update({ student_id_city: value })}
                options={ATLANTICO_CITIES}
                label="Ciudad"
                disabled={false}
                required={true}
              />
            ) : (
              <FormInput
                label="Ciudad"
                name="student_id_city"
                value={data.student_id_city}
                onChange={handleChange}
                disabled={false}
                required={true}
              />
            )}
            <FormInput
              label="Fecha de expedición"
              name="student_id_issue_date"
              type="date"
              value={data.student_id_issue_date}
              onChange={handleChange}
              required={true}
            />

            {/* Salud y familiares */}
            <ComboBox
              value={data.student_health_eps}
              setValue={(value) => update({ student_health_eps: value })}
              options={EPS_LIST}
              label="EPS"
              disabled={false}
              required={true}
            />

            <div className="grid grid-cols-2 gap-2">
              <FormSelect
                label="RH"
                name="student_blood_rh"
                value={data.student_blood_rh}
                onChange={handleChange}
                options={["+", "-"]}
                placeholder="+/-"
                required={true}
              />
              <FormSelect
                label="Grupo"
                name="student_blood_abo"
                value={data.student_blood_abo}
                onChange={handleChange}
                options={["A", "B", "AB", "O"]}
                placeholder="Tipo"
                required={true}
              />
            </div>

            <FormSelect
              label="¿Tiene celular?"
              name="student_has_cellphone"
              value={data.student_has_cellphone}
              onChange={handleChange}
              options={["Si", "No"]}
              required={true}
            />
            {data.student_has_cellphone === "Si" && (
              <FormInput
                label="Número de celular"
                name="student_cellphone"
                value={data.student_cellphone}
                onChange={handleChange}
              />
            )}

            <FormSelect
              label="¿Tiene hermanos?"
              name="student_has_siblings"
              value={data.student_has_siblings}
              onChange={handleChange}
              options={["Si", "No"]}
              required={true}
            />
            <FormSelect
              label="¿Estudian en la institución?"
              name="student_siblings_in_school"
              value={data.student_siblings_in_school}
              onChange={handleChange}
              options={["Si", "No"]}
              disabled={data.student_has_siblings !== "Si"}
            />
            <FormSelect
              label="Religión"
              name="student_religion"
              value={data.student_religion}
              onChange={handleChange}
              options={RELIGIONS}
              required={true}
            />
            <FormSelect
              label="Estado civil de los padres"
              name="parents_marital_status"
              value={data.parents_marital_status}
              onChange={handleChange}
              options={MARITAL_STATUS}
              required={true}
            />
          </div>
        </SectionCard>

        {/* 2. Residencia */}
        <SectionCard
          title="2. Información de Residencia"
          isOpen={openSections.residencia}
          onToggle={() => toggleSection("residencia")}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ComboBox
              value={data.residence_country}
              setValue={(value) => update({ residence_country: value })}
              options={COUNTRIES}
              label="País de Residencia"
              disabled={false}
              required={true}
            />
            {data.residence_country === "Colombia" ? (
              <ComboBox
                value={data.residence_department}
                setValue={(value) => update({ residence_department: value })}
                options={COLOMBIA_DEPARTMENTS}
                label="Departamento"
                disabled={data.residence_country !== "Colombia"}
                required={true}
              />
            ) : (
              <FormInput
                label="Departamento"
                name="residence_department"
                value={data.residence_department}
                onChange={handleChange}
                disabled={false}
                required={true}
              />
            )}
            {data.residence_country === "Colombia" &&
              data.residence_department === "Atlántico" ? (
              <ComboBox
                value={data.residence_city}
                setValue={(value) => update({ residence_city: value })}
                options={ATLANTICO_CITIES}
                label="Ciudad"
                disabled={false}
                required={true}
              />
            ) : (
              <FormInput
                label="Ciudad"
                name="residence_city"
                value={data.residence_city}
                onChange={handleChange}
                required={true}
              />
            )}

            {data.residence_city === "Barranquilla" ? (
              <>
                <ComboBox
                  value={residenceBarrio}
                  setValue={(value) => {
                    setResidenceBarrio(value);
                    update({ residence_barrio: value });
                  }}
                  options={BARRIOS_BARRANQUILLA}
                  label="Barrio de Residencia"
                  disabled={false}
                  required={true}
                />
                {residenceBarrio === "Otro" && (
                  <FormInput
                    label="Especifique el barrio"
                    name="residence_otro_barrio"
                    value={residenceOtroBarrio}
                    onChange={(e) => {
                      setResidenceOtroBarrio(e.target.value);
                      update({
                        residence_otro_barrio: e.target.value,
                        residence_barrio: e.target.value,
                      });
                    }}
                  />
                )}
              </>
            ) : (
              <FormInput
                label="Barrio de Residencia"
                name="residence_barrio"
                value={data.residence_barrio}
                onChange={handleChange}
                required={true}
              />
            )}

            <FormInput
              label="Dirección"
              name="residence_address"
              value={data.residence_address}
              onChange={handleChange}
              required={true}
            />
            <FormInput
              label="Complemento (Apto, Torre)"
              name="residence_address_complement"
              value={data.residence_address_complement}
              onChange={handleChange}
            />
            <FormSelect
              label="Estrato"
              name="residence_stratum"
              value={data.residence_stratum}
              onChange={handleChange}
              options={ESTRATOS}
              required={true}
            />
          </div>
        </SectionCard>

        {/* 3. Información Médica */}
        <SectionCard
          title="3. Información Médica"
          isOpen={openSections.medica}
          onToggle={() => toggleSection("medica")}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FormSelect
              label="¿Antecedentes médicos?"
              name="medical_has_history"
              value={data.medical_has_history}
              onChange={handleChange}
              options={["Si", "No"]}
              required={true}
            />
            {data.medical_has_history === "Si" && (
              <FormInput
                label="¿Cuál?"
                name="medical_history_detail"
                value={data.medical_history_detail}
                onChange={handleChange}
              />
            )}

            <FormSelect
              label="¿Medicamentos prescritos?"
              name="medical_has_medications"
              value={data.medical_has_medications}
              onChange={handleChange}
              options={["Si", "No"]}
              required={true}
            />
            {data.medical_has_medications === "Si" && (
              <FormInput
                label="¿Cuáles y dosis?"
                name="medical_medications_detail"
                value={data.medical_medications_detail}
                onChange={handleChange}
              />
            )}

            <FormSelect
              label="¿Alergias?"
              name="medical_has_allergies"
              value={data.medical_has_allergies}
              onChange={handleChange}
              options={["Si", "No"]}
              required={true}
            />
            {data.medical_has_allergies === "Si" && (
              <FormInput
                label="¿A qué?"
                name="medical_allergies_detail"
                value={data.medical_allergies_detail}
                onChange={handleChange}
              />
            )}

            <ComboBox
              label="¿Diagnóstico/Proceso?"
              value={data.medical_has_diagnosis}
              setValue={(value) => update({ medical_has_diagnosis: value })}
              options={[
                "TEA - Nivel 1 (requiere apoyo)",
                "TEA - Nivel 2 (requiere apoyo sustancial)",
                "TEA - Nivel 3 (requiere apoyo muy sustancial)",
                "Síndrome de Asperger",
                "TDAH - Tipo inatento",
                "TDAH - Tipo hiperactivo-impulsivo",
                "TDAH - Tipo combinado",
                "Discapacidad Intelectual - Leve",
                "Discapacidad Intelectual - Moderada",
                "Discapacidad Intelectual - Severa",
                "Discapacidad Intelectual - Profunda",
                "Discapacidad Intelectual Límite (BIF)",
                "Trastorno del Desarrollo de la Coordinación (Dispraxia)",
                "Trastorno Específico del Lenguaje (TEL)",
                "Dislexia",
                "Disgrafía",
                "Disortografía",
                "Discalculia",
                "Trastorno fonológico",
                "Trastorno de fluidez (tartamudez)",
                "Trastorno pragmático de la comunicación",
                "Apraxia del habla",
                "Retraso del lenguaje",
                "Baja visión",
                "Ceguera",
                "Ambliopía",
                "Estrabismo severo",
                "Hipoacusia leve, moderada o severa",
                "Sordera profunda",
                "Trastorno del procesamiento auditivo",
                "Parálisis cerebral",
                "Paraplejia / cuadriplejia",
                "Amputaciones",
                "Alteraciones osteomusculares",
                "Enfermedades neuromusculares (distrofias)",
                "Espina bífida",
                "Movilidad reducida (requiere soporte, bastón, férulas o silla de ruedas)",
                "Discapacidades Múltiples",
                "Trastorno negativista desafiante (TND)",
                "Trastorno de conducta",
                "Trastornos de ansiedad",
                "Depresión infantil o adolescente",
                "Trastorno adaptativo",
                "Estrés postraumático",
                "Fobia escolar",
                "Mutismo selectivo",
                "Epilepsia",
                "Síndrome de Down",
                "Síndrome de Williams",
                "Síndrome de Rett",
                "Síndrome X Frágil",
                "Enfermedades huérfanas que requieren ajustes",
                "Déficits nutricionales con impacto cognitivo",
                "Otros",
                "Ninguno",
              ]}
              placeholder="Selecciona..."
              disabled={false}
              required={true}
            />
            {data.medical_has_diagnosis === "Otros" && (
              <FormInput
                label="Especifique"
                name="medical_diagnosis_other"
                value={data.medical_diagnosis_other}
                onChange={handleChange}
              />
            )}

            {data.medical_has_diagnosis &&
              data.medical_has_diagnosis !== "Ninguno" && (
                <FormInput
                  label="Información adicional (Médico o Institución tratante)"
                  name="medical_diagnosis_additional_info"
                  value={data.medical_diagnosis_additional_info}
                  onChange={handleChange}
                  placeholder="Nombre del médico o institución"
                />
              )}
          </div>
        </SectionCard>

        {/* 4. Convivencia */}
        <SectionCard
          title="4. ¿Con quién vive el estudiante?"
          isOpen={openSections.ahorro}
          onToggle={() => toggleSection("ahorro")}
        >
          <div className="flex flex-col md:flex-row gap-4 p-2">
            <label className="label cursor-pointer justify-start gap-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors w-full md:w-1/3 flex-wrap">
              <input
                type="checkbox"
                className="checkbox checkbox-primary shrink-0"
                name="father_lives_with_student"
                checked={data.father_lives_with_student || false}
                onChange={handleChange}
              />
              <span className="label-text font-normal text-xs leading-tight">
                ¿El Padre vive con el estudiante?
              </span>
            </label>
            <label className="label cursor-pointer justify-start gap-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors w-full md:w-1/3 flex-wrap">
              <input
                type="checkbox"
                className="checkbox checkbox-primary shrink-0"
                name="mother_lives_with_student"
                checked={data.mother_lives_with_student || false}
                onChange={handleChange}
              />
              <span className="label-text font-normal text-xs leading-tight">
                ¿La Madre vive con el estudiante?
              </span>
            </label>
            <label className="label cursor-pointer justify-start gap-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors w-full md:w-1/3 flex-wrap">
              <input
                type="checkbox"
                className="checkbox checkbox-primary shrink-0"
                name="lives_with_other"
                checked={data.lives_with_other || false}
                onChange={handleChange}
                disabled={
                  data.father_lives_with_student ||
                  data.mother_lives_with_student
                }
              />
              <span
                className={`label-text font-normal text-xs leading-tight ${data.father_lives_with_student ||
                  data.mother_lives_with_student
                  ? "text-gray-400"
                  : ""
                  }`}
              >
                Vive con otra persona
              </span>
            </label>
          </div>
        </SectionCard>

        {/* 5. Padre */}
        <SectionCard
          title="5. Información del Padre"
          isOpen={openSections.padre}
          onToggle={() => toggleSection("padre")}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Foto del Padre */}
            <div className="row-span-2 mt-3">
              <PhotoUploadField
                dataKey="father_photo"
                data={data}
                update={update}
                uploadedFiles={uploadedFiles}
                updateUploadedFiles={updateUploadedFiles}
                label="Foto de perfil del Padre"
                preloadedUrl={preloadedDocuments?.father_photo?.preview_base64}
              />
            </div>

            <FormInput
              label="Primer Apellido"
              name="father_lastname1"
              value={data.father_lastname1}
              onChange={handleChange}
              pattern="[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+"
              required={data.father_lives_with_student}
            />
            <FormInput
              label="Segundo Apellido"
              name="father_lastname2"
              value={data.father_lastname2}
              onChange={handleChange}
              pattern="[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+"
              required={data.father_lives_with_student}
            />
            <FormInput
              label="Primer Nombre"
              name="father_firstname1"
              value={data.father_firstname1}
              onChange={handleChange}
              pattern="[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+"
              required={data.father_lives_with_student}
            />
            <FormInput
              label="Segundo Nombre"
              name="father_firstname2"
              value={data.father_firstname2}
              onChange={handleChange}
              pattern="[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+"
              required={data.father_lives_with_student}
            />

            <FormSelect
              label="Tipo de Documento"
              name="father_document_type"
              value={data.father_document_type}
              onChange={handleChange}
              options={DOCUMENT_TYPES}
              required={data.father_lives_with_student}
            />
            <FormInput
              label="Número de ID"
              name="father_id_number"
              value={data.father_id_number}
              onChange={handleChange}
              pattern="[0-9]*"
              inputMode="numeric"
              required={data.father_lives_with_student}
            />

            <FormInput
              label="Celular"
              name="father_phone"
              value={data.father_phone}
              onChange={handleChange}
              type="tel"
              pattern="[0-9]{10}"
              inputMode="numeric"
              maxLength={10}
              required={data.father_lives_with_student}
            />
            <FormInput
              label="Email"
              name="father_email"
              type="email"
              value={data.father_email}
              onChange={handleChange}
              required={data.father_lives_with_student}
            />

            <ComboBox
              value={data.father_country}
              setValue={(value) => update({ father_country: value })}
              options={COUNTRIES}
              label="País del Padre"
              disabled={false}
              required={data.father_lives_with_student}
            />
            {data.father_country === "Colombia" ? (
              <ComboBox
                value={data.father_department}
                setValue={(value) => update({ father_department: value })}
                options={COLOMBIA_DEPARTMENTS}
                label="Departamento de Nacimiento"
                disabled={data.father_country !== "Colombia"}
                required={data.father_lives_with_student}
              />
            ) : (
              <FormInput
                label="Departamento de Nacimiento"
                name="father_department"
                value={data.father_department}
                onChange={handleChange}
                disabled={false}
                required={data.father_lives_with_student}
              />
            )}
            {data.father_country === "Colombia" &&
              data.father_department === "Atlántico" ? (
              <ComboBox
                value={fatherCity}
                setValue={(value) => {
                  setFatherCity(value);
                  update({ father_city: value });
                }}
                options={ATLANTICO_CITIES}
                label="Ciudad de Nacimiento"
                disabled={false}
                required={data.father_lives_with_student}
              />
            ) : (
              <FormInput
                label="Ciudad de Nacimiento"
                name="father_city"
                value={fatherCity}
                onChange={(e) => {
                  setFatherCity(e.target.value);
                  update({ father_city: e.target.value });
                }}
                disabled={false}
                required={data.father_lives_with_student}
              />
            )}

            <FormSelect
              label="Religión"
              name="father_religion"
              value={data.father_religion}
              onChange={handleChange}
              options={RELIGIONS}
              required={data.father_lives_with_student}
            />

            <ComboBox
              value={data.father_residence_country}
              setValue={(value) => update({ father_residence_country: value })}
              options={COUNTRIES}
              label="País de Residencia"
              disabled={data.father_lives_with_student}
              required={!data.father_lives_with_student}
            />
            {data.father_residence_country === "Colombia" ? (
              <ComboBox
                value={data.father_residence_department}
                setValue={(value) =>
                  update({ father_residence_department: value })
                }
                options={COLOMBIA_DEPARTMENTS}
                label="Departamento de Residencia"
                disabled={data.father_lives_with_student}
                required={!data.father_lives_with_student}
              />
            ) : (
              <FormInput
                label="Departamento de Residencia"
                name="father_residence_department"
                value={data.father_residence_department}
                onChange={handleChange}
                disabled={data.father_lives_with_student}
                required={!data.father_lives_with_student}
              />
            )}
            {data.father_residence_country === "Colombia" &&
              data.father_residence_department === "Atlántico" ? (
              <ComboBox
                value={data.father_residence_city}
                setValue={(value) => update({ father_residence_city: value })}
                options={ATLANTICO_CITIES}
                label="Ciudad de Residencia"
                disabled={data.father_lives_with_student}
                required={!data.father_lives_with_student}
              />
            ) : (
              <FormInput
                label="Ciudad de Residencia"
                name="father_residence_city"
                value={data.father_residence_city}
                onChange={handleChange}
                disabled={data.father_lives_with_student}
                required={!data.father_lives_with_student}
              />
            )}
            {data.father_residence_city === "Barranquilla" ? (
              <>
                <ComboBox
                  value={data.father_residence_barrio}
                  setValue={(value) =>
                    update({ father_residence_barrio: value })
                  }
                  options={BARRIOS_BARRANQUILLA}
                  label="Barrio de Residencia"
                  disabled={data.father_lives_with_student}
                  required={!data.father_lives_with_student}
                />
                {fatherBarrio === "Otro" && (
                  <FormInput
                    label="Especifique el barrio"
                    name="father_otro_barrio"
                    value={fatherOtroBarrio}
                    onChange={(e) => {
                      setFatherOtroBarrio(e.target.value);
                      update({
                        father_otro_barrio: e.target.value,
                        father_residence_barrio: e.target.value,
                      });
                    }}
                  />
                )}
              </>
            ) : (
              <FormInput
                label="Barrio de Residencia"
                name="father_residence_barrio"
                value={data.father_residence_barrio}
                onChange={handleChange}
                disabled={data.father_lives_with_student}
                required={!data.father_lives_with_student}
              />
            )}
            <FormInput
              label="Dirección de Residencia"
              name="father_residence_address"
              value={data.father_residence_address}
              onChange={handleChange}
              disabled={data.father_lives_with_student}
              required={!data.father_lives_with_student}
            />
            <FormInput
              label="Complemento (Apto, Torre)"
              name="father_residence_address_complement"
              value={data.father_residence_address_complement}
              onChange={handleChange}
              disabled={data.father_lives_with_student}
            />
            <FormSelect
              label="Estrato"
              name="father_residence_stratum"
              value={data.father_residence_stratum}
              onChange={handleChange}
              options={ESTRATOS}
              disabled={data.father_lives_with_student}
              required={!data.father_lives_with_student}
            />

            {/* Información Laboral del Padre */}
            <FormInput
              label="Profesión"
              name="father_profession"
              value={data.father_profession}
              onChange={handleChange}
              required={data.father_lives_with_student}
            />
            <FormInput
              label="Nombre Empresa donde Labora"
              name="father_company_name"
              value={data.father_company_name}
              onChange={handleChange}
              required={data.father_lives_with_student}
            />
            <FormInput
              label="Dirección Empresa donde Labora"
              name="father_company_address"
              value={data.father_company_address}
              onChange={handleChange}
              required={data.father_lives_with_student}
            />
            <FormInput
              label="Número de contacto laboral"
              name="father_work_phone"
              type="tel"
              value={data.father_work_phone}
              onChange={handleChange}
              pattern="[0-9]*"
              inputMode="numeric"
              required={data.father_lives_with_student}
            />
          </div>
        </SectionCard>

        {/* 6. Madre */}
        <SectionCard
          title="6. Información de la Madre"
          isOpen={openSections.madre}
          onToggle={() => toggleSection("madre")}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Foto de la Madre */}
            <div className="row-span-2 mt-3">
              <PhotoUploadField
                dataKey="mother_photo"
                data={data}
                update={update}
                uploadedFiles={uploadedFiles}
                updateUploadedFiles={updateUploadedFiles}
                label="Foto de perfil de la Madre"
                preloadedUrl={preloadedDocuments?.mother_photo?.preview_base64}
              />
            </div>

            <FormInput
              label="Primer Apellido"
              name="mother_lastname1"
              value={data.mother_lastname1}
              onChange={handleChange}
              pattern="[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+"
              required={data.mother_lives_with_student}
            />
            <FormInput
              label="Segundo Apellido"
              name="mother_lastname2"
              value={data.mother_lastname2}
              onChange={handleChange}
              pattern="[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+"
              required={data.mother_lives_with_student}
            />
            <FormInput
              label="Primer Nombre"
              name="mother_firstname1"
              value={data.mother_firstname1}
              onChange={handleChange}
              pattern="[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+"
              required={data.mother_lives_with_student}
            />
            <FormInput
              label="Segundo Nombre"
              name="mother_firstname2"
              value={data.mother_firstname2}
              onChange={handleChange}
              pattern="[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+"
              required={data.mother_lives_with_student}
            />

            <FormSelect
              label="Tipo de Documento"
              name="mother_document_type"
              value={data.mother_document_type}
              onChange={handleChange}
              options={DOCUMENT_TYPES}
              required={data.mother_lives_with_student}
            />
            <FormInput
              label="Número de ID"
              name="mother_id_number"
              value={data.mother_id_number}
              onChange={handleChange}
              pattern="[0-9]*"
              inputMode="numeric"
              required={data.mother_lives_with_student}
            />

            <FormInput
              label="Celular"
              name="mother_phone"
              value={data.mother_phone}
              onChange={handleChange}
              type="tel"
              pattern="[0-9]{10}"
              inputMode="numeric"
              maxLength={10}
              required={data.mother_lives_with_student}
            />
            <FormInput
              label="Email"
              name="mother_email"
              type="email"
              value={data.mother_email}
              onChange={handleChange}
              required={data.mother_lives_with_student}
            />

            <ComboBox
              value={data.mother_country}
              setValue={(value) => update({ mother_country: value })}
              options={COUNTRIES}
              label="País"
              disabled={false}
              required={data.mother_lives_with_student}
            />
            {data.mother_country === "Colombia" ? (
              <ComboBox
                value={data.mother_department}
                setValue={(value) => update({ mother_department: value })}
                options={COLOMBIA_DEPARTMENTS}
                label="Departamento de Nacimiento"
                disabled={data.mother_country !== "Colombia"}
                required={data.mother_lives_with_student}
              />
            ) : (
              <FormInput
                label="Departamento de Nacimiento"
                name="mother_department"
                value={data.mother_department}
                onChange={handleChange}
                disabled={false}
                required={data.mother_lives_with_student}
              />
            )}
            {data.mother_country === "Colombia" &&
              data.mother_department === "Atlántico" ? (
              <ComboBox
                value={motherCity}
                setValue={(value) => {
                  setMotherCity(value);
                  update({ mother_city: value });
                }}
                options={ATLANTICO_CITIES}
                label="Ciudad de Nacimiento"
                disabled={false}
                required={data.mother_lives_with_student}
              />
            ) : (
              <FormInput
                label="Ciudad de Nacimiento"
                name="mother_city"
                value={motherCity}
                onChange={(e) => {
                  setMotherCity(e.target.value);
                  update({ mother_city: e.target.value });
                }}
                disabled={false}
                required={data.mother_lives_with_student}
              />
            )}

            <FormSelect
              label="Religión"
              name="mother_religion"
              value={data.mother_religion}
              onChange={handleChange}
              options={RELIGIONS}
              required={data.mother_lives_with_student}
            />

            <ComboBox
              value={data.mother_residence_country}
              setValue={(value) => update({ mother_residence_country: value })}
              options={COUNTRIES}
              label="País de Residencia"
              disabled={data.mother_lives_with_student}
              required={!data.mother_lives_with_student}
            />
            {data.mother_residence_country === "Colombia" ? (
              <ComboBox
                value={data.mother_residence_department}
                setValue={(value) =>
                  update({ mother_residence_department: value })
                }
                options={COLOMBIA_DEPARTMENTS}
                label="Departamento de Residencia"
                disabled={data.mother_lives_with_student}
                required={!data.mother_lives_with_student}
              />
            ) : (
              <FormInput
                label="Departamento de Residencia"
                name="mother_residence_department"
                value={data.mother_residence_department}
                onChange={handleChange}
                disabled={data.mother_lives_with_student}
                required={!data.mother_lives_with_student}
              />
            )}
            {data.mother_residence_country === "Colombia" &&
              data.mother_residence_department === "Atlántico" ? (
              <ComboBox
                value={data.mother_residence_city}
                setValue={(value) => update({ mother_residence_city: value })}
                options={ATLANTICO_CITIES}
                label="Ciudad de Residencia"
                disabled={data.mother_lives_with_student}
                required={!data.mother_lives_with_student}
              />
            ) : (
              <FormInput
                label="Ciudad de Residencia"
                name="mother_residence_city"
                value={data.mother_residence_city}
                onChange={handleChange}
                disabled={data.mother_lives_with_student}
                required={!data.mother_lives_with_student}
              />
            )}
            {data.mother_residence_city === "Barranquilla" ? (
              <>
                <ComboBox
                  value={data.mother_residence_barrio}
                  setValue={(value) =>
                    update({ mother_residence_barrio: value })
                  }
                  options={BARRIOS_BARRANQUILLA}
                  label="Barrio de Residencia"
                  disabled={data.mother_lives_with_student}
                  required={!data.mother_lives_with_student}
                />
                {motherBarrio === "Otro" && (
                  <FormInput
                    label="Especifique el barrio"
                    name="mother_otro_barrio"
                    value={motherOtroBarrio}
                    onChange={(e) => {
                      setMotherOtroBarrio(e.target.value);
                      update({
                        mother_otro_barrio: e.target.value,
                        mother_residence_barrio: e.target.value,
                      });
                    }}
                  />
                )}
              </>
            ) : (
              <FormInput
                label="Barrio de Residencia"
                name="mother_residence_barrio"
                value={data.mother_residence_barrio}
                onChange={handleChange}
                disabled={data.mother_lives_with_student}
                required={!data.mother_lives_with_student}
              />
            )}
            <FormInput
              label="Dirección de Residencia"
              name="mother_residence_address"
              value={data.mother_residence_address}
              onChange={handleChange}
              disabled={data.mother_lives_with_student}
              required={!data.mother_lives_with_student}
            />
            <FormInput
              label="Complemento (Apto, Torre)"
              name="mother_residence_address_complement"
              value={data.mother_residence_address_complement}
              onChange={handleChange}
              disabled={data.mother_lives_with_student}
            />
            <FormSelect
              label="Estrato"
              name="mother_residence_stratum"
              value={data.mother_residence_stratum}
              onChange={handleChange}
              options={ESTRATOS}
              disabled={data.mother_lives_with_student}
              required={!data.mother_lives_with_student}
            />

            {/* Información Laboral de la Madre */}
            <FormInput
              label="Profesión"
              name="mother_profession"
              value={data.mother_profession}
              onChange={handleChange}
              required={data.mother_lives_with_student}
            />
            <FormInput
              label="Nombre Empresa donde Labora"
              name="mother_company_name"
              value={data.mother_company_name}
              onChange={handleChange}
              required={data.mother_lives_with_student}
            />
            <FormInput
              label="Dirección Empresa donde Labora"
              name="mother_company_address"
              value={data.mother_company_address}
              onChange={handleChange}
              required={data.mother_lives_with_student}
            />
            <FormInput
              label="Número de contacto laboral"
              name="mother_work_phone"
              type="tel"
              value={data.mother_work_phone}
              onChange={handleChange}
              pattern="[0-9]*"
              inputMode="numeric"
              required={data.mother_lives_with_student}
            />
          </div>
        </SectionCard>

        {/* 7. Acudiente */}
        <SectionCard
          title="7. Acudiente / Adulto Responsable"
          isOpen={openSections.acudiente}
          onToggle={() => toggleSection("acudiente")}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FormSelect
              label="¿Quién es el acudiente?"
              name="guardian_type"
              value={data.guardian_type}
              onChange={handleChange}
              options={["Padre", "Madre", "Otro", "Empresa"]}
              placeholder="Seleccionar..."
              required={true}
            />

            {/* Campos para Empresa */}
            {data.guardian_type === "Empresa" && (
              <>
                <FormInput
                  label="Razón Social"
                  name="guardian_full_name"
                  value={data.guardian_full_name}
                  onChange={handleChange}
                  required={true}
                />
                <FormInput
                  label="NIT"
                  name="guardian_id_number"
                  value={data.guardian_id_number}
                  onChange={handleChange}
                  placeholder="Ej: 900123456-7"
                  required={true}
                />
              </>
            )}

            {/* Campos para Persona Natural (Padre, Madre, Otro) */}
            {data.guardian_type !== "Empresa" && (
              <>
                <FormInput
                  label="Primer Apellido"
                  name="guardian_lastname1"
                  value={data.guardian_lastname1}
                  onChange={handleChange}
                  pattern="[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+"
                  required={data.guardian_type === "Otro"}
                  disabled={
                    data.guardian_type === "Padre" || data.guardian_type === "Madre"
                  }
                />
                <FormInput
                  label="Segundo Apellido"
                  name="guardian_lastname2"
                  value={data.guardian_lastname2}
                  onChange={handleChange}
                  pattern="[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+"
                  required={data.guardian_type === "Otro"}
                  disabled={
                    data.guardian_type === "Padre" || data.guardian_type === "Madre"
                  }
                />
                <FormInput
                  label="Primer Nombre"
                  name="guardian_firstname1"
                  value={data.guardian_firstname1}
                  onChange={handleChange}
                  pattern="[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+"
                  required={data.guardian_type === "Otro"}
                  disabled={
                    data.guardian_type === "Padre" || data.guardian_type === "Madre"
                  }
                />
                <FormInput
                  label="Segundo Nombre"
                  name="guardian_firstname2"
                  value={data.guardian_firstname2}
                  onChange={handleChange}
                  pattern="[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+"
                  required={data.guardian_type === "Otro"}
                  disabled={
                    data.guardian_type === "Padre" || data.guardian_type === "Madre"
                  }
                />

                <FormSelect
                  label="Tipo de Documento"
                  name="guardian_document_type"
                  value={data.guardian_document_type}
                  onChange={handleChange}
                  options={DOCUMENT_TYPES}
                  required={data.guardian_type === "Otro"}
                  disabled={
                    data.guardian_type === "Padre" || data.guardian_type === "Madre"
                  }
                />
                <FormInput
                  label="Número de ID"
                  name="guardian_id_number"
                  value={data.guardian_id_number}
                  onChange={handleChange}
                  pattern="[0-9]*"
                  inputMode="numeric"
                  required={data.guardian_type === "Otro"}
                  disabled={
                    data.guardian_type === "Padre" || data.guardian_type === "Madre"
                  }
                />
              </>
            )}

            <FormInput
              label={data.guardian_type === "Empresa" ? "Teléfono de contacto" : "Celular"}
              name="guardian_phone"
              value={data.guardian_phone}
              onChange={handleChange}
              type="tel"
              pattern={data.guardian_type === "Empresa" ? "[0-9]*" : "[0-9]{10}"}
              inputMode="numeric"
              maxLength={data.guardian_type === "Empresa" ? 15 : 10}
              required={data.guardian_type === "Otro" || data.guardian_type === "Empresa"}
              disabled={
                data.guardian_type === "Padre" || data.guardian_type === "Madre"
              }
            />
            <FormInput
              label={data.guardian_type === "Empresa" ? "Email corporativo" : "Email"}
              name="guardian_email"
              type="email"
              value={data.guardian_email}
              onChange={handleChange}
              required={data.guardian_type === "Otro" || data.guardian_type === "Empresa"}
              disabled={
                data.guardian_type === "Padre" || data.guardian_type === "Madre"
              }
            />

            {/* Campos de lugar de nacimiento y religión - Solo para personas naturales */}
            {data.guardian_type !== "Empresa" && (
              <>
                <ComboBox
                  value={data.guardian_country}
                  setValue={(value) => update({ guardian_country: value })}
                  options={COUNTRIES}
                  label="País de nacimiento"
                  disabled={
                    data.guardian_type === "Padre" || data.guardian_type === "Madre"
                  }
                  required={data.guardian_type === "Otro"}
                />
                {data.guardian_country === "Colombia" ? (
                  <ComboBox
                    value={data.guardian_department}
                    setValue={(value) => update({ guardian_department: value })}
                    options={COLOMBIA_DEPARTMENTS}
                    label="Departamento"
                    disabled={
                      data.guardian_type === "Padre" ||
                      data.guardian_type === "Madre"
                    }
                    required={data.guardian_type === "Otro"}
                  />
                ) : (
                  <FormInput
                    label="Departamento"
                    name="guardian_department"
                    value={data.guardian_department}
                    onChange={handleChange}
                    disabled={
                      data.guardian_type === "Padre" ||
                      data.guardian_type === "Madre"
                    }
                    required={data.guardian_type === "Otro"}
                  />
                )}
                {data.guardian_country === "Colombia" &&
                  data.guardian_department === "Atlántico" ? (
                  <ComboBox
                    value={data.guardian_city}
                    setValue={(value) => update({ guardian_city: value })}
                    options={ATLANTICO_CITIES}
                    label="Ciudad"
                    disabled={
                      data.guardian_type === "Padre" ||
                      data.guardian_type === "Madre"
                    }
                    required={data.guardian_type === "Otro"}
                  />
                ) : (
                  <FormInput
                    label="Ciudad"
                    name="guardian_city"
                    value={data.guardian_city}
                    onChange={handleChange}
                    disabled={
                      data.guardian_type === "Padre" ||
                      data.guardian_type === "Madre"
                    }
                    required={data.guardian_type === "Otro"}
                  />
                )}

                <FormSelect
                  label="Religión"
                  name="guardian_religion"
                  value={data.guardian_religion}
                  onChange={handleChange}
                  options={RELIGIONS}
                  disabled={
                    data.guardian_type === "Padre" || data.guardian_type === "Madre"
                  }
                  required={data.guardian_type === "Otro"}
                />
              </>
            )}

            <ComboBox
              value={data.guardian_residence_country}
              setValue={(value) =>
                update({ guardian_residence_country: value })
              }
              options={COUNTRIES}
              label={data.guardian_type === "Empresa" ? "País de la sede" : "País de Residencia"}
              disabled={
                data.guardian_type === "Padre" || data.guardian_type === "Madre"
              }
              required={data.guardian_type === "Otro" || data.guardian_type === "Empresa"}
            />
            {data.guardian_residence_country === "Colombia" ? (
              <ComboBox
                value={data.guardian_residence_department}
                setValue={(value) =>
                  update({ guardian_residence_department: value })
                }
                options={COLOMBIA_DEPARTMENTS}
                label="Departamento"
                disabled={
                  data.guardian_type === "Padre" ||
                  data.guardian_type === "Madre"
                }
                required={data.guardian_type === "Otro" || data.guardian_type === "Empresa"}
              />
            ) : (
              <FormInput
                label="Departamento"
                name="guardian_residence_department"
                value={data.guardian_residence_department}
                onChange={handleChange}
                disabled={
                  data.guardian_type === "Padre" ||
                  data.guardian_type === "Madre"
                }
                required={data.guardian_type === "Otro"}
              />
            )}
            {data.guardian_residence_country === "Colombia" &&
              data.guardian_residence_department === "Atlántico" ? (
              <ComboBox
                value={data.guardian_residence_city}
                setValue={(value) => update({ guardian_residence_city: value })}
                options={ATLANTICO_CITIES}
                label="Ciudad"
                disabled={
                  data.guardian_type === "Padre" ||
                  data.guardian_type === "Madre"
                }
                required={data.guardian_type === "Otro"}
              />
            ) : (
              <FormInput
                label="Ciudad"
                name="guardian_residence_city"
                value={data.guardian_residence_city}
                onChange={handleChange}
                disabled={
                  data.guardian_type === "Padre" ||
                  data.guardian_type === "Madre"
                }
                required={data.guardian_type === "Otro"}
              />
            )}
            {data.guardian_residence_city === "Barranquilla" ? (
              <>
                <ComboBox
                  value={data.guardian_residence_barrio}
                  setValue={(value) => {
                    setGuardianBarrio(value);
                    update({ guardian_residence_barrio: value });
                  }}
                  options={BARRIOS_BARRANQUILLA}
                  label="Barrio"
                  disabled={
                    data.guardian_type === "Padre" ||
                    data.guardian_type === "Madre"
                  }
                  required={data.guardian_type === "Otro"}
                />
                {guardianBarrio === "Otro" && (
                  <FormInput
                    label="Especifique el barrio"
                    name="guardian_otro_barrio"
                    value={guardianOtroBarrio}
                    onChange={(e) => {
                      setGuardianOtroBarrio(e.target.value);
                      update({
                        guardian_otro_barrio: e.target.value,
                        guardian_residence_barrio: e.target.value,
                      });
                    }}
                    disabled={
                      data.guardian_type === "Padre" ||
                      data.guardian_type === "Madre"
                    }
                  />
                )}
              </>
            ) : (
              <FormInput
                label="Barrio"
                name="guardian_residence_barrio"
                value={data.guardian_residence_barrio}
                onChange={handleChange}
                disabled={
                  data.guardian_type === "Padre" ||
                  data.guardian_type === "Madre"
                }
                required={data.guardian_type === "Otro"}
              />
            )}
            <FormInput
              label={data.guardian_type === "Empresa" ? "Dirección de la sede" : "Dirección de Residencia"}
              name="guardian_residence_address"
              value={data.guardian_residence_address}
              onChange={handleChange}
              disabled={
                data.guardian_type === "Padre" || data.guardian_type === "Madre"
              }
              required={data.guardian_type === "Otro" || data.guardian_type === "Empresa"}
            />
            <FormInput
              label="Complemento (Apto, Torre)"
              name="guardian_residence_address_complement"
              value={data.guardian_residence_address_complement}
              onChange={handleChange}
              disabled={
                data.guardian_type === "Padre" || data.guardian_type === "Madre"
              }
            />
            {/* Estrato - Solo para personas naturales */}
            {data.guardian_type !== "Empresa" && (
              <FormSelect
                label="Estrato"
                name="guardian_residence_stratum"
                value={data.guardian_residence_stratum}
                onChange={handleChange}
                options={ESTRATOS}
                disabled={
                  data.guardian_type === "Padre" || data.guardian_type === "Madre"
                }
                required={data.guardian_type === "Otro"}
              />
            )}

            {data.guardian_type === "Otro" && (
              <FormInput
                label="Parentesco"
                name="guardian_relationship"
                value={data.guardian_relationship}
                onChange={handleChange}
                required={true}
              />
            )}

            {/* Información Laboral del Acudiente - Solo para personas naturales */}
            {data.guardian_type !== "Empresa" && (
              <>
                <FormInput
                  label="Profesión"
                  name="guardian_profession"
                  value={data.guardian_profession}
                  onChange={handleChange}
                  disabled={
                    data.guardian_type === "Padre" || data.guardian_type === "Madre"
                  }
                  required={data.guardian_type === "Otro"}
                />
                <FormInput
                  label="Nombre Empresa donde Labora"
                  name="guardian_company_name"
                  value={data.guardian_company_name}
                  onChange={handleChange}
                  disabled={
                    data.guardian_type === "Padre" || data.guardian_type === "Madre"
                  }
                  required={data.guardian_type === "Otro"}
                />
                <FormInput
                  label="Dirección Empresa donde Labora"
                  name="guardian_company_address"
                  value={data.guardian_company_address}
                  onChange={handleChange}
                  disabled={
                    data.guardian_type === "Padre" || data.guardian_type === "Madre"
                  }
                  required={data.guardian_type === "Otro"}
                />
                <FormInput
                  label="Número de contacto laboral"
                  name="guardian_work_phone"
                  type="tel"
                  value={data.guardian_work_phone}
                  onChange={handleChange}
                  pattern="[0-9]*"
                  inputMode="numeric"
                  disabled={
                    data.guardian_type === "Padre" || data.guardian_type === "Madre"
                  }
                  required={data.guardian_type === "Otro"}
                />
              </>
            )}
          </div>
        </SectionCard>

        {/* Botones de navegación */}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200 mt-8">
          <button
            type="button"
            onClick={back}
            className="btn btn-outline btn-primary w-full sm:w-auto"
          >
            Atrás
          </button>
          <button type="submit" className="btn btn-primary w-full sm:w-auto">
            Siguiente
          </button>
        </div>
      </div>
    </form>
  );
};

// --- SELECTS DEPENDIENTES ---
const ATLANTICO_CITIES = [
  "Barranquilla",
  "Baranoa",
  "Campo de la Cruz",
  "Candelaria",
  "Galapa",
  "Juan de Acosta",
  "Luruaco",
  "Malambo",
  "Manatí",
  "Palmar de Varela",
  "Piojó",
  "Polonuevo",
  "Ponedera",
  "Puerto Colombia",
  "Repelón",
  "Sabanagrande",
  "Sabanalarga",
  "Santa Lucía",
  "Santo Tomás",
  "Soledad",
  "Suan",
  "Tubará",
  "Usiacurí",
];

const DepartmentSelect = ({ label, name, value, onChange, disabled }: any) => (
  <FormSelect
    label={label || "Departamento"}
    name={name}
    value={value}
    onChange={onChange}
    options={COLOMBIA_DEPARTMENTS}
    disabled={disabled}
  />
);
