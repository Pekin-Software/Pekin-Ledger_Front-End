import { useState } from "react";
import "./staff.css"
import { SignUpForm } from "../../Authentications/authentication";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { X } from "lucide-react";

function StoreCard({ store, onEdit }) {
  return (
    <div className="store-card">
      <div className="store-name">{store.name}</div>
      <div className="store-details">
        <p>{store.address}</p>
        <p>{store.city}, {store.country}</p>
        <p>{store.contact}</p>
        <p><strong>Manager:</strong> {store.managerName}</p>
        <p><strong>Manager Contact:</strong> {store.managerContact}</p>
        <button className="edit-button" onClick={() => onEdit(store)}>Edit</button>
      </div>
    </div>
  );
}

export default function ManageStaff() {
    const navigate = useNavigate();
    const [showAddUserForm, setShowAddUserForm] = useState(false);
     const tenantDomain = Cookies.get("tenant");
    const accessToken = Cookies.get("access_token");
    console.log(tenantDomain)
    const [stores] = useState([
        { name: "Store A", address: "123 Main St", city: "Paynesville City", country: "Liberia", contact: "+231-770-123-456", managerName: "John Doe", managerContact: "987-654-3210" },
    ]);

    const [selectedStore, setSelectedStore] = useState(null);
    const [showProfile, setShowProfile] = useState(false);

    const handleAddStore = () => {
        setShowAddUserForm(true);
    };

    const handleCreateStaff = async (formData) => {
   
    const apiUrl = `https://${tenantDomain}.pekingledger.store/api/users/add_users/`;
    
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
    } catch (error) {
        console.error("Error creating staff:", error);
    }
    };


    const handleEditStore = (store) => {
        setSelectedStore(store);
        setShowProfile(true);
    };

    const handleCloseProfile = () => {
        setShowProfile(false);
    };

    const handleSaveStore = (storeData) => {
        
    };

  return (
    <div className="store-container">
      <div className="store-header">
        <h2>Manage Stores</h2>
        <button className="add-user" onClick={handleAddStore}>Add User</button>
      </div>
      <div className="store-list scrollable">
        {stores.map((store, index) => (
          <StoreCard key={index} store={store} onEdit={handleEditStore} />
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

      {showProfile && <StoreProfile store={selectedStore} onClose={handleCloseProfile} onSave={handleSaveStore} />}
    </div>
    
  );
}
