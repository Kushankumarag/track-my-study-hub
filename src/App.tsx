
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import DataEntry from "./pages/DataEntry";
import Analysis from "./pages/Analysis";
import Insights from "./pages/Insights";
import PeerComparison from "./pages/PeerComparison";
import WeeklyPlanner from "./pages/WeeklyPlanner";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/data-entry" element={<DataEntry />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/peer-comparison" element={<PeerComparison />} />
          <Route path="/weekly-planner" element={<WeeklyPlanner />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
