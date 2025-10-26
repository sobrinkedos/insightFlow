import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Header } from "./components/layout/header";
import { BottomNav } from "./components/layout/bottom-nav";
import { QueueProcessor } from "./components/queue-processor";
import { HomePage } from "./pages/home";
import { ThemesPage } from "./pages/themes";
import { VideosPage } from "./pages/videos";
import { LoginPage } from "./pages/login";
import { SignupPage } from "./pages/signup";
import { ExtensionsPage } from "./pages/extensions";
import { ProtectedRoute } from "./components/protected-route";
import { ThemeDetailPage } from "./pages/theme-detail";
import { VideoDetailPage } from "./pages/video-detail";
import { SharePage } from "./pages/share";
import { FavoritesPage } from "./pages/favorites";
import SearchPage from "./pages/search";
import { ProfilePage } from "./pages/profile";
import { SettingsPage } from "./pages/settings";
import { ForgotPasswordPage } from "./pages/forgot-password";
import { ResetPasswordPage } from "./pages/reset-password";
import { useOrientationLock } from "./hooks/use-orientation-lock";

function App() {
  const location = useLocation();
  
  // Bloquear orientação em portrait no PWA (exceto quando em fullscreen)
  useOrientationLock();

  return (
    <div className="relative flex min-h-screen w-full max-w-full flex-col bg-transparent font-sans overflow-x-hidden">
      <QueueProcessor />
      <Header />
      <main className="flex-1 w-full max-w-full overflow-x-hidden pb-16 md:pb-0 pt-[56px] md:pt-[96px]">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/extensions" element={<ExtensionsPage />} />
            <Route path="/share" element={<SharePage />} />
            
            <Route element={<ProtectedRoute />}>
              <Route path="/themes" element={<ThemesPage />} />
              <Route path="/themes/:id" element={<ThemeDetailPage />} />
              <Route path="/videos" element={<VideosPage />} />
              <Route path="/videos/:id" element={<VideoDetailPage />} />
              <Route path="/video/:id" element={<VideoDetailPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
          </Routes>
        </AnimatePresence>
      </main>
      <BottomNav />
    </div>
  );
}

export default App;
