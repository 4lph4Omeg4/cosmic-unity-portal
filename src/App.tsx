// src/App.tsx
import React, { useEffect } from "react";



// Providers & UI
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { LanguageProvider } from "@/hooks/useLanguage";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

// Router
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Index from "./pages/Index";

import Blog from "./pages/Blog";
import BlogArticle from "./pages/BlogArticle";
import About from "./pages/About";
import Contact from "./pages/Contact";
import EgoToEden from "./pages/EgoToEden";
import Unity from "./pages/Unity";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import RefundPolicy from "./pages/RefundPolicy";
import ShippingPolicy from "./pages/ShippingPolicy";
import TermsOfService from "./pages/TermsOfService";
import UnderConstruction from "./pages/UnderConstruction";
import NotFound from "./pages/NotFound";


// Analytics
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";



const queryClient = new QueryClient();

const App: React.FC = () => {


  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />

          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:blogHandle/:articleHandle" element={<BlogArticle />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/ego-to-eden" element={<EgoToEden />} />
              <Route path="/unity" element={<Unity />} />
              <Route path="/eenheid-gezien-door-het-enkele-oog" element={<Unity />} />

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


              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>

          <SpeedInsights />
          <Analytics />
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
};

export default App;
