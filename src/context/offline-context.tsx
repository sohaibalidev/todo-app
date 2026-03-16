import React, { createContext, useContext, useEffect, useState } from 'react';
import * as Network from 'expo-network';

interface OfflineContextData {
    isConnected: boolean;
    isInternetReachable: boolean;
    networkType: string;
}

const OfflineContext = createContext<OfflineContextData>({} as OfflineContextData);

export const useOffline = () => {
    const context = useContext(OfflineContext);
    if (!context) {
        throw new Error('useOffline must be used within an OfflineProvider');
    }
    return context;
};

export const OfflineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [networkState, setNetworkState] = useState({
        isConnected: true,
        isInternetReachable: true,
        networkType: 'unknown',
    });

    useEffect(() => { 
        checkNetworkState();

        const subscription = Network.addNetworkStateListener((state) => {
            setNetworkState({
                isConnected: state.isConnected ?? true,
                isInternetReachable: state.isInternetReachable ?? true,
                networkType: state.type ?? 'unknown',
            });
        });

        return () => {
            subscription.remove();
        };
    }, []);

    const checkNetworkState = async () => {
        try {
            const state = await Network.getNetworkStateAsync();
            setNetworkState({
                isConnected: state.isConnected ?? true,
                isInternetReachable: state.isInternetReachable ?? true,
                networkType: state.type ?? 'unknown',
            });
        } catch (error) {
            console.error('Failed to check network state:', error);
        }
    };

    return (
        <OfflineContext.Provider value={networkState}>
            {children}
        </OfflineContext.Provider>
    );
};