import { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useTasks } from '../../hooks/use-tasks';
import { useProjects } from '../../hooks/use-project';
import { useModal } from '../../context/modal-context';
import { TaskList } from '../../components/task/task-list';
import { LoadingSpinner } from '../../components/ui/loading-spinner';
import { ErrorMessage } from '../../components/ui/error-message';
import { COLORS } from '../../constants/colors';
import { useLocalSearchParams } from 'expo-router';

export default function AllTasksScreen() {
    const params = useLocalSearchParams<{
        filterPriority?: 'low' | 'medium' | 'high';
        filterStatus?: 'todo' | 'in-progress' | 'done' | 'all';
    }>();

    const { openModal } = useModal();
    const [searchQuery, setSearchQuery] = useState(''); 

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

    const filteredTasks = tasks.filter(task => {
        const matchesSearch = searchQuery === '' ||
            task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (task.description?.toLowerCase() || '').includes(searchQuery.toLowerCase());

        const matchesStatus = !filter.status || task.status === filter.status;
        const matchesPriority = !filter.priority || task.priority === filter.priority;

        return matchesSearch && matchesStatus && matchesPriority;
    });

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
                    {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'} total
                </Text>
            </View>

            <View style={styles.searchContainer}>
                <Feather name="search" size={18} color={COLORS.ui.textSecondary} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search tasks by title or description"
                    placeholderTextColor={COLORS.ui.textSecondary}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                {searchQuery !== '' && (
                    <TouchableOpacity onPress={() => setSearchQuery('')}>
                        <Feather name="x" size={20} color={COLORS.ui.textSecondary} />
                    </TouchableOpacity>
                )}
            </View>

            <TaskList
                tasks={filteredTasks}
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
                    icon: searchQuery ? 'search' : 'check-square',
                    title: searchQuery ? 'No matching tasks' : 'No tasks yet',
                    message: searchQuery
                        ? `No tasks match "${searchQuery}"`
                        : 'Create your first task to get started',
                }}
            />

            <TouchableOpacity
                style={styles.fab}
                onPress={() => openModal('create-task')}
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
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.ui.card,
        margin: 0,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.ui.border,
        paddingHorizontal: 16,
        paddingVertical: 10,
        gap: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        margin: -5,
        color: COLORS.ui.text,
        paddingVertical: 0,
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