import React from 'react';
import { InventoryProvider } from './InventoryContext';
import { ApiProvider } from './ApiContext';

const AppProviders = ({ children }) => {
    return (
        <ApiProvider>
            <InventoryProvider>
                {children}
            </InventoryProvider>
        </ApiProvider>
    );
};

export default AppProviders;