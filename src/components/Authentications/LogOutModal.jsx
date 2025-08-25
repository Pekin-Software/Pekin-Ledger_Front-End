import React from 'react';
import './authentication.css';
import { LogOut } from 'lucide-react';
import Cookies from "js-cookie";

import { useNavigate } from "react-router-dom";
const SignOutModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
 
const navigate = useNavigate();
    const handleLogout = async () => {

      try {
        const response = await fetch("https://pekingledger.store/api/auth/logout/", {
        // const response = await fetch("http://client1.localhost:8000/api/auth/logout/", {
          method: "POST",
          credentials: "include", 
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          console.error("Logout failed:", errorData.detail || "Unknown error");
          return;
        }
  
        // ✅ Clear any client-side cookies (whether or not backend does)
        Cookies.remove("access_token", { path: "/" });
         Cookies.remove("role", { path: "/" });

          ["user", "store_id", "exchange_rate", "business_name", "tenant", "role"]
        .forEach(key => localStorage.removeItem(key));

  
        // ✅ Navigate to login
        navigate("/");
  
        } catch (error) {
          console.error("Logout error:", error);
        }
    };

  return (
    <div className="logout-overlay">
      <div className="logout-modal" onClick={(e) => e.stopPropagation()}>
        <LogOut className="modal-icon" />
        <p className="modal-text">Are you sure you want to sign out?</p>
        <div className="modal-buttons">
          <button className="btn no-btn" onClick={onClose}>No</button>
          <button className="btn yes-btn" onClick={handleLogout}>Yes</button>
        </div>
      </div>
    </div>
  );
};

export default SignOutModal;
