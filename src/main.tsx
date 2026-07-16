import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { installAuthInterceptor } from "./utils/authInterceptor";

// Interceptor global de fetch: adjunta el Bearer y refresca el token ante 401.
installAuthInterceptor();

createRoot(document.getElementById("root")!).render(<App />);
