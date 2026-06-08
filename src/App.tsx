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
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";

import "./lib/interceptors";
import Profile from "./pages/Profile";
import UserProfilePage from "./pages/User_profile";
import RealtorProfile from "./pages/realtor_profile";
import ClientProfile from "./pages/cllient_profile";
import PropertyDetails from "./pages/property_details";

const queryClient = new QueryClient();


const App = () => (
  <QueryClientProvider client={queryClient} >
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* how do i pass general data like a provider to this route */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Overview />} loader={true} />
            <Route path="/users" >
                  <Route path="list" element={<Users />} /> 
                  <Route path="profile" element={<UserProfilePage />}  />
            </Route>
            
            <Route path="/clients" >
              <Route path="list" element={<Clients />} />
              <Route path="profile" element={<ClientProfile />} />
            </Route>
            
            <Route path="/properties" >
              <Route path="list" element={<Properties />} />
              <Route path="details" element={<PropertyDetails />} />

            </Route>
            <Route path="/sales" element={<Sales />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/marketing" element={<Marketing />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
            
            <Route path="/realtors" >
                <Route path="list" element={<Realtors />} />
                <Route path="profile" element={<RealtorProfile />} />
            </Route>

  
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
