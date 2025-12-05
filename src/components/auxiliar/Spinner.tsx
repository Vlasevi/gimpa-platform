import logo from "../../assets/logo.png";

export default function Spinner() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <img
        src={logo}
        alt="Cargando..."
        className="w-40 h-40 animate-[shine_2s_ease-in-out_infinite]"
      />
      <style>
        {`
          @keyframes shine {
            0%, 50% { filter: brightness(1) opacity(1); }
            50% { filter: brightness(1.0) opacity(0.8); }
          }
        `}
      </style>
    </div>
  );
}
