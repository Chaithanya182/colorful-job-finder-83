
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { JobProvider } from "./context/JobContext";
import Index from "./pages/Index";
import JobDetail from "./pages/JobDetail";
import JobApplication from "./pages/JobApplication";
import IndeedJobSearch from "./pages/IndeedJobSearch";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <JobProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/job/:id" element={<JobDetail />} />
            <Route path="/job/:id/apply" element={<JobApplication />} />
            <Route path="/indeed-jobs" element={<IndeedJobSearch />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </JobProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
