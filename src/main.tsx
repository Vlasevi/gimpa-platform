import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initializeCsrfToken } from "./utils/api";

// Inicializar token CSRF al cargar la aplicación
initializeCsrfToken();

createRoot(document.getElementById("root")!).render(<App />);
