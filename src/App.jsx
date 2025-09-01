import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Login from "./pages/Login";
import Test from "./test";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import ProtectedRoute from "./ui/ProtectedRoute";
import AppLayout from "./ui/AppLayout";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
import Settings from "./pages/Settings";
import CheckUsername from "./ui/CheckUsername";
import SetUserName from "./pages/SetUserName";
import SearchPage from "./pages/SearchPage";
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
    },
  },
});
function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route
              element={
                <ProtectedRoute>
                  <CheckUsername>
                    <AppLayout />
                  </CheckUsername>
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate replace to="/home" />} />
              <Route path="home" element={<Test />} />
              <Route path="search" element={<SearchPage />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            <Route path="login" element={<Login />} />
            <Route path="setusername" element={<SetUserName />} />

            {/* <Route path="*" element={<PageNotFound />} /> */}
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
