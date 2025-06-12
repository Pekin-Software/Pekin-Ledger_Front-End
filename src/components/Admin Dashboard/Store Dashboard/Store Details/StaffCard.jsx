import React from "react";
import "./storeDetails.css";

export default function StaffCard({ staff, mode, onAdd, onChangePosition, onDelete }) {
  return (
    <div className="staff-card">
      <div className="staff-img">
        {/* Optional: Add image or avatar here */}
      </div>

      <div className="staff-info">
        <div className="staff-actions">
          <div>
            <p className="staff-name">{staff.name}</p>
            <p className="staff-name">Last Name</p>
          </div>

          {mode === "add" && (
            <div className="btn">
              <button onClick={() => onAdd(staff)}>Add Staff</button>
            </div>
          )}
        </div>

        <div className="data">
          <div>
            <p>Address:</p>
            <p>Email:</p>
            <p>Position:</p>
            <p>Contact:</p>
          </div>
          <div>
            <p>{staff.address}</p>
            <p>{staff.contact}</p>
            <p>{staff.phone}</p>
            <p>{staff.position}</p>
          </div>
        </div>

        {mode === "view" && (
          <div className="staff-actions">
            <button onClick={() => onChangePosition(staff)}>Change Position</button>
            <button className="delete-btn" onClick={() => onDelete(staff)}>Delete</button>
          </div>
        )}
      </div>
    </div>
  );
}
