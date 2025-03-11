import { Suspense, useState, useEffect } from "react";
import {
  useRoutes,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import Home from "./components/home";
import Login from "./components/auth/login";
import routes from "tempo-routes";

function App() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check if user is already authenticated in localStorage
    return localStorage.getItem("isAuthenticated") === "true";
  });

  // Update localStorage when authentication state changes
  useEffect(() => {
    localStorage.setItem("isAuthenticated", isAuthenticated.toString());
  }, [isAuthenticated]);

  const handleLogin = (email: string, password: string) => {
    // In a real app, this would validate credentials with a backend
    console.log("Login attempt with:", email, password);
    setIsAuthenticated(true);
    navigate("/");
  };

  const handleSocialLogin = (provider: string) => {
    // In a real app, this would redirect to the OAuth provider
    console.log(`Social login with ${provider}`);
    setIsAuthenticated(true);
    navigate("/");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? <Home /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/" replace />
              ) : (
                <Login
                  onLogin={handleLogin}
                  onSocialLogin={handleSocialLogin}
                />
              )
            }
          />
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </>
    </Suspense>
  );
}

export default App;
