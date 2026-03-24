import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BottomNav } from "@/components/BottomNav";
import GetStarted from "./pages/GetStarted";
import PersonalDetails from "./pages/PersonalDetails";
import Dashboard from "./pages/Dashboard";
import SafeRoutes from "./pages/SafeRoutes";
import Contacts from "./pages/Contacts";
import AppSettings from "./pages/AppSettings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppRoutes() {
  const location = useLocation();
  const onboarded = localStorage.getItem("safeguard_onboarded") === "true";

  return (
    <Routes>
      <Route path="/get-started" element={onboarded ? <Navigate to="/" replace /> : <GetStarted />} />
      <Route path="/personal-details" element={<PersonalDetails />} />
      <Route path="/" element={onboarded ? <Dashboard /> : <Navigate to="/get-started" replace />} />
      <Route path="/routes" element={onboarded ? <SafeRoutes /> : <Navigate to="/get-started" replace />} />
      <Route path="/contacts" element={onboarded ? <Contacts /> : <Navigate to="/get-started" replace />} />
      <Route path="/settings" element={onboarded ? <AppSettings /> : <Navigate to="/get-started" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <div className="max-w-lg mx-auto min-h-screen" style={{ background: "var(--gradient-surface)" }}>
          <AppRoutes />
          <BottomNavWrapper />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

function BottomNavWrapper() {
  const onboarded = localStorage.getItem("safeguard_onboarded") === "true";
  if (!onboarded) return null;
  return <BottomNav />;
}

export default App;
