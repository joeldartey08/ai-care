import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectRoute from "./components/ProtectRoute";
import Dashboard from "./pages/authenticated/Dashboard";

function App() {
  return (
    <Routes>
      {/* <Route path="/" index element={<Landing />} /> */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      {/* <Route element={<ProtectRoute role={"user"}>}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route> */}

      <Route path="/dashboard" element={<ProtectRoute />}>
        <Route index element={<Dashboard />} />
        <Route path=":sessionId" element={<Dashboard />} />
      </Route>
    </Routes>
  );
}

export default App;
