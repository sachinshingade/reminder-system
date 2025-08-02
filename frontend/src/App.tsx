import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Reminders from "./pages/Reminders";
import { Toaster } from "react-hot-toast";

export default function App() {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <>
      <Toaster />
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route
            path="/login"
            element={!isLoggedIn ? <Login /> : <Navigate to="/" />}
          />
          <Route
            path="/register"
            element={!isLoggedIn ? <Register /> : <Navigate to="/" />}
          />
          <Route
            path="/"
            element={isLoggedIn ? <Reminders /> : <Navigate to="/login" />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}
