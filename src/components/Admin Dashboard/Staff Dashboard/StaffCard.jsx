
import "./staffCard.css";
import { User } from "lucide-react";

export default function StaffCard({ staff, mode, onAdd, onChangePosition, onDelete }) {

  return (
    <div className="staff-card">
      <div className="data">
        <div className="staff-img">
        {staff.image ? (
          <img 
            src={staff.image} 
            alt={`${staff.first_name} ${staff.last_name}`} 
            className="staff-photo"
          />
        ) : (
          <User size={80} strokeWidth={1.5} className="user-icon"/>
        )}
      </div>

      <div className="staff-info">
        <p className="staff-name">{staff.first_name} {staff.last_name}</p>
        <p className="staff-role">{staff.position}</p>
        <p className="staff-contact">{staff.address}, {staff.city}</p>
        <p className="staff-contact"> {staff.email}</p>
        <p className="staff-contact">{staff.phone1}</p>
  
      </div>

       
      </div>
       <div className="staff-actions">
                  {mode === "add" && (
          <button onClick={() => onAdd(staff)}>Assign Staff</button>
        )}

        {mode === "view" && (
          <>
            <button onClick={() => onChangePosition(staff)}>Change Position</button>
            <button className="delete-btn" onClick={() => onDelete(staff)}>Delete</button>
          </>
        )}

        {mode === "remove" && (
          <>
            <button onClick={() => onChangePosition(staff)}>Change Position</button>
            <button className="delete-btn" onClick={() => onDelete(staff)}>Remove Staff</button>
          </>
        )}
        </div>
    </div>
  );
}
