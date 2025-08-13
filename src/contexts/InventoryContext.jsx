import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const InventoryContext = createContext();
export const useInventory = () => useContext(InventoryContext);

export const InventoryProvider = ({ children }) => {
    const tenantDomain  = Cookies.get("tenant");
    const accessToken =  Cookies.get("access_token");
    
    console.log(tenantDomain)
    const getAuthHeaders = (isJson = true) => ({
      ...(isJson && { "Content-Type": "application/json" }),
      Authorization: `Bearer ${accessToken}`,
    });

    const apiBase = `https://${tenantDomain}/api`
    //  const apiBase = `http://${tenantDomain}:8000/api`
    const inventory = `${apiBase}/inventory/`
    const overviewUrl = `${inventory}overview/`
    const mainInventoryUrl = `${inventory}main-inventory/` 
    
    const [mainInventoryOverview, setmainInventoryOverview] = useState([]);   // General Inventory
    const [storeInventory, setStoreInventory] = useState([]); // Store Inventory  overview 
    const [overviewLoading, setoverviewLoading] = useState(true);
    const [overviewError, setoverviewError] = useState(null);

    const [productsLoading, setproductsLoading] = useState(false);
    const [productsError, setproductsError] = useState(null);
    const [products, setproducts] = useState([]);  
    const [POS_Product_data, setPOS_Product_data] =useState([])

    const [unassignedProducts, setUnassignedProducts] = useState([]);

    const fetchInventoryOverview = async () => {
        if (!tenantDomain || !accessToken) {
            setoverviewError("Missing tenant domain or access token.");
            setoverviewLoading(false);
            return;
            }

        try {
            setoverviewLoading(true);
            const response = await fetch(overviewUrl, {
                method: 'GET',
                headers: getAuthHeaders(),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || `HTTP error: ${response.status}`);
            }

            const data = await response.json();
            const { general_inventory, store_inventory } = data.overview || {};

            setmainInventoryOverview(general_inventory || {});
            setStoreInventory(store_inventory || {});
        } catch (err) {
            setoverviewError(err.message || 'Failed to fetch inventory overview');
        } finally {
            setoverviewLoading(false);
        }
    };



    // Add this inside InventoryProvider
    const addInventory = async (storeId, inventoryItems = []) => {
        if (!tenantDomain || !accessToken) {
            throw new Error("Missing tenant domain or access token.");
        }
        try {
            const response = await fetch(
            `${apiBase}/store/${storeId}/add-inventory/`,
            {
                method: "POST",
                headers: getAuthHeaders(),
                body: JSON.stringify(inventoryItems),
            }
            );

            if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || `HTTP error: ${response.status}`);
            }

            const data = await response.json();
            return { success: true, data };
        } catch (error) {
            return { success: false, error: error.message || "Failed to add inventory." };
        }
        };


    const refreshAll = async () => {
        await Promise.all([
            fetchInventoryOverview(),
            fetchProducts()
            ]);
        };

    return (
        <InventoryContext.Provider
            value={{
                refreshAll,  

                mainInventoryOverview,    // General inventory
                storeInventory,   // Store inventory
                overviewLoading,
                overviewError,
                fetchInventoryOverview,

                products,
                POS_Product_data,
                unassignedProducts,
                productsLoading,
                productsError, 
                fetchProducts,

                addInventory,
            }}
        >
            {children}
        </InventoryContext.Provider>
    );
};