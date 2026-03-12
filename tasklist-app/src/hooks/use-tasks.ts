import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService } from '../services/task-service';
import { TaskInsert, TaskUpdate, TaskStatus, TaskPriority } from '../types/database';
import { getUserFriendlyErrorMessage } from '../utils/error-handler';
import { Alert } from 'react-native';

export const taskKeys = {
    all: ['tasks'] as const,
    lists: () => [...taskKeys.all, 'list'] as const,
    list: (filters: string) => [...taskKeys.lists(), filters] as const,
    details: () => [...taskKeys.all, 'detail'] as const,
    detail: (id: string) => [...taskKeys.details(), id] as const,
    stats: () => [...taskKeys.all, 'stats'] as const,
};

export const useTasks = () => {
    const queryClient = useQueryClient();

    const tasksQuery = useQuery({
        queryKey: taskKeys.lists(),
        queryFn: taskService.getTasks,
    });

    const statsQuery = useQuery({
        queryKey: taskKeys.stats(),
        queryFn: taskService.getTaskStats,
    });

    const createTask = useMutation({
        mutationFn: (newTask: TaskInsert) => taskService.createTask(newTask),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
            queryClient.invalidateQueries({ queryKey: taskKeys.stats() });
        },
        onError: (error) => {
            Alert.alert('Error', getUserFriendlyErrorMessage(error));
        },
    });

    const updateTask = useMutation({
        mutationFn: (task: TaskUpdate) => taskService.updateTask(task),
        onSuccess: (updatedTask) => {
            queryClient.setQueryData(taskKeys.detail(updatedTask.id), updatedTask);
            queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
            queryClient.invalidateQueries({ queryKey: taskKeys.stats() });
        },
        onError: (error) => {
            Alert.alert('Error', getUserFriendlyErrorMessage(error));
        },
    });

    const deleteTask = useMutation({
        mutationFn: (id: string) => taskService.deleteTask(id),
        onSuccess: (_, deletedId) => {
            queryClient.removeQueries({ queryKey: taskKeys.detail(deletedId) });
            queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
            queryClient.invalidateQueries({ queryKey: taskKeys.stats() });
        },
        onError: (error) => {
            Alert.alert('Error', getUserFriendlyErrorMessage(error));
        },
    });

    const updateTaskStatus = useMutation({
        mutationFn: ({ id, status }: { id: string; status: TaskStatus }) =>
            taskService.updateTask({ id, status }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
            queryClient.invalidateQueries({ queryKey: taskKeys.stats() });
        },
        onError: (error) => {
            Alert.alert('Error', getUserFriendlyErrorMessage(error));
        },
    });

    return {
        tasks: tasksQuery.data ?? [],
        isLoading: tasksQuery.isLoading,
        isError: tasksQuery.isError,
        error: tasksQuery.error,
        refetch: tasksQuery.refetch,

        stats: statsQuery.data ?? {
            total: 0,
            completed: 0,
            pending: 0,
            byPriority: { low: 0, medium: 0, high: 0 },
        },
        isLoadingStats: statsQuery.isLoading,

        createTask: createTask.mutate,
        updateTask: updateTask.mutate,
        deleteTask: deleteTask.mutate,
        updateTaskStatus: updateTaskStatus.mutate,

        isCreating: createTask.isPending,
        isUpdating: updateTask.isPending,
        isDeleting: deleteTask.isPending,
        isUpdatingStatus: updateTaskStatus.isPending,
    };
};

export const useTasksByFilter = (
    filterType: 'project' | 'priority' | 'status' | 'search',
    value: string
) => {
    return useQuery({
        queryKey: [...taskKeys.lists(), filterType, value],
        queryFn: async () => {
            switch (filterType) {
                case 'project':
                    return taskService.getTasksByProject(value);
                case 'priority':
                    return taskService.getTasksByPriority(value as TaskPriority);
                case 'status':
                    return taskService.getTasksByStatus(value as TaskStatus);
                case 'search':
                    return taskService.searchTasks(value);
                default:
                    return [];
            }
        },
        enabled: !!value,
    });
};
