import React from 'react';
import { InventoryProvider } from './InventoryContext';
import { SalesProvider } from './reportContext';
import { ApiProvider } from './ApiContext';

const AppProviders = ({ children }) => {
    return (
        <ApiProvider>
            <InventoryProvider>
            <SalesProvider>
                {children}
            </SalesProvider>
            </InventoryProvider>
        </ApiProvider>
    );
};

export default AppProviders;