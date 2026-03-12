import { useCallback, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export const useRefresh = (refetchFunctions: (() => Promise<any>)[]) => {
    const [refreshing, setRefreshing] = useState(false);
    const queryClient = useQueryClient();

    const onRefresh = useCallback(async () => {
        setRefreshing(true);

        try {
            await queryClient.invalidateQueries();

            await Promise.all(refetchFunctions.map(fn => fn()));
        } catch (error) {
            console.error('Refresh error:', error);
        } finally {
            setRefreshing(false);
        }
    }, [queryClient, refetchFunctions]);

    return { refreshing, onRefresh };
};