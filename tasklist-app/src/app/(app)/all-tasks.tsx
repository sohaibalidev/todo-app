import { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useTasks } from '../../hooks/use-tasks';
import { useProjects } from '../../hooks/use-project';
import { TaskList } from '../../components/task/task-list';
import { LoadingSpinner } from '../../components/ui/loading-spinner';
import { ErrorMessage } from '../../components/ui/error-message';
import { COLORS } from '../../constants/colors';
import { router } from 'expo-router';

import { useLocalSearchParams } from 'expo-router';

export default function AllTasksScreen() {
    const params = useLocalSearchParams<{
        filterPriority?: 'low' | 'medium' | 'high';
        filterStatus?: 'todo' | 'in-progress' | 'done' | 'all';
    }>();

    const [filter, setFilter] = useState<{
        status?: 'todo' | 'in-progress' | 'done';
        priority?: 'low' | 'medium' | 'high'
    }>({});

    const {
        tasks,
        isLoading,
        isError,
        error,
        refetch,
        updateTaskStatus,
        deleteTask,
        isUpdating,
        isDeleting,
    } = useTasks();

    const { projects } = useProjects();

    useEffect(() => {
        const initialFilter: any = {};
        if (params.filterPriority) {
            initialFilter.priority = params.filterPriority;
        }
        if (params.filterStatus && params.filterStatus !== 'all') {
            initialFilter.status = params.filterStatus;
        }
        setFilter(initialFilter);
    }, [params.filterPriority, params.filterStatus]);

    const projectsMap = projects.reduce((acc, project) => {
        acc[project.id] = project.title;
        return acc;
    }, {} as Record<string, string>);

    const handleFilterChange = (newFilter: { status?: 'todo' | 'in-progress' | 'done'; priority?: 'low' | 'medium' | 'high' }) => {
        setFilter(newFilter);
    };

    if (isLoading) {
        return <LoadingSpinner fullScreen />;
    }

    if (isError) {
        return (
            <ErrorMessage
                message={error?.message || 'Failed to load tasks'}
                onRetry={refetch}
                fullScreen
            />
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <Text style={styles.title}>All Tasks</Text>
                <Text style={styles.taskCount}>
                    {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} total
                </Text>
            </View>

            <TaskList
                tasks={tasks}
                onTaskPress={(task) => {
                    console.log('Task pressed:', task.id);
                }}
                onTaskStatusChange={async (taskId, status) => {
                    await updateTaskStatus({ id: taskId, status });
                }}
                onTaskDelete={async (taskId) => {
                    Alert.alert('Delete Task', 'Are you sure you want to delete this task?', [
                        { text: 'Cancel', style: 'cancel' },
                        {
                            text: 'Delete',
                            style: 'destructive',
                            onPress: () => deleteTask(taskId)
                        },
                    ]);
                }}
                showProjectNames={true}
                projectsMap={projectsMap}
                filter={filter}
                onFilterChange={handleFilterChange}
                emptyStateProps={{
                    icon: 'check-square',
                    title: 'No tasks yet',
                    message: 'Create your first task to get started',
                }}
            />

            <TouchableOpacity
                style={styles.fab}
                onPress={() => {
                    router.push('/(app)/modal/create-task');
                }}
            >
                <Feather name="plus" size={24} color={COLORS.ui.background} />
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.ui.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: COLORS.ui.background,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.ui.border,
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        color: COLORS.ui.text,
    },
    taskCount: {
        fontSize: 14,
        color: COLORS.ui.textSecondary,
    },
    fab: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: COLORS.priority.medium,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
});