import { Route, Routes } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { Toaster } from "./components/ui/toaster";
import { ThemeProvider } from "next-themes";
import PresentationEditor from "./pages/PresentationEditor";

function App() {
  return (
    <ThemeProvider 
      attribute="class" 
      defaultTheme="dark" 
      enableSystem
    >
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/presentation" element={<PresentationEditor />} />
        <Route path="/presentation/:id" element={<PresentationEditor />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
