import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NewsletterPopup from "@/components/NewsletterPopup";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { LanguageProvider } from "@/hooks/useLanguage";
import { CartProvider } from "@/hooks/useCart";
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import Collection from "./pages/Collection";
import Product from "./pages/Product";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import Community from "./pages/Community";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import UserProfile from "./pages/UserProfile";
import Messages from "./pages/Messages";
import Blog from "./pages/Blog";
import About from "./pages/About";
import Contact from "./pages/Contact";
import EgoToEden from "./pages/EgoToEden";
import Unity from "./pages/Unity";
import BlogArticle from "./pages/BlogArticle";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import RefundPolicy from "./pages/RefundPolicy";
import ShippingPolicy from "./pages/ShippingPolicy";
import TermsOfService from "./pages/TermsOfService";
import UnderConstruction from "./pages/UnderConstruction";
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
            <NewsletterPopup delay={20000} exitIntent={true} />
            <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/shop/collection/:collection" element={<Collection />} />
              <Route path="/product/:handle" element={<Product />} />
              <Route path="/products/:productId" element={<ProductPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/community" element={<Community />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/user/:userId" element={<UserProfile />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/messages/:userId" element={<Messages />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/ego-to-eden" element={<EgoToEden />} />
              <Route path="/unity" element={<Unity />} />
              <Route path="/eenheid-gezien-door-het-enkele-oog" element={<Unity />} />
              <Route path="/blog/:blogHandle/:articleHandle" element={<BlogArticle />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacybeleid" element={<PrivacyPolicy />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/datenschutz" element={<PrivacyPolicy />} />
              <Route path="/retourbeleid" element={<RefundPolicy />} />
              <Route path="/refund-policy" element={<RefundPolicy />} />
              <Route path="/rückgaberecht" element={<RefundPolicy />} />
              <Route path="/verzendbeleid" element={<ShippingPolicy />} />
              <Route path="/shipping-policy" element={<ShippingPolicy />} />
              <Route path="/versandrichtlinien" element={<ShippingPolicy />} />
              <Route path="/algemene-voorwaarden" element={<TermsOfService />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/nutzungsbedingungen" element={<TermsOfService />} />
              <Route path="/digitempel" element={<UnderConstruction />} />
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
