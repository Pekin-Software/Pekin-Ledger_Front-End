import { useState, useEffect } from "react";
import { useApi } from "../../../contexts/ApiContext";
import StoreProfile from "./storeProfile";
import "./store.css";
import StoreDetails from "./Store Details/storeDetails";

// === Mock Store Data (local only) ===
// const initialMockStores = [
//   {
//     id: 1,
//     store_name: "Downtown Market",
//     address: "123 Main St",
//     city: "Metropolis",
//     country: "USA",
//     phone_number: "555-1234",
//     managerName: "John Doe",
//     managerContact: "john@example.com",
//   },
//   {
//     id: 2,
//     store_name: "Uptown Mart",
//     address: "456 High St",
//     city: "Gotham",
//     country: "USA",
//     phone_number: "555-5678",
//     managerName: "Jane Smith",
//     managerContact: "jane@example.com",
//   },
// ];

function StoreCard({ store, onEdit, onViewDetails }) {
  return (
    <div className="store-card" onClick={() => onViewDetails(store)}>
      <div className="store-name">{store.store_name}</div>
      <div className="store-details">
        <p>{store.address}</p>
        <p>{store.city}, {store.country}</p>
        <p>{store.phone_number}</p>
        <p><strong>Manager:</strong> {store.managerName}</p>
        <p><strong>Manager Contact:</strong> {store.managerContact}</p>

        <button className="edit-button"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(store);
          }}>
            Edit
        </button>
      </div>
    </div>
  );
}

export default function Stores() {
  const [viewingStore, setViewingStore] = useState(null);
  const { storeData, fetchStores, addStore, updateStore } = useApi();
  const [selectedStore, setSelectedStore] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  // design
  // const [storeData, setStoreData] = useState(initialMockStores);

  useEffect(() => {
    fetchStores();
  }, []);

  const handleAddStore = () => {
    setSelectedStore(null);
    setShowProfile(true);
  };

  const handleEditStore = (store) => {
    setSelectedStore(store);
    setShowProfile(true);
  };

  const handleCloseProfile = () => {
    setShowProfile(false);
  };

  const handleSaveStore = async (storeData) => {
    if (selectedStore) {
      await updateStore(selectedStore.id, storeData);
    } else {
      await addStore(storeData);
    }
    setShowProfile(false);
  };

  return (
     viewingStore ? (
    <StoreDetails
      store={viewingStore} onClose={() => setViewingStore(null)}
    />
  ) : (
    <div className="store-container">
      <div className="store-header">
        <h2>Manage Stores</h2>
        <button className="add-store" onClick={handleAddStore}>Add Store</button>
      </div>
      <div className="store-list scrollable">
        {storeData && storeData.length > 0 ? (
          storeData.map((store) => (
            <StoreCard 
              key={store.id} 
              store={store} 
              onEdit={handleEditStore} 
              onViewDetails={(store) => setViewingStore(store)} 
            />
          ))
        ) : (
          <p className="no-stores-message">No stores yet. Click "Add Store" to create one.</p>
        )}
      </div>
      {showProfile && (
        <StoreProfile
          store={selectedStore}
          onClose={handleCloseProfile}
          onSave={handleSaveStore}
        />
      )}
    </div>
  )

  );
}
