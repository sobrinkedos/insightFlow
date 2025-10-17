import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Header } from "./components/layout/header";
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

function App() {
  const location = useLocation();

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-transparent font-sans">
      <Header />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/extensions" element={<ExtensionsPage />} />
            <Route path="/share" element={<SharePage />} />
            
            <Route element={<ProtectedRoute />}>
              <Route path="/themes" element={<ThemesPage />} />
              <Route path="/themes/:id" element={<ThemeDetailPage />} />
              <Route path="/videos" element={<VideosPage />} />
              <Route path="/videos/:id" element={<VideoDetailPage />} />
            </Route>
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
