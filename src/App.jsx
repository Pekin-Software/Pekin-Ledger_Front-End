// import React, { useEffect, useState } from "react";
// import { Routes, Route, useNavigate } from "react-router-dom";
// import AdminDashboard from "./components/Admin Dashboard/admindashboard";
// import ManagerDashboard from "./components/Manager Dashboard/managerdashboard";
// import CashierDashboard from "./components/Cashier Dashboard/cashierdashboard";
// import LandingPage from "./components/landingpage";
// import "./App.css";
// import Authentication from "./components/Authentications/authentication";
// import Cookies from "js-cookie";
// import AppProviders from "./contexts/AppProviders";

// function App() {
//   const navigate = useNavigate();
//   const [userRole, setUserRole] = useState(Cookies.get("role") || null);
//   const [tenant, setTenant] = useState(Cookies.get("tenant") || null);
  
//   useEffect(() => {
//     const role = Cookies.get("role");
//     const tenant = Cookies.get("tenant");
//     setUserRole(role);
//     setTenant(tenant);
  
//     // If userRole exists, redirect to the appropriate dashboard
//     if (role === "Cashier") {
//       navigate("/point-of-sale");
//     } else if (role === "Manager") {
//       navigate("/store-inventory");
//     } else if (role === "Admin") {
//       navigate("/general-inventory");
//     } else {
//       navigate("/")
//     }

//   }, [navigate]);

  
//   return (
//    <AppProviders>
//      <div className="landing-container">
//       <Routes>
//         <Route path="/login" element={<Authentication defaultSignIn={true} navigate={useNavigate()} />} />
//         <Route path="/signup" element={<Authentication defaultSignIn={false} />} />

//         <Route path="/general-inventory" element={userRole === "Admin" ? <AdminDashboard /> : <Authentication defaultSignIn={true} />} />
//         <Route path="/store-inventory" element={userRole === "Manager" ? <ManagerDashboard /> : <Authentication defaultSignIn={true} />} />
//         <Route path="/point-of-sale" element={userRole === "Cashier" ? <CashierDashboard /> : <Authentication defaultSignIn={true} />} />
        
//         {/* Landing Page */}
//         <Route path="/" element={<LandingPage />}/>
//       </Routes>
//     </div>
//    </AppProviders>
//   );
// }

// export default App;

import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import AdminDashboard from "./components/Admin Dashboard/admindashboard";
import ManagerDashboard from "./components/Manager Dashboard/managerdashboard";
import CashierDashboard from "./components/Cashier Dashboard/cashierdashboard";
import LandingPage from "./components/landingpage";
import Authentication from "./components/Authentications/authentication";
import Cookies from "js-cookie";
import AppProviders from "./contexts/AppProviders";
import "./App.css";

function App() {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(Cookies.get("role") || null);
  const [tenant, setTenant] = useState(Cookies.get("tenant") || null);

  useEffect(() => {
    const role = Cookies.get("role");
    const tenant = Cookies.get("tenant");
    setUserRole(role);
    setTenant(tenant);

    // Navigate based on role only if role exists
    if (role) {
      switch (role) {
        case "Cashier":
          navigate("/point-of-sale");
          break;
        case "Manager":
          navigate("/store-inventory");
          break;
        case "Admin":
          navigate("/general-inventory");
          break;
        default:
          navigate("/");
      }
    }
  }, [navigate]);

  return (
    <AppProviders>
      <div className="landing-container">
        <Routes>
          <Route path="/login" element={<Authentication defaultSignIn={true} />} />
          <Route path="/signup" element={<Authentication defaultSignIn={false} />} />

          <Route
            path="/general-inventory"
            element={
              userRole === "Admin" ? <AdminDashboard /> : <Authentication defaultSignIn={true} />
            }
          />
          <Route
            path="/store-inventory"
            element={
              userRole === "Manager" ? <ManagerDashboard /> : <Authentication defaultSignIn={true} />
            }
          />
          <Route
            path="/point-of-sale"
            element={
              userRole === "Cashier" ? <CashierDashboard /> : <Authentication defaultSignIn={true} />
            }
          />

          {/* Landing Page */}
          <Route path="/" element={<LandingPage />} />
        </Routes>
      </div>
    </AppProviders>
  );
}

export default App;
