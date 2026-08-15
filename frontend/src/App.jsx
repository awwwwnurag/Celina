import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext'; // wait, it was CartContext? Let's check
import { ThemeProvider } from './context/ThemeContext';
import { SettingsProvider } from './context/SettingsContext';

// Components & guards
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CommerceExperience } from './components/CommerceExperience';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';
import { MobileBottomNav } from './components/MobileBottomNav';
import { AnnouncementBar } from './components/AnnouncementBar';
import { CouponPopup } from './components/CouponPopup';
import { NewsletterPopup } from './components/NewsletterPopup';
import { ExitIntentPopup } from './components/ExitIntentPopup';
import { ScrollToTop } from './components/ScrollToTop';
import { HeavenGateLoader } from './components/HeavenGateLoader';

// Pages
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetails } from './pages/ProductDetails';
import { Wishlist } from './pages/Wishlist';
import { Checkout } from './pages/Checkout';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Profile } from './pages/Profile';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { AdminDashboard } from './pages/AdminDashboard';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { Support } from './pages/Support';
import { Careers } from './pages/Careers';
import { ShareLocation } from './pages/ShareLocation';
import { SizeGuide } from './pages/SizeGuide';
import { FAQs } from './pages/FAQs';
import { Terms } from './pages/Terms';
import { Privacy } from './pages/Privacy';

// Minimalist 404 page
const NotFound = () => (
  <div className="max-w-md mx-auto text-center py-24 px-4 space-y-6">
    <h1 className="font-display font-bold text-5xl text-brand-burgundy dark:text-white uppercase tracking-wider">404</h1>
    <h3 className="font-display font-semibold text-lg text-gray-500 uppercase tracking-widest">Page Not Found</h3>
    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
      The collection page or kurti style you are looking for has been moved or does not exist.
    </p>
    <div className="pt-4">
      <Link to="/home" className="bg-brand-burgundy text-white px-8 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition">
        Return Home
      </Link>
    </div>
  </div>
);

const AppContent = () => {
  const location = useLocation();
  const isLoaderPage = location.pathname === '/';

  if (isLoaderPage) {
    return (
      <Routes>
        <Route path="/" element={<HeavenGateLoader />} />
      </Routes>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AnnouncementBar />
      <Header />
      
      {/* Main Content Area */}
      <main className="flex-grow pt-[94px] lg:pt-[110px] 2xl:pt-[130px]">
        <CommerceExperience />
        <CouponPopup />
        <NewsletterPopup />
        <ExitIntentPopup />
        <Routes>
          {/* Public routes */}
          <Route path="/home" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/support" element={<Support />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/share-location" element={<ShareLocation />} />
          <Route path="/size-guide" element={<SizeGuide />} />
          <Route path="/faqs" element={<FAQs />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />

          {/* Customer Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/orders" element={<Profile />} />
          </Route>

          {/* Admin Protected routes */}
          <Route element={<AdminRoute />}>
            <Route path="/admin/*" element={<AdminDashboard />} />
          </Route>

          {/* Fallback 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
};

export const App = () => {
  return (
    <ThemeProvider>
      <SettingsProvider>
        <AuthProvider>
          <CartProvider>
            <BrowserRouter>
              <ScrollToTop />
              <AppContent />
            </BrowserRouter>
          </CartProvider>
        </AuthProvider>
      </SettingsProvider>
    </ThemeProvider>
  );
};

export default App;
