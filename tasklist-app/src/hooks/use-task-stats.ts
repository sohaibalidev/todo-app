import { useQuery } from '@tanstack/react-query';
import { taskService } from '../services/task-service';
import { taskKeys } from './use-tasks';

export const useTaskStats = () => {
    return useQuery({
        queryKey: taskKeys.stats(),
        queryFn: taskService.getTaskStats,
        select: (data) => ({
            ...data,
            completionRate: data.total > 0
                ? Math.round((data.completed / data.total) * 100)
                : 0,
            pendingRate: data.total > 0
                ? Math.round((data.pending / data.total) * 100)
                : 0,
        }),
    });
};