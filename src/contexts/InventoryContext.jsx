import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const InventoryContext = createContext();
export const useInventory = () => useContext(InventoryContext);

export const InventoryProvider = ({ children }) => {
    const tenantDomain  = Cookies.get("tenant");
    const accessToken =  Cookies.get("access_token");
    
    const getAuthHeaders = (isJson = true) => ({
      ...(isJson && { "Content-Type": "application/json" }),
      Authorization: `Bearer ${accessToken}`,
    });
   
    const apiBase = `https://${tenantDomain}.pekingledger.store/api`
    const storesUrl = `${apiBase}/store/`
    const overviewUrl = `${storesUrl}overview/`
    const mainInventoryUrl = `${storesUrl}main-inventory/` 
    
    const [mainInventoryOverview, setmainInventoryOverview] = useState([]);   // General Inventory
    const [storeInventory, setStoreInventory] = useState([]); // Store Inventory  overview 
    const [overviewLoading, setoverviewLoading] = useState(true);
    const [overviewError, setoverviewError] = useState(null);

    const [productsLoading, setproductsLoading] = useState(false);
    const [productsError, setproductsError] = useState(null);
    const [products, setproducts] = useState([]);  

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

    const fetchProducts= async () => {
        if (!tenantDomain || !accessToken) {
            setoverviewError("Missing tenant domain or access token.");
            setoverviewLoading(false);
            return;
            }

        try {
            setproductsLoading(true);
            const response = await fetch(mainInventoryUrl, {
                method: 'GET',
                headers: getAuthHeaders(),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || `HTTP error: ${response.status}`);
            }

            const rawData = await response.json();

            // 🔄 Transform the raw inventory list
            const transformedData = rawData.map(item => {
                const product = item.product || {};
                const firstLot = (product.lots && product.lots[0]) || {};

                return {
                    id: product.id,
                    product_name: product.product_name,
                    image: product.product_image || "",
                    stock_status: item.stock_status || "Unknown",
                    quantity: item.total_quantity || 0,
                    price: parseFloat(firstLot.retail_selling_price) || 0,
                };
            });

            // ✅ Store transformed data in state
            setproducts(transformedData);
        } catch (err) {
            setproductsError(err.message || 'Failed to fetch main inventory');
        } finally {
            setproductsLoading(false);
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
                productsLoading,
                productsError, 
                fetchProducts,
            }}
        >
            {children}
        </InventoryContext.Provider>
    );
};
