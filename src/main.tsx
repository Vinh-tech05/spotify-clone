import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import { PlayerProvider } from "./context/PlayerContext.tsx";

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <PlayerProvider>
      <StrictMode>
        <App />
      </StrictMode>
    </PlayerProvider>
  </AuthProvider>
);
