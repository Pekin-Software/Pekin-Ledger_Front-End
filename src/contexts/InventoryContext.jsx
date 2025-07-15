// contexts/InventoryContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    overviewUrl,
    getAuthHeaders,
    isAuthValid
} from '../utils/apiConfig';

const InventoryContext = createContext();
export const useInventory = () => useContext(InventoryContext);

export const InventoryProvider = ({ children }) => {
    const [mainInventoryOverview, setmainInventoryOverview] = useState(null);   // General Inventory
    const [storeInventory, setStoreInventory] = useState(null); // Store Inventory
    const [overviewLoading, setoverviewLoading] = useState(true);
    const [overviewError, setoverviewError] = useState(null);

    const fetchInventoryOverview = async () => {
        if (!isAuthValid()) {
            setoverviewError("Missing tenant or access token");
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

    useEffect(() => {
        fetchInventoryOverview();
    }, []);

    return (
        <InventoryContext.Provider
            value={{
                mainInventoryOverview,    // General inventory
                storeInventory,   // Store inventory
                overviewLoading,
                overviewError,
                refresh: fetchInventoryOverview
            }}
        >
            {children}
        </InventoryContext.Provider>
    );
};
