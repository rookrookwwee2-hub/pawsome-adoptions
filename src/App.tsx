import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/components/ThemeProvider";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Pets from "./pages/Pets";
import PetDetails from "./pages/PetDetails";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import Account from "./pages/Account";
import PaymentMethods from "./pages/PaymentMethods";
import Dashboard from "./pages/admin/Dashboard";
import PetsManagement from "./pages/admin/PetsManagement";
import AdoptionsManagement from "./pages/admin/AdoptionsManagement";
import UsersManagement from "./pages/admin/UsersManagement";
import GuestPaymentsManagement from "./pages/admin/GuestPaymentsManagement";
import PaymentProofsManagement from "./pages/admin/PaymentProofsManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/pets" element={<Pets />} />
                <Route path="/pets/:id" element={<PetDetails />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/payment-methods" element={<PaymentMethods />} />
                <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
                <Route path="/admin" element={<ProtectedRoute requireAdmin><Dashboard /></ProtectedRoute>} />
                <Route path="/admin/pets" element={<ProtectedRoute requireAdmin><PetsManagement /></ProtectedRoute>} />
                <Route path="/admin/adoptions" element={<ProtectedRoute requireAdmin><AdoptionsManagement /></ProtectedRoute>} />
                <Route path="/admin/users" element={<ProtectedRoute requireAdmin><UsersManagement /></ProtectedRoute>} />
                <Route path="/admin/payments" element={<ProtectedRoute requireAdmin><GuestPaymentsManagement /></ProtectedRoute>} />
                <Route path="/admin/payment-proofs" element={<ProtectedRoute requireAdmin><PaymentProofsManagement /></ProtectedRoute>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </HelmetProvider>
);

export default App;
