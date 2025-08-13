// import React, { createContext, useContext, useState, useEffect } from 'react';
// import Cookies from 'js-cookie';

// const InventoryContext = createContext();
// export const useInventory = () => useContext(InventoryContext);

// export const InventoryProvider = ({ children }) => {
//     const accessToken = Cookies.get('access_token');
//     const tenantDomain = Cookies.get('tenant');
//     console.log(accessToken);
//     console.log(tenantDomain)

//    const getAuthHeaders = (isJson = true) => {
//         return {
//             ...(isJson && { "Content-Type": "application/json" }),
//             ...(accessToken && { "Authorization": `Bearer ${accessToken}` })
//         };
//     };

//     const apiBase = `https://${tenantDomain}/api`
//     //  const apiBase = `http://${tenantDomain}:8000/api`
//     const inventory = `${apiBase}/inventory/`
//     const overviewUrl = `${inventory}overview/`
//     const mainInventoryUrl = `${inventory}main-inventory/` 
    
//     const [mainInventoryOverview, setmainInventoryOverview] = useState([]);   // General Inventory
//     const [storeInventory, setStoreInventory] = useState([]); // Store Inventory  overview 
//     const [overviewLoading, setoverviewLoading] = useState(true);
//     const [overviewError, setoverviewError] = useState(null);

//     const [productsLoading, setproductsLoading] = useState(false);
//     const [productsError, setproductsError] = useState(null);
//     const [products, setproducts] = useState([]);  
//     const [POS_Product_data, setPOS_Product_data] =useState([])

//     const [unassignedProducts, setUnassignedProducts] = useState([]);

//     const fetchInventoryOverview = async () => {
//         if (!tenantDomain) {
//             setoverviewError("Missing tenant domain");
//             setoverviewLoading(false);
//             return;
//             }

//         try {
//             setoverviewLoading(true);
//             const response = await fetch(overviewUrl, {
//                 method: 'GET',
//                 headers: getAuthHeaders(),
//             });

//             if (!response.ok) {
//                 const errorData = await response.json().catch(() => ({}));
//                 throw new Error(errorData.detail || `HTTP error: ${response.status}`);
//             }

//             const data = await response.json();
//             const { general_inventory, store_inventory } = data.overview || {};

//             setmainInventoryOverview(general_inventory || {});
//             setStoreInventory(store_inventory || {});
//         } catch (err) {
//             setoverviewError(err.message || 'Failed to fetch inventory overview');
//         } finally {
//             setoverviewLoading(false);
//         }
//     };

//     // const fetchProducts = async ({
//     //     storeId = null,
//     //     excludeStoreId = null,
//     //     type = "store", // "store" or "unassigned"
//     //     } = {}) => {
//     //     if (!tenantDomain) {
//     //         setoverviewError("Missing tenant domain");
//     //         setoverviewLoading(false);
//     //         return;
//     //     }

//     //     try {
//     //         const setTarget = type === "unassigned" ? setUnassignedProducts : setproducts;
//     //         const setLoading = type === "unassigned" ? setproductsLoading : setproductsLoading;

//     //         setLoading(true);

//     //         let url = mainInventoryUrl;

//     //         if (storeId) {
//     //         url = `${apiBase}/inventory/${storeId}/inventory/`;
//     //         } else if (excludeStoreId) {
//     //         url = `${mainInventoryUrl}?exclude_store_id=${excludeStoreId}`;
//     //         }

//     //         const response = await fetch(url, {
//     //         method: 'GET',
//     //         headers: getAuthHeaders(),
//     //         credentials: "include"
//     //         });

//     //         if (!response.ok) {
//     //         const errorData = await response.json().catch(() => ({}));
//     //         throw new Error(errorData.detail || `HTTP error: ${response.status}`);
//     //         }

//     //         const rawData = await response.json();

//     //         const posProductData = rawData.map(item => {
//     //             const product = item.product || {};
//     //             const variants = (item.variants || []).map((variant, index) => {
//     //                 const newestLot = (variant.lots || [])
//     //                 .sort((a, b) => new Date(b.purchase_date || 0) - new Date(a.purchase_date || 0))[0] || {};

//     //                 // Assign unique string ID for each variant: '1a', '1b', ...
//     //                 const variantId = variant.id;

//     //                 return {
//     //                 id: variantId,
//     //                 name: variant.attributes.map(attr => attr.value).join(' '), // e.g., "Brown M"
//     //                 price: parseFloat(newestLot.retail_selling_price) || 0,
//     //                 image: variant.barcode_image || ""
//     //                 };
//     //         });

