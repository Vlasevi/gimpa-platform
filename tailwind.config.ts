import type { Config } from "tailwindcss";

export default {
  content: [
    "./index.html",
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  plugins: [], // Vacío si usas @plugin en el CSS
} satisfies Config;
