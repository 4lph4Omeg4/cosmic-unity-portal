import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { LanguageProvider } from "@/hooks/useLanguage";
import { CartProvider } from "@/hooks/useCart";
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import Product from "./pages/Product";
import ProductPage from "./pages/ProductPage";
import Community from "./pages/Community";
import Auth from "./pages/Auth";
import Blog from "./pages/Blog";
import About from "./pages/About";
import Contact from "./pages/Contact";
import EgoToEden from "./pages/EgoToEden";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:handle" element={<Product />} />
              <Route path="/products/:productId" element={<ProductPage />} />
              <Route path="/community" element={<Community />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/ego-to-eden" element={<EgoToEden />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
