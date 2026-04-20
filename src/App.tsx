import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";

// Local Components & Providers
import ArtPlayground from "@/components/ArtPlayground";
import LearningGoals from "@/components/LearningGoals";
import Meeting from "@/components/Meeting";
import Projects from "@/components/Projects";
import Profile from "@/components/Profile";
import ProtectedRoute from "@/components/ProtectedRoute";
import ReadingLog from "@/components/ReadingLog";
import RecipeIdeas from "@/components/RecipeIdeas";
import ThemeProvider from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

// Page components
import LandingPage from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import Signup from "@/components/Signup";
import Homepage from "./HomePage"
import ArchivePage from "./pages/ArchivePage";
import InboxPage from "../InboxPage";
import GenericNotePage from "../GenericNotePage";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            {/* Auth Routes */}
            <Route path="/signup" element={<Signup />} />
            {/* Note-taking Routes (pointing to Dashboard as placeholders) */}
            <Route path="/homepage" element={<ProtectedRoute><Homepage /></ProtectedRoute>} />
            <Route path="/archive" element={<ProtectedRoute><ArchivePage /></ProtectedRoute>} />
            <Route path="/inbox" element={<ProtectedRoute><InboxPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/note/:id" element={<GenericNotePage />} />
            <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
            <Route path="/projects/:searchterm" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
            <Route path="/meeting" element={<ProtectedRoute><Meeting /></ProtectedRoute>} />
            <Route path="/meeting/:searchterm" element={<ProtectedRoute><Meeting /></ProtectedRoute>} />
            <Route path="/learning-goals" element={<ProtectedRoute><LearningGoals /></ProtectedRoute>} />
            <Route path="/learning-goals/:searchterm" element={<ProtectedRoute><LearningGoals /></ProtectedRoute>} />
            <Route path="/reading-log" element={<ProtectedRoute><ReadingLog /></ProtectedRoute>} />
            <Route path="/reading-log/:searchterm" element={<ProtectedRoute><ReadingLog /></ProtectedRoute>} />
            <Route path="/recipe-ideas" element={<ProtectedRoute><RecipeIdeas /></ProtectedRoute>} />
            <Route path="/recipe-ideas/:searchterm" element={<ProtectedRoute><RecipeIdeas /></ProtectedRoute>} />
            <Route path="/art-playground" element={<ProtectedRoute><ArtPlayground /></ProtectedRoute>} />
            <Route path="/art-playground/:searchterm" element={<ProtectedRoute><ArtPlayground /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
