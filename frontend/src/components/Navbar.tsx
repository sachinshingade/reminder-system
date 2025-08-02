import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { isLoggedIn, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="p-4 bg-blue-600 text-white flex justify-between">
      <h1 className="font-bold">Reminder App</h1>
      {isLoggedIn && <button onClick={handleLogout}>Logout</button>}
    </nav>
  );
}
