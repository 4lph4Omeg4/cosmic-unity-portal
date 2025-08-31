// src/App.tsx
import React, { useEffect } from "react";

// Supabase client (uit src/utils/supabase.ts)
import { supabase } from "@/utils/supabase";

// Providers & UI
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/hooks/useAuth";
import { LanguageProvider } from "@/hooks/useLanguage";
import { CartProvider } from "@/hooks/useCart";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

// Router
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
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
import Friends from "./pages/Friends";
import Messages from "./pages/Messages";
import Blog from "./pages/Blog";
import BlogArticle from "./pages/BlogArticle";
import About from "./pages/About";
import Contact from "./pages/Contact";
import EgoToEden from "./pages/EgoToEden";
import Unity from "./pages/Unity";
import Passport from "./pages/Passport";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import RefundPolicy from "./pages/RefundPolicy";
import ShippingPolicy from "./pages/ShippingPolicy";
import TermsOfService from "./pages/TermsOfService";
import UnderConstruction from "./pages/UnderConstruction";
import NotFound from "./pages/NotFound";

// Timeline Alchemy
import TimelineAlchemy from "./pages/TimelineAlchemy";
import TimelineAlchemyDashboard from "./pages/timeline-alchemy/admin/Dashboard";
import TimelineAlchemyIdeas from "./pages/timeline-alchemy/admin/Ideas";
import TimelineAlchemyPreviewWizard from "./pages/timeline-alchemy/admin/PreviewWizard";
import TimelineAlchemyMyPreviews from "./pages/timeline-alchemy/client/MyPreviews";
import TimelineAlchemySocialConnections from "./pages/timeline-alchemy/client/SocialConnections";

// Analytics
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";

// Onboarding
import OnboardingDemo from "@/components/onboarding/OnboardingDemo";
import OnboardingTest from "@/pages/OnboardingTest";
import OnboardingRedirect from "@/pages/OnboardingRedirect";

const queryClient = new QueryClient();

const App: React.FC = () => {
  // --- Supabase: optionele, veilige smoke-test ---
  useEffect(() => {
    const url = import.meta.env.VITE_SUPABASE_URL;
    const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;
    if (!url || !anon) {
      console.warn("⚠️ Supabase env vars ontbreken (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY).");
      return;
    }

    // Als je VITE_SUPABASE_HEALTH_TABLE zet (bv. "organizations"), testen we 1 query.
    const healthTable = import.meta.env.VITE_SUPABASE_HEALTH_TABLE;
    if (!healthTable) {
      console.log("✅ Supabase client geïnitialiseerd.");
      return;
    }

    (async () => {
      const { data, error } = await supabase.from(healthTable).select("*").limit(1);
      if (error) {
        console.error("❌ Supabase smoke-test error:", error.message);
      } else {
        console.log("✅ Supabase smoke-test ok. Sample:", data);
      }
    })();
  }, []);
  // --- Einde Supabase smoke-test ---

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthProvider>
          <CartProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />

              <BrowserRouter>
                <Routes>
                  {/* Public routes */}
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
                  <Route path="/friends" element={<Friends />} />
                  <Route path="/messages" element={<Messages />} />
                  <Route path="/messages/:userId" element={<Messages />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:blogHandle/:articleHandle" element={<BlogArticle />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/ego-to-eden" element={<EgoToEden />} />
                  <Route path="/unity" element={<Unity />} />
                  <Route path="/eenheid-gezien-door-het-enkele-oog" element={<Unity />} />
                  <Route path="/passport" element={<Passport />} />

                  {/* Policies (NL/EN/DE) */}
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

                  {/* Timeline Alchemy entry */}
                  <Route path="/timeline-alchemy" element={<TimelineAlchemy />} />
                  <Route path="/tla" element={<TimelineAlchemy />} />

                  {/* Timeline Alchemy Admin */}
                  <Route path="/timeline-alchemy/admin/dashboard" element={<TimelineAlchemyDashboard />} />
                  <Route path="/timeline-alchemy/admin/ideas" element={<TimelineAlchemyIdeas />} />
                  <Route path="/timeline-alchemy/admin/preview-wizard" element={<TimelineAlchemyPreviewWizard />} />

                  {/* Timeline Alchemy Client */}
                  <Route path="/timeline-alchemy/client/my-previews" element={<TimelineAlchemyMyPreviews />} />
                  <Route path="/timeline-alchemy/client/social-connections" element={<TimelineAlchemySocialConnections />} />

                  {/* Onboarding */}
                  <Route path="/onboarding" element={<OnboardingRedirect />} />
                  <Route path="/onboarding/demo" element={<OnboardingDemo />} />
                  <Route path="/onboarding/test" element={<OnboardingTest />} />

                  {/* Catch-all */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>

              <SpeedInsights />
              <Analytics />
            </TooltipProvider>
          </CartProvider>
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
};

export default App;
