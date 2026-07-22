import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import "./index.css";
import "./components/ui/buttons.css";
import { Toaster } from "sonner";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />

    <Toaster position="bottom-right" richColors closeButton duration={3500} />
  </StrictMode>,
);
