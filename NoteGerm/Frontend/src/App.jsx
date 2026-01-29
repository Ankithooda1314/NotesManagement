import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import './App.css'
import Navbar from './Component/Navbar'
import SignupLogin from './Component/SignupLogin'
import Slider from './Component/Slider/Slider'
import Dashboard from './Component/UserDashBoard/Dashboard'
import Notes from './Component/Notes/Notes'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Protected Route
const ProtectedRoute = () => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

const DashboardLayout = () => {
  return (
    <div className="h-screen overflow-hidden"> {/* ⭐ important */}
      <Navbar />
      <div className="flex h-[calc(100vh-56px)]"> {/* navbar height minus */}
        <Slider />
        <div className="flex-1 p-1 overflow-y-auto"> {/* only right content scroll */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};


function App() {
  return (
    <>
    <Router>
      <Routes>

        {/* Public */}
        <Route path="/login" element={<SignupLogin />} />

        {/* Protected */}
        <Route element={<ProtectedRoute />}>

          {/* Layout */}
          <Route path="/" element={<DashboardLayout />}>

            {/* Pages */}
            <Route path="dashboard" element={<Dashboard/>} />
            <Route path="notes" element={<Notes/>} />

          </Route>
        </Route>

        {/* Default */}
        <Route path="*" element={<Navigate to="/login" />} />

      </Routes>
    </Router>
    <ToastContainer position='top-right' autoClose={3000}/>
    </>
  );
}

export default App;
