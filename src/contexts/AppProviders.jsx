import React from 'react';
import { InventoryProvider } from './InventoryContext';
import { UserProvider } from './UserContext';
import { ApiProvider } from './ApiContext';

const AppProviders = ({ children }) => {
    return (
        <ApiProvider>
            <UserProvider>
            <InventoryProvider>
                {children}
            </InventoryProvider>
            </UserProvider>
        </ApiProvider>
    );
};

export default AppProviders;