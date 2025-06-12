import React, { useState, useEffect } from "react";
import "./storeDetails.css";
import StaffListModal from "./StaffModal";
import StaffCard from "./StaffCard";
import { useApi } from "../../../../ApiContext";

export default function StoreStaff({storeID}) {
  const { fetchStoreStaff, StoreStaff: storeStaffList } = useApi();
  const [staffList, setStaffList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [availableUsers, setAvailableUsers] = useState([])

  useEffect(() => {
    if (storeId) {
      fetchStoreStaff(storeId);
    }
  }, [storeId]);

  const handleAddStaffClick = () => {
    setShowModal(true);
  };

  const handleAddStaff = (user) => {
    setStaffList((prev) => [...prev, user]);
    setAvailableUsers((prev) => prev.filter((u) => u.id !== user.id));
    setShowModal(false);
  };

  const handleChangePosition = (staff) => {
    const updatedList = staffList.map((s) =>
      s.id === staff.id ? { ...s, position: "Updated Position" } : s
    );
    setStaffList(updatedList);
  };

  const handleDelete = (staff) => {
    const filteredList = staffList.filter((s) => s.id !== staff.id);
    setStaffList(filteredList);
  };

  return (
    <div className="store-staff-container">
      <div className="staff-header">
        <h2>
          {staffList.length > 0
            ? "Manage Staff Assigned to this Store"
            : "No Staff Assigned"}
        </h2>
        <button className="add-staff-btn" onClick={handleAddStaffClick}>
          Add Staff
        </button>
      </div>

      <div className="staff-list">
        {storeStaffList.map((staff, index) => (
          <StaffCard
            key={index}
            staff={{
              id: index,
              name: `${staff.first_name} ${staff.last_name}`,
              address: staff.address,
              contact: staff.email,
              position: staff.position,
              phone: `${staff.phone1}${staff.phone2 ? ` / ${staff.phone2}` : ""}`,
            }}
            mode="view"
            onChangePosition={handleChangePosition}
            onDelete={handleDelete}
          />
        ))}
      </div>
      
      {showModal && (
        <StaffListModal
          users={availableUsers}
          onAddStaff={handleAddStaff}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
