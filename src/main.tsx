import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import App from './App.tsx';
import { ThemeProvider } from "./components/theme-provider";
import { AuthProvider } from './contexts/auth-context.tsx';
import { Toaster } from "@/components/ui/sonner"
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider defaultTheme="dark" storageKey="insightshare-theme">
        <AuthProvider>
          <App />
          <Toaster richColors />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
);
