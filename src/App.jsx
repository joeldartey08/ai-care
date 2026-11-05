import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectRoute from "./components/ProtectRoute";
import Chat from "./pages/authenticated/Chat";
import Dashboard from "./pages/authenticated/Dashboard";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectRoute>
              <Dashboard />
            </ProtectRoute>
          }
        />
        <Route
          path="/chat/:sectionId"
          element={
            <ProtectRoute>
              <Chat />
            </ProtectRoute>
          }
        />
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
