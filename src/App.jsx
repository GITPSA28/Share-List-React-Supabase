import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Login from "./pages/Login";
import Test from "./Test";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import ProtectedRoute from "./ui/ProtectedRoute";
import AppLayout from "./ui/AppLayout";
import { ThemeProvider } from "./contexts/ThemeContext";
import Settings from "./pages/Settings";
import CheckUsername from "./ui/CheckUsername";
import SetUserName from "./pages/SetUserName";
import SearchPage from "./pages/SearchPage";
import Friends from "./pages/Friends";
import Profile from "./pages/Profile";
import NotificationPage from "./pages/NotificationPage";
import { SessionProvider } from "./contexts/SessionContext";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import ListPage from "./pages/ListPage";
import MoviePage from "./pages/MoviePage";
import { Toaster } from "react-hot-toast";
import TvPage from "./pages/TVPage";
import RecommendationsPage from "./pages/RecommendationsPage";
import ScrollToTop from "./ui/ScrollToTop";
import MyLists from "./pages/MyLists";
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
          <SessionProvider>
            <ScrollToTop />
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
                <Route path="friends" element={<Friends />} />
                <Route path="notifications" element={<NotificationPage />} />
                <Route
                  path="recommendations"
                  element={<RecommendationsPage />}
                />
                <Route path="profile/:username" element={<Profile />} />
                <Route path="list/:listid" element={<ListPage />} />
                <Route path="movie/:movieid" element={<MoviePage />} />
                <Route path="tv/:tvid" element={<TvPage />} />
                <Route path="settings" element={<Settings />} />
                <Route path="mylists" element={<MyLists />} />
                {/* <Route path="myrecommendations" element={<MyLists />} />*/}
              </Route>
              <Route path="login" element={<Login />} />
              <Route path="setusername" element={<SetUserName />} />

              {/* <Route path="*" element={<PageNotFound />} /> */}
            </Routes>
          </SessionProvider>
        </BrowserRouter>
        <ReactQueryDevtools initialIsOpen={false} />
        <Toaster
          position="top-center"
          gutter={12}
          containerStyle={{ margin: "8px" }}
          toastOptions={{
            success: {
              duration: 3000,
            },
            error: {
              duration: 5000,
            },
            style: {
              fontSize: "16px",
              maxWidth: "500px",
              backgroundColor: "var(--color-neutral)",
              color: "var(--color-neutral-content)",
            },
          }}
        />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
