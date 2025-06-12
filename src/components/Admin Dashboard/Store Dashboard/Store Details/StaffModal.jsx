import React from "react";
import './storeDetails.css'
import StaffCard from "./StaffCard";
import { useApi } from "../../../../ApiContext";

export default function StaffListModal({ onAddStaff, onClose }) {
    const { fetchUnassignedStaff, UnassignedStaff } = useApi();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
        setLoading(true);
        await fetchUnassignedStaff();
        setLoading(false);
        };

        loadData();
    }, []);

  return (
    <div className="modal-overlay">
      <div className="staff-modal">
        <div className="modal-header">
          <h2>Staff List</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="staff-content">
          {loading ? (
            <p>Loading staff...</p>
          ) : UnassignedStaff.length > 0 ? (
            UnassignedStaff.map((user) => (
              <StaffCard 
                key={user.id || user.email} 
                staff={user}
                mode="add"
                onAdd={onAddStaff}
              />
            ))
          ) : (
            <p>No available staff to assign.</p>
          )}
        </div>
      </div>
    </div>
  );
}
