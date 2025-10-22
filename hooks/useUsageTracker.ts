import { useState, useCallback } from 'react';

export const useUsageTracker = (featureKey: string, limit: number) => {
    const getStoredCount = () => {
        try {
            const item = window.localStorage.getItem(`usage_${featureKey}`);
            return item ? parseInt(item, 10) : 0;
        } catch (error) {
            console.error(error);
            return 0;
        }
    };

    const [count, setCount] = useState(getStoredCount);

    const increment = useCallback(() => {
        setCount(prevCount => {
            const newCount = prevCount + 1;
            try {
                window.localStorage.setItem(`usage_${featureKey}`, newCount.toString());
            } catch (error) {
                console.error(error);
            }
            return newCount;
        });
    }, [featureKey]);

    const hasUses = useCallback(() => {
        return count < limit;
    }, [count, limit]);

    return { count, increment, hasUses };
};
