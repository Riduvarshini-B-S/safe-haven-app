import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BottomNav } from "@/components/BottomNav";
import Dashboard from "./pages/Dashboard";
import SafeRoutes from "./pages/SafeRoutes";
import Contacts from "./pages/Contacts";
import AppSettings from "./pages/AppSettings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <div className="max-w-lg mx-auto min-h-screen" style={{ background: "var(--gradient-surface)" }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/routes" element={<SafeRoutes />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/settings" element={<AppSettings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <BottomNav />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
