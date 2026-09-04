import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes.jsx";
import Toaster from "./components/ui/Toaster.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Toaster />
      <AppRoutes />
    </BrowserRouter>
  );
}