//     //         return {
//     //             id: product.id,
//     //             product_name: product.product_name,
//     //             image: product.product_image_url || "",
//     //             currency: product.currency,
//     //             variants: variants
//     //         };
//     //         });

//     //        setPOS_Product_data(posProductData);
//     //         setproducts(rawData);   
//     //     } catch (err) {
//     //         setproductsError(err.message || 'Failed to fetch inventory');
//     //     } finally {
//     //         setproductsLoading(false);
//     //     }
//     // };

//     // Add this inside InventoryProvider
    
//     const fetchProducts = async ({ storeId = null, excludeStoreId = null, type = "store" } = {}) => {
//         const tenantDomain = getTenantDomain();
//         if (!tenantDomain) {
//             setProductsError("Missing tenant domain");
//             setProductsLoading(false);
//             return;
//         }

//         const setTarget = type === "unassigned" ? setUnassignedProducts : setProducts;
//         const setLoading = type === "unassigned" ? setUnassignedLoading : setProductsLoading;
//         const setError = type === "unassigned" ? setProductsError : setProductsError;

//         try {
//             setLoading(true);

//             let url = `${inventoryBase}/main-inventory/`;
//             if (storeId) {
//                 url = `${apiBase}/inventory/${storeId}/inventory/`;
//             } else if (excludeStoreId) {
//                 url = `${url}?exclude_store_id=${excludeStoreId}`;
//             }

//             const response = await fetch(url, {
//                 method: "GET",
//                 headers: getAuthHeaders(),
//                 credentials: "include",
//             });

//             if (!response.ok) {
//                 const errorData = await response.json().catch(() => ({}));
//                 throw new Error(errorData.detail || `HTTP error: ${response.status}`);
//             }

//             const rawData = await response.json();

//             // Map POS product data
//             const posProductData = rawData.map((item) => {
//                 const product = item.product || {};
//                 const variants = (item.variants || []).map((variant) => {
//                     const newestLot = (variant.lots || [])
//                         .sort((a, b) => new Date(b.purchase_date || 0) - new Date(a.purchase_date || 0))[0] || {};

//                     return {
//                         id: variant.id,
//                         name: variant.attributes.map((attr) => attr.value).join(" "),
//                         price: parseFloat(newestLot.retail_selling_price) || 0,
//                         image: variant.barcode_image || "",
//                     };
//                 });

//                 return {
//                     id: product.id,
//                     product_name: product.product_name,
//                     image: product.product_image_url || "",
//                     currency: product.currency,
//                     variants,
//                 };
//             });

//             if (type === "unassigned") setUnassignedProducts(rawData);
//             else {
//                 setProducts(rawData);
//                 setPOS_Product_data(posProductData);
//             }
//         } catch (err) {
//             setError(err.message || "Failed to fetch products");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const addInventory = async (storeId, inventoryItems = []) => {
//         if (!tenantDomain) {
//             throw new Error("Missing tenant domain");
//         }
//         try {
//             const response = await fetch(
//             `${apiBase}/store/${storeId}/add-inventory/`,
//             {
//                 method: "POST",
//                 headers: getAuthHeaders(),
//                 body: JSON.stringify(inventoryItems),
//             }
//             );

//             if (!response.ok) {
//             const errorData = await response.json().catch(() => ({}));
//             throw new Error(errorData.detail || `HTTP error: ${response.status}`);
//             }

//             const data = await response.json();
//             return { success: true, data };
//         } catch (error) {
//             return { success: false, error: error.message || "Failed to add inventory." };
//         }
//         };


//     const refreshAll = async () => {
//         await Promise.all([
//             fetchInventoryOverview(),
//             fetchProducts()
//             ]);
//         };

//     return (
//         <InventoryContext.Provider
//             value={{
//                 refreshAll,  

//                 mainInventoryOverview,    // General inventory
//                 storeInventory,   // Store inventory
//                 overviewLoading,
//                 overviewError,
//                 fetchInventoryOverview,

//                 products,
//                 POS_Product_data,
//                 unassignedProducts,
//                 productsLoading,
//                 productsError, 
//                 fetchProducts,

//                 addInventory,
//             }}
//         >
//             {children}
//         </InventoryContext.Provider>
//     );
// };

