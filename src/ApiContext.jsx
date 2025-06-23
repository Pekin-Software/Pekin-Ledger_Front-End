import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie"; // Ensure this package is installed

// Create Context
const ApiContext = createContext();

// Provider Component
export const ApiProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState(null);
  const [products, setProducts] = useState([]);
  const [storeData, setStoreData] = useState([]);
  const [subaccounts, setSubaccounts] = useState([]);
  const [StoreStaff, setStoreStaff] = useState([]);
  const [UnassignedStaff, setUnassignedStaff] = useState([]);

  const [tenantDomain, setTenantDomain] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    setTenantDomain(Cookies.get("tenant"));
    setAccessToken(Cookies.get("access_token"));
  }, []);

  const getAuthHeaders = (isJson = true) => ({
  ...(isJson && { "Content-Type": "application/json" }),
  Authorization: `Bearer ${accessToken}`,
  });


  const apiBase = `https://${tenantDomain}.pekingledger.store/api`;
  const categoriesUrl = `${apiBase}/categories/`;
  const productsUrl = `${apiBase}/products/`;
  const storesUrl = `${apiBase}/store/`;

  // Fetch all subaccounts (excluding Admins)
  const fetchSubaccounts = async () => {
    try {
      const response = await fetch(`${apiBase}/users/staff/`, {
        method: "GET",
        headers: getAuthHeaders()
      });

      const raw = await response.text();
      if (!response.ok) throw new Error("Failed to fetch subaccounts");
      const data = JSON.parse(raw);
      setSubaccounts(data);
    } catch (error) {
      console.error("Error fetching subaccounts:", error);
    }
  };

  // Fetch staff assigned to a specific store (based on store ID)
  const fetchStoreStaff = async (storeId) => {
    try {
      const response = await fetch(`${storesUrl}${storeId}/list-staff/`, {
        method: "GET",
        headers: getAuthHeaders()
      });

      const raw = await response.text();
      if (!response.ok) throw new Error("Failed to fetch store staff");
      const data = JSON.parse(raw);
      setStoreStaff(data);
    } catch (error) {
      console.error("Error fetching store staff:", error);
    }
  };

  // Fetch unassigned staff (not linked to any store)
  const fetchUnassignedStaff = async () => {
    try {
      const response = await fetch(`${apiBase}/users/staff-unassigned/`, {
        method: "GET",
        headers: getAuthHeaders()

      });

      const raw = await response.text();
      if (!response.ok) throw new Error("Failed to fetch unassigned staff");
      const data = JSON.parse(raw);
      setUnassignedStaff(data);
    } catch (error) {
      console.error("Error fetching unassigned staff:", error);
    }
  };

  // Fetch Categories from API
  const fetchCategories = async () => {
    try {
      const response = await fetch(categoriesUrl, {
        method: "GET",
        headers: getAuthHeaders()

      });

      if (!response.ok) throw new Error("Failed to fetch categories");
      const data = await response.json();
      setCategories(data);
     
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Add New Category to API
  const addCategory = async (newCategory) => {
    try {
      const response = await fetch(categoriesUrl, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(newCategory),
        // credentials: "include", // Sends cookies automatically
      });

      if (!response.ok) {
        // Log the response text or JSON body from the failed request
        const errorResponse = await response.json();
        console.error("Failed to add category, server response:", errorResponse);
        throw new Error(`Failed to add category: ${errorResponse?.detail || response.statusText}`);
      }
  
      const createdCategory = await response.json();
      setCategories((prev) => [...prev, createdCategory]); // Update state
      return createdCategory;
    } catch (error) {
      console.error("Error adding category:", error);
      return null;
    }
  };

  // Add Product to API without image
  const addProduct = async (formData, selectedCategory, selectedUnit, attributes) => {
    const mappedData = {
      product_name: formData.product_name, // Required
      category: parseInt(selectedCategory, 10), // Convert category to integer
      unit: selectedUnit, // Required
      threshold_value: parseInt(formData.threshold_value, 10), // Convert to integer
      attributes: attributes.map(attr => ({
        name: attr.name,
        value: attr.value,
      })), // Ensure attributes is an array
      lots: formData.lots.map(lot => ({
        purchase_date: lot.purchased_date,
        quantity: parseInt(lot.quantity, 10),
        expired_date: lot.expired_date,
        wholesale_purchase_price: parseFloat(lot.wholesale_purchase_price),
        retail_purchase_price: parseFloat(lot.retail_purchase_price),
        wholesale_quantity: parseFloat(lot.wholesale_quantity),
        wholesale_selling_price: parseFloat(lot.wholesale_selling_price),
        retail_selling_price: parseFloat(lot.retail_selling_price),
      })), // Ensure lots is an array
    };
  
    console.log("Submitting Data:", JSON.stringify(mappedData, null, 2));
  
    try {
      const response = await fetch(productsUrl, {
        method: "POST",
        body: JSON.stringify(mappedData), // Send JSON, not FormData
        headers: getAuthHeaders()
      });
  
      if (!response.ok) {
        const errorResponse = await response.json();
        console.error("Failed to add product, server response:", errorResponse);
        throw new Error(`Failed to add product: ${errorResponse?.detail || response.statusText}`);
      }
  
      console.log("✅ Product successfully added!");
      const created = await response.json();

    // ✅ Now fetch full product by ID
    const fullResponse = await fetch(`${productsUrl}${created.id}/`, {
      headers: {
        "Authorization": `Bearer ${accessToken}`,
      },
    });

    if (!fullResponse.ok) {
      throw new Error("Failed to fetch full product details");
    }

    const fullProduct = await fullResponse.json();
    return fullProduct;

    } catch (error) {
      console.error("❌ Error adding product:", error);
    }
  };

  //Trying to upload image
const uploadProductImage = async (productId, file) => {
  const imageUploadUrl = `${productsUrl}${productId}/upload-image/`;

  const formData = new FormData();
  formData.append("product_image", file);

  try {
    const response = await fetch(imageUploadUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Image upload failed: ${errorData?.detail || response.statusText}`);
    }

    const data = await response.json();
    console.log("✅ Image uploaded successfully!", data);
    return data;
  } catch (error) {
    console.error("❌ Error uploading product image:", error);
    return null;
  }
};

  //Fetching product from the API
  const fetchProducts = async () => {
    const productsListUrl = `${productsUrl}list/`;

    setProductsLoading(true);
    setProductsError(null); // Reset error before request
  
    try {
      const response = await fetch(productsListUrl, {
        method: "GET",
        headers: getAuthHeaders(),
        credentials: "include", 
      });
  
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse?.detail || response.statusText);
      }
      const data = await response.json();
      setProducts(
        data.map(product => ({
          id: product.id,
          product_name: product.product_name,
          category: product.category,
          image: product.image_url || "", // fallback if no image
          available: product.available_status || "In-Stock", // adjust based on backend
          quantity: product.lots?.reduce((sum, lot) => sum + lot.quantity, 0) || 0,
          price: product.lots?.[0]?.retail_selling_price || 0, // or calculate average
          expired_date: product.lots?.[0]?.expired_date || null,
          threshold_value: product.threshold_value,
        }))
      );
      return data;
    } catch (error) {
      console.error("❌ Error fetching products:", error);
      setProducts([]);
      
      setProductsError(error.message || "Unknown error occurred.");
      return [];
    } finally {
      setProductsLoading(false);
    }
    
  };
  
  //store request
  // ✅ Fetch all stores
  const fetchStores = async () => {
  try {
    const response = await fetch(storesUrl, {
      method: "GET",
      headers: getAuthHeaders()
    });

    const raw = await response.text(); // Read raw response body

    if (!response.ok) {
      console.error("Failed to fetch stores, raw response:", raw);
      throw new Error("Failed to fetch stores");
    }

    const storeList = JSON.parse(raw);
    setStoreData(storeList);
  } catch (error) {
    console.error("Error fetching stores:", error);
  }
};

  // ✅ Add a new store
  const addStore = async (newStore) => {
  try {
    console.log("Sending new store data:", newStore); // 👈 log request payload

    const response = await fetch(`${storesUrl}create-store/`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(newStore),
    });

    const responseText = await response.text(); // Read raw response for debugging

    if (!response.ok) {
      console.error("Server error response:", responseText); // 👈 log server error body
      throw new Error("Failed to add store");
    }

    const createdStore = JSON.parse(responseText);
    await fetchStores();
    return createdStore;
  } catch (error) {
    console.error("❌ Error adding store:", error);
    return null;
  }
};

  // ✅ Update an existing store
  const updateStore = async (id, updatedStore) => {
  try {
    console.log(`Updating store ${id} with data:`, updatedStore); // 👈 log payload

    const response = await fetch(`${storesUrl}${id}/`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(updatedStore),
    });

    const responseText = await response.text(); // raw body

    if (!response.ok) {
      console.error("Server error response:", responseText); // 👈 server's error message
      throw new Error("Failed to update store");
    }

    const updated = JSON.parse(responseText);
    await fetchStores();
    return updated;
  } catch (error) {
    console.error("❌ Error updating store:", error);
    return null;
  }
};

  return (
    <ApiContext.Provider 
      value={{ 
        fetchCategories,
        categories, 
        addCategory, 
        addProduct,
        fetchProducts,
        products,
        productsLoading,
        productsError,
        uploadProductImage,

        storeData,
        fetchStores,
        addStore,
        updateStore,

        subaccounts,
        StoreStaff,
        UnassignedStaff,
        fetchSubaccounts,
        fetchStoreStaff,
        fetchUnassignedStaff,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};

// Custom Hook to Use API Context
// export const useApi = () => useContext(ApiContext);

function useApi() {
  return useContext(ApiContext);
}

export { useApi };


