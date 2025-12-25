import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Donors from "./pages/Donors";
import Profile from "./pages/Profile";
import BloodRequests from "./pages/BloodRequests";
import NotFound from "./pages/NotFound";
import Report from "./pages/Report";
import Chatbot from "./components/Chatbot/ChatbotIcons";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/donors" element={<Donors />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/report" element={<Report />} />
            <Route path="/requests" element={<BloodRequests />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Chatbot />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
