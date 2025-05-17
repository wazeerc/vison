import React from 'react';
import SharedData from './pages/SharedData';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Index from './pages/Index';
import NotFound from './pages/NotFound';

// Create a client for react-query
const queryClient = new QueryClient();

// Optional: Remove the lovable-badge element if it exists
document.getElementById('lovable-badge')?.remove();

const App = () => (
  // Provide the query client to the application
  <QueryClientProvider client={queryClient}>
    {/* Provide tooltip context */}
    <TooltipProvider>
      {/* Render Toaster components */}
      <Toaster />
      <Sonner />
      {/* Set up client-side routing */}
      <BrowserRouter>
        {/* Define the application routes */}
        <Routes>
          {/* Route for the homepage */}
          <Route path="/" element={<Index />} />
          {/* Route for shared data with a dynamic shareId parameter */}
          <Route path="/shared/:shareId" element={<SharedData />} /> {/* Corrected closing tag */}
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          {/* Catch-all route for any path not matched above */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
