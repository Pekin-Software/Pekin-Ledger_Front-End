import React from "react";
import './storeDetails.css'
import StaffCard from "./StaffCard";

export default function StaffListModal({ users, onAddStaff, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="staff-modal">
        <div className="modal-header">
          <h2>Staff List</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="staff-content">
          {users.length > 0 ? (
            users.map((user) => (
              <StaffCard 
                key={user.id} 
                staff={user}
                mode="add"
                onAdd={onAddStaff} />
            ))
          ) : (
            <p>No available staff to assign.</p>
          )}
        </div>
      </div>
    </div>
  );
}
