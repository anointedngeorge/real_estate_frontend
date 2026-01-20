import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import Overview from "./pages/Overview";
import Users from "./pages/Users";
import Realtors from "./pages/Realtors";
import Clients from "./pages/Clients";
import Properties from "./pages/Properties";
import Sales from "./pages/Sales";
import Payments from "./pages/Payments";
import Analytics from "./pages/Analytics";
import Marketing from "./pages/Marketing";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<Overview />} />
            <Route path="/users" element={<Users />} />
            <Route path="/realtors" element={<Realtors />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/marketing" element={<Marketing />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