import React, { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

export const InventoryContext = createContext();

export const InventoryProvider = ({ children }) => {
    // Get cookies
    const getAccessToken = () => Cookies.get("access_token");
    const getTenantDomain = () => Cookies.get("tenant");

    const getAuthHeaders = (isJson = true) => {
        const accessToken = getAccessToken();
        return {
            ...(isJson && { "Content-Type": "application/json" }),
            ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        };
    };

    const apiBase = `https://${getTenantDomain()}/api`;
    const inventoryBase = `${apiBase}/inventory`;

    // State
    const [mainInventoryOverview, setMainInventoryOverview] = useState([]);
    const [storeInventory, setStoreInventory] = useState([]);
    const [overviewLoading, setOverviewLoading] = useState(true);
    const [overviewError, setOverviewError] = useState(null);

    const [products, setProducts] = useState([]);
    const [POS_Product_data, setPOS_Product_data] = useState([]);
    const [productsLoading, setProductsLoading] = useState(false);
    const [productsError, setProductsError] = useState(null);

    const [unassignedProducts, setUnassignedProducts] = useState([]);
    const [unassignedLoading, setUnassignedLoading] = useState(false);

    // Fetch Inventory Overview
    const fetchInventoryOverview = async () => {
        const tenantDomain = getTenantDomain();
        if (!tenantDomain) {
            setOverviewError("Missing tenant domain");
            setOverviewLoading(false);
            return;
        }

        try {
            setOverviewLoading(true);
            const response = await fetch(`${inventoryBase}/overview/`, {
                method: "GET",
                headers: getAuthHeaders(),
                credentials: "include",
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || `HTTP error: ${response.status}`);
            }

            const data = await response.json();
            const { general_inventory = [], store_inventory = [] } = data.overview || {};

            setMainInventoryOverview(general_inventory);
            setStoreInventory(store_inventory);
        } catch (err) {
            setOverviewError(err.message || "Failed to fetch inventory overview");
        } finally {
            setOverviewLoading(false);
        }
    };

    // Fetch Products
    const fetchProducts = async ({ storeId = null, excludeStoreId = null, type = "store" } = {}) => {
        const tenantDomain = getTenantDomain();
        if (!tenantDomain) {
            setProductsError("Missing tenant domain");
            setProductsLoading(false);
            return;
        }

        const setTarget = type === "unassigned" ? setUnassignedProducts : setProducts;
        const setLoading = type === "unassigned" ? setUnassignedLoading : setProductsLoading;
        const setError = type === "unassigned" ? setProductsError : setProductsError;

        try {
            setLoading(true);

            let url = `${inventoryBase}/main-inventory/`;
            if (storeId) {
                url = `${apiBase}/inventory/${storeId}/inventory/`;
            } else if (excludeStoreId) {
                url = `${url}?exclude_store_id=${excludeStoreId}`;
            }

            const response = await fetch(url, {
                method: "GET",
                headers: getAuthHeaders(),
                credentials: "include",
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || `HTTP error: ${response.status}`);
            }

            const rawData = await response.json();

            // Map POS product data
            const posProductData = rawData.map((item) => {
                const product = item.product || {};
                const variants = (item.variants || []).map((variant) => {
                    const newestLot = (variant.lots || [])
                        .sort((a, b) => new Date(b.purchase_date || 0) - new Date(a.purchase_date || 0))[0] || {};

                    return {
                        id: variant.id,
                        name: variant.attributes.map((attr) => attr.value).join(" "),
                        price: parseFloat(newestLot.retail_selling_price) || 0,
                        image: variant.barcode_image || "",
                    };
                });

                return {
                    id: product.id,
                    product_name: product.product_name,
                    image: product.product_image_url || "",
                    currency: product.currency,
                    variants,
                };
            });

            if (type === "unassigned") setUnassignedProducts(rawData);
            else {
                setProducts(rawData);
                setPOS_Product_data(posProductData);
            }
        } catch (err) {
            setError(err.message || "Failed to fetch products");
        } finally {
            setLoading(false);
        }
    };

    // Add Inventory
    const addInventory = async (storeId, inventoryItems = []) => {
        const tenantDomain = getTenantDomain();
        if (!tenantDomain) throw new Error("Missing tenant domain");

        try {
            const response = await fetch(`${apiBase}/store/${storeId}/add-inventory/`, {
                method: "POST",
                headers: getAuthHeaders(),
                credentials: "include",
                body: JSON.stringify(inventoryItems),
            });

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

    // Refresh all data
    const refreshAll = async () => {
        await Promise.all([fetchInventoryOverview(), fetchProducts()]);
    };

    // Initial fetch
    useEffect(() => {
        refreshAll();
    }, []);

    return (
        <InventoryContext.Provider
            value={{
                refreshAll,

                mainInventoryOverview,
                storeInventory,
                overviewLoading,
                overviewError,
                fetchInventoryOverview,

                products,
                POS_Product_data,
                unassignedProducts,
                productsLoading,
                unassignedLoading,
                productsError,
                fetchProducts,

                addInventory,
            }}
        >
            {children}
        </InventoryContext.Provider>
    );
};
