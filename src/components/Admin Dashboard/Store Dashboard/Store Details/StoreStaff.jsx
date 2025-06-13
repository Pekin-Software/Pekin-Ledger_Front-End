import React, { useState, useEffect } from "react";
import "./storeDetails.css";
import StaffListModal from "./StaffModal";
import StaffCard from "./StaffCard";
import { useApi } from "../../../../ApiContext";
import Cookies from "js-cookie";

export default function StoreStaff({ storeID }) {
  const { fetchStoreStaff, StoreStaff: storeStaffList } = useApi();
  const [staffList, setStaffList] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (storeID) {
      fetchStoreStaff(storeID);
    }
  }, [storeID]);

  useEffect(() => {
  if (storeStaffList) {
  }
}, [storeStaffList]);

  const handleAddStaffClick = () => {
    setShowModal(true);
  };

  const handleAddStaff = async (user) => {
    try {
      const tenantDomain = Cookies.get("tenant"); 
      const accessToken = Cookies.get("access_token");
      const response = await fetch(`https://${tenantDomain}.pekingledger.store/api/store/${storeID}/add-staff/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`, // from your context
        },
        body: JSON.stringify({ username: user.username }),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        console.error("Failed to add staff, server response:", errorResponse);
        throw new Error(`Error: ${errorResponse?.detail || response.statusText}`);
      }

      // Optionally get updated staff data from the response
      const addedStaff = await response.json();

      // Update UI
      await fetchStoreStaff(storeID);
      setShowModal(false);

      console.log("Successfully added staff:", addedStaff);
    } catch (error) {
      console.error("Error adding staff:", error);
      alert("Failed to assign staff to store.");
    }
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
          {storeStaffList.length > 0
            ? "Manage Staff Assigned to this Store"
            : "No Staff Assigned"}
        </h2>
        <button className="add-staff-btn" onClick={handleAddStaffClick}>
          Add Staff
        </button>
      </div>

      <div className="staff-list">
        {storeStaffList.map((staff) => (
          <StaffCard
            key={staff.email}
            staff={staff}
            mode="view"
            onChangePosition={handleChangePosition}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {showModal && (
        <StaffListModal
          onAddStaff={handleAddStaff}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
