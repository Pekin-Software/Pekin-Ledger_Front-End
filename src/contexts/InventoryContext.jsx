import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const InventoryContext = createContext();
export const useInventory = () => useContext(InventoryContext);

export const InventoryProvider = ({ children }) => {
    const tenantDomain  = Cookies.get("tenant");
    // const accessToken =  Cookies.get("access_token");
    
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

    const fetchProducts = async ({
        storeId = null,
        excludeStoreId = null,
        type = "store", // "store" or "unassigned"
        } = {}) => {
        if (!tenantDomain || !accessToken) {
            setoverviewError("Missing tenant domain or access token.");
            setoverviewLoading(false);
            return;
        }

        try {
            const setTarget = type === "unassigned" ? setUnassignedProducts : setproducts;
            const setLoading = type === "unassigned" ? setproductsLoading : setproductsLoading;

            setLoading(true);

            let url = mainInventoryUrl;

            if (storeId) {
            url = `${apiBase}/inventory/${storeId}/inventory/`;
            } else if (excludeStoreId) {
            url = `${mainInventoryUrl}?exclude_store_id=${excludeStoreId}`;
            }

            const response = await fetch(url, {
            method: 'GET',
            headers: getAuthHeaders(),
            });

            if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || `HTTP error: ${response.status}`);
            }

            const rawData = await response.json();

            const posProductData = rawData.map(item => {
                const product = item.product || {};
                const variants = (item.variants || []).map((variant, index) => {
                    const newestLot = (variant.lots || [])
                    .sort((a, b) => new Date(b.purchase_date || 0) - new Date(a.purchase_date || 0))[0] || {};

                    // Assign unique string ID for each variant: '1a', '1b', ...
                    const variantId = variant.id;

                    return {
                    id: variantId,
                    name: variant.attributes.map(attr => attr.value).join(' '), // e.g., "Brown M"
                    price: parseFloat(newestLot.retail_selling_price) || 0,
                    image: variant.barcode_image || ""
                    };
            });

            return {
                id: product.id,
                product_name: product.product_name,
                image: product.product_image_url || "",
                currency: product.currency,
                variants: variants
            };
            });

           setPOS_Product_data(posProductData);
            setproducts(rawData);   
        } catch (err) {
            setproductsError(err.message || 'Failed to fetch inventory');
        } finally {
            setproductsLoading(false);
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
