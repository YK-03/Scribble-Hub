import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";

// Local Components & Providers
import ArtPlayground from "@/components/ArtPlayground";
import LearningGoals from "@/components/LearningGoals";
import Meeting from "@/components/Meeting";
import Projects from "@/components/Projects";
import ReadingLog from "@/components/ReadingLog";
import RecipeIdeas from "@/components/RecipeIdeas";
import ThemeProvider from "@/components/ThemeProvider";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

const noteCategories = [
  { title: "Projects", description: "Organize your project ideas and tasks.", link: "/projects" },
  { title: "Meeting Notes", description: "Keep track of all your meeting minutes.", link: "/meeting" },
  { title: "Learning Goals", description: "Set and track your learning objectives.", link: "/learning-goals" },
  { title: "Reading Log", description: "Log the books and articles you've read.", link: "/reading-log" },
  { title: "Recipe Ideas", description: "Save and generate new recipe ideas.", link: "/recipe-ideas" },
  { title: "Art Playground", description: "A space to scribble and be creative.", link: "/art-playground" },
];

const DashboardGrid = () => (
  <main className="container mx-auto px-6 py-8">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {noteCategories.map((note) => (
        <Link to={note.link} key={note.link} className="no-underline">
          <Card className="h-full hover:border-primary transition-colors duration-200 ease-in-out">
            <CardHeader>
              <CardTitle className="text-lg">{note.title}</CardTitle>
              <CardDescription>{note.description}</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      ))}
    </div>
  </main>
);


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
            <Route path="/homepage" element={<Homepage />} />
            <Route path="/archive" element={<ArchivePage />} />
            <Route path="/inbox" element={<InboxPage />} />
            <Route path="/note/:id" element={<GenericNotePage />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:searchterm" element={<Projects />} />
            <Route path="/meeting" element={<Meeting />} />
            <Route path="/meeting/:searchterm" element={<Meeting />} />
            <Route path="/learning-goals" element={<LearningGoals />} />
            <Route path="/learning-goals/:searchterm" element={<LearningGoals />} />
            <Route path="/reading-log" element={<ReadingLog />} />
            <Route path="/reading-log/:searchterm" element={<ReadingLog />} />
            <Route path="/recipe-ideas" element={<RecipeIdeas />} />
            <Route path="/recipe-ideas/:searchterm" element={<RecipeIdeas />} />
            <Route path="/art-playground" element={<ArtPlayground />} />
            <Route path="/art-playground/:searchterm" element={<ArtPlayground />} />
            <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
