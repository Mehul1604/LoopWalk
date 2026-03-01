import { RouterProvider } from "react-router";
import { router } from "./routes";

export default function App() {
  return (
    <RouterProvider 
      router={router} 
      fallbackElement={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      }
    />
  );
}