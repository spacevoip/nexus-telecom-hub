import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Agents from "./pages/Agents";
import ActiveCalls from "./pages/ActiveCalls";
import CDR from "./pages/CDR";
import Audios from "./pages/Audios";
import Settings from "./pages/Settings";
import Plans from "./pages/Plans";
import Users from "./pages/Users";
import Reports from "./pages/Reports";
import Performance from "./pages/Performance";
import SystemStatus from "./pages/SystemStatus";
import ClientAgents from "./pages/ClientAgents";
import Rates from "./pages/Rates";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/auth" />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Routes>
                        <Route path="/" element={<Navigate to="/dashboard" />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/agents" element={<Agents />} />
                        <Route path="/active-calls" element={<ActiveCalls />} />
                        <Route path="/cdr" element={<CDR />} />
                        <Route path="/audios" element={<Audios />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/plans" element={<Plans />} />
                        <Route path="/users" element={<Users />} />
                        <Route path="/reports" element={<Reports />} />
                        <Route path="/performance" element={<Performance />} />
                        <Route path="/system-status" element={<SystemStatus />} />
                        <Route path="/client-agents" element={<ClientAgents />} />
                        <Route path="/rates" element={<Rates />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
