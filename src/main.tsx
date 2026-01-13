import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./styles/login.css";
import "./styles/dashboard.css";
import { initEduPlan } from "./config/eduplan";

// Inizializza EduPlan (Training Management System)
initEduPlan();

createRoot(document.getElementById("root")!).render(<App />);
