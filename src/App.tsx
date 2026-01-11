import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate, Navigate, Outlet } from "react-router-dom";
import { RSVPProvider } from "@/contexts/RSVPContext";
import { DashboardLayout } from "@/components/wedding/DashboardLayout";
import { supabase } from "@/lib/supabase";

// Pages
import DashboardPage from "./pages/DashboardPage";
import ResponsesPage from "./pages/ResponsesPage";
import DeletedPage from "./pages/DeletedPage";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage"; // Make sure this path is correct!

const queryClient = new QueryClient();

// 1. Create an inner component to handle Routing & Auth Logic
// We need this separation so we can use the 'useNavigate' hook which requires being inside <BrowserRouter>
const AppRoutes = () => {
  const [session, setSession] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(!!session);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(!!session);
      if (!session) {
        navigate("/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Loading state (prevent flickering)
  if (session === null) return null;

  return (
    <Routes>
      {/* Public Route: Login (No Layout) */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Routes: Wrapped in Layout & RSVP Provider */}
      {session ? (
        <Route
          element={
            <RSVPProvider>
              <DashboardLayout>
                <Outlet /> {/* This renders the child route (Dashboard, Responses, etc.) */}
              </DashboardLayout>
            </RSVPProvider>
          }
        >
          <Route path="/" element={<DashboardPage />} />
          <Route path="/responses" element={<ResponsesPage />} />
          <Route path="/deleted" element={<DeletedPage />} />
        </Route>
      ) : (
        // Redirect unauthenticated users
        <Route path="*" element={<Navigate to="/login" replace />} />
      )}

      {/* Catch-all for 404s */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

// 2. Main App Component (Providers only)
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;