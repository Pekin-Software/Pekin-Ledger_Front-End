import { useState, useEffect } from "react";
import "./staff.css"
import { SignUpForm } from "../../Authentications/authentication";
import { useNavigate } from "react-router-dom";
import StaffCard from "./StaffCard";
import Cookies from "js-cookie";
import { X } from "lucide-react";
import { useApi } from "../../../contexts/ApiContext";

export default function ManageStaff() {

  const { subaccounts, fetchSubaccounts } = useApi();
    const navigate = useNavigate();
    const [showAddUserForm, setShowAddUserForm] = useState(false);
    const tenantDomain = localStorage.getItem("tenant");
    // const accessToken = Cookies.get("access_token");

    useEffect(() => {
      fetchSubaccounts();
    }, []);

    const handleAddUser = () => {
      setShowAddUserForm(true);
    };

    const handleCreateStaff = async (formData) => {
      const apiUrl = `https://${tenantDomain}.pekingledger.store/api/users/add_users/`;
      //  const apiUrl = `http://${tenantDomain}:8000/api/users/add_users/`;
      try {
          const response = await fetch(apiUrl, {
          method: "POST",
          headers: { 
              "Content-Type": "application/json",
              "Authorization": `Bearer ${accessToken}`, 
          },
          body: JSON.stringify(formData),
          });

          if (!response.ok) {
          const errorData = await response.json();
          console.error("Staff creation failed:", errorData);
          return;
          }

          const result = await response.json();
          console.log("Staff created:", result);
          setShowAddUserForm(false);
           await fetchSubaccounts();
      } catch (error) {
          console.error("Error creating staff:", error);
      }
    };

  return (
    <div className="staff-dashboard">
      <div className="ctrl">
        <h2>Manage Stores</h2>
        <button className="add-user" onClick={handleAddUser}>Add User</button>
      </div>
     
      <div className="staff-grid-list">
        {subaccounts.map((staff) => (
              <StaffCard
                key={staff.id}
                staff={staff}
                mode="view"
                // onAdd={handleAdd}
                // onChangePosition={handleChangePosition}
                // onDelete={handleDelete}
              />
        ))}
      </div>
      
      {showAddUserForm && (
          <div className="staff-modal-overlay">
              <div className="staff-modal-content">
              <button className="close-button" onClick={() => setShowAddUserForm(false)}><X size={20}/></button>
              <SignUpForm
                  navigate={navigate}
                  title={null}
                  subtitle={null}
                  showLoginLink={false}
                  usePositionInsteadOfBusinessName={true}
                  submitButtonText="Add User"
                  onSubmit={handleCreateStaff}
                  onSuccess={() => {
                  setShowAddUserForm(false);
                  }}
              />
              </div>
          </div>
      )}
    </div>
  );
}
