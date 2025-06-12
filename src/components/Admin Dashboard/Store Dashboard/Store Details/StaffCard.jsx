import React from "react";
import "./storeDetails.css";

// export default function StaffCard({ staff, mode, onAdd, onChangePosition, onDelete }) {
//   return (
//     <div className="staff-card">
//       <div className="staff-img">
//         {/* Optional: Add image or avatar here */}
//       </div>

//       <div className="staff-info">
//         <div className="staff-actions">
//           <div>
//             <p className="staff-name">{staff.name}</p>
//             <p className="staff-name">Last Name</p>
//           </div>

//           {mode === "add" && (
//             <div className="btn">
//               <button onClick={() => onAdd(staff)}>Add Staff</button>
//             </div>
//           )}
//         </div>

//         <div className="data">
//           <div>
//             <p>Address:</p>
//             <p>Email:</p>
//             <p>Position:</p>
//             <p>Contact:</p>
//           </div>
//           <div>
//             <p>{staff.address}</p>
//             <p>{staff.contact}</p>
//             <p>{staff.phone}</p>
//             <p>{staff.position}</p>
//           </div>
//         </div>

//         {mode === "view" && (
//           <div className="staff-actions">
//             <button onClick={() => onChangePosition(staff)}>Change Position</button>
//             <button className="delete-btn" onClick={() => onDelete(staff)}>Delete</button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

export default function StaffCard({ staff, mode, onAdd, onChangePosition, onDelete }) {
  return (
    <div className="staff-card">
      <div className="staff-img">
        {/* Placeholder for staff photo if available */}
      </div>

      <div className="staff-info">
        <div className="staff-actions">
          <div>
            <p className="staff-name">{staff.first_name} {staff.last_name}</p>
            <p className="staff-role">{staff.position}</p>
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
            <p>City:</p>
            <p>Email:</p>
            <p>Phone 1:</p>
            <p>Phone 2:</p>
            <p>Position:</p>
          </div>
          <div>
            <p>{staff.address}</p>
            <p>{staff.city}</p>
            <p>{staff.email}</p>
            <p>{staff.phone1}</p>
            <p>{staff.phone2}</p>
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
