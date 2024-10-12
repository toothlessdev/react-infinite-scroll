import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./tailwind.css";
import "react-toastify/dist/ReactToastify.css";

createRoot(document.getElementById("root")!).render(<App />);
