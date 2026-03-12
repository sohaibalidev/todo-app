import { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Task, TaskStatus, TaskPriority } from '../../types/database';
import { TaskItem } from './task-item';
import { EmptyState } from '../ui/empty-state';
import { LoadingSpinner } from '../ui/loading-spinner';
import { COLORS } from '../../constants/colors';

interface TaskListProps {
    tasks: Task[];
    isLoading?: boolean;
    onTaskPress: (task: Task) => void;
    onTaskStatusChange: (taskId: string, status: TaskStatus) => void;
    onTaskDelete: (taskId: string) => void;
    showProjectNames?: boolean;
    projectsMap?: Record<string, string>; 
    emptyStateProps?: {
        icon?: keyof typeof Feather.glyphMap;
        title: string;
        message?: string;
    };
    filter?: {
        status?: TaskStatus;
        priority?: TaskPriority;
    };
    onFilterChange?: (filter: { status?: TaskStatus; priority?: TaskPriority }) => void;
}

type FilterOption = 'all' | TaskStatus;
type PriorityOption = 'all' | TaskPriority;

export const TaskList = ({
    tasks,
    isLoading = false,
    onTaskPress,
    onTaskStatusChange,
    onTaskDelete,
    showProjectNames = false,
    projectsMap = {},
    emptyStateProps,
    filter,
    onFilterChange,
}: TaskListProps) => {
    const [showFilters, setShowFilters] = useState(false);
    const [localStatusFilter, setLocalStatusFilter] = useState<FilterOption>(filter?.status || 'all');
    const [localPriorityFilter, setLocalPriorityFilter] = useState<PriorityOption>(filter?.priority || 'all');

    const statusOptions: { label: string; value: FilterOption; icon: keyof typeof Feather.glyphMap }[] = [
        { label: 'All', value: 'all', icon: 'list' },
        { label: 'Todo', value: 'todo', icon: 'circle' },
        { label: 'In Progress', value: 'in-progress', icon: 'clock' },
        { label: 'Done', value: 'done', icon: 'check-circle' },
    ];

    const priorityOptions: { label: string; value: PriorityOption; icon: keyof typeof Feather.glyphMap }[] = [
        { label: 'All', value: 'all', icon: 'list' },
        { label: 'High', value: 'high', icon: 'arrow-up' },
        { label: 'Medium', value: 'medium', icon: 'minus' },
        { label: 'Low', value: 'low', icon: 'arrow-down' },
    ];

    const filteredTasks = tasks.filter(task => {
        if (localStatusFilter !== 'all' && task.status !== localStatusFilter) return false;
        if (localPriorityFilter !== 'all' && task.priority !== localPriorityFilter) return false;
        return true;
    });

    const handleStatusFilterChange = (value: FilterOption) => {
        setLocalStatusFilter(value);
        if (onFilterChange) {
            onFilterChange({
                status: value === 'all' ? undefined : value,
                priority: localPriorityFilter === 'all' ? undefined : localPriorityFilter,
            });
        }
    };

    const handlePriorityFilterChange = (value: PriorityOption) => {
        setLocalPriorityFilter(value);
        if (onFilterChange) {
            onFilterChange({
                status: localStatusFilter === 'all' ? undefined : localStatusFilter,
                priority: value === 'all' ? undefined : value,
            });
        }
    };

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (tasks.length === 0) {
        return (
            <EmptyState
                icon={emptyStateProps?.icon || 'check-square'}
                title={emptyStateProps?.title || 'No tasks'}
                message={emptyStateProps?.message || 'Create your first task to get started'}
            />
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.filterBar}>
                <TouchableOpacity
                    style={styles.filterToggle}
                    onPress={() => setShowFilters(!showFilters)}
                >
                    <Feather name="filter" size={16} color={COLORS.ui.text} />
                    <Text style={styles.filterToggleText}>
                        {showFilters ? 'Hide Filters' : 'Show Filters'}
                    </Text>
                </TouchableOpacity>

                <Text style={styles.resultCount}>
                    {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
                </Text>
            </View>

            {showFilters && (
                <View style={styles.filterOptions}>
                    <View style={styles.filterSection}>
                        <Text style={styles.filterSectionTitle}>Status</Text>
                        <View style={styles.filterChips}>
                            {statusOptions.map((option) => (
                                <TouchableOpacity
                                    key={option.value}
                                    style={[
                                        styles.filterChip,
                                        localStatusFilter === option.value && styles.filterChipActive,
                                    ]}
                                    onPress={() => handleStatusFilterChange(option.value)}
                                >
                                    <Feather
                                        name={option.icon}
                                        size={14}
                                        color={localStatusFilter === option.value ? COLORS.ui.background : COLORS.ui.text}
                                    />
                                    <Text
                                        style={[
                                            styles.filterChipText,
                                            localStatusFilter === option.value && styles.filterChipTextActive,
                                        ]}
                                    >
                                        {option.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <View style={styles.filterSection}>
                        <Text style={styles.filterSectionTitle}>Priority</Text>
                        <View style={styles.filterChips}>
                            {priorityOptions.map((option) => (
                                <TouchableOpacity
                                    key={option.value}
                                    style={[
                                        styles.filterChip,
                                        localPriorityFilter === option.value && styles.filterChipActive,
                                    ]}
                                    onPress={() => handlePriorityFilterChange(option.value)}
                                >
                                    <Feather
                                        name={option.icon}
                                        size={14}
                                        color={localPriorityFilter === option.value ? COLORS.ui.background : COLORS.ui.text}
                                    />
                                    <Text
                                        style={[
                                            styles.filterChipText,
                                            localPriorityFilter === option.value && styles.filterChipTextActive,
                                        ]}
                                    >
                                        {option.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>
            )}

            <FlatList
                data={filteredTasks}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TaskItem
                        task={item}
                        projectName={showProjectNames && item.project_id ? projectsMap[item.project_id] : undefined}
                        projectId={item.project_id}
                        onPress={() => onTaskPress(item)}
                        onStatusChange={onTaskStatusChange}
                        onDelete={onTaskDelete}
                        showProject={showProjectNames} 
                    />
                )}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    filterBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: COLORS.ui.card,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.ui.border,
    },
    filterToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    filterToggleText: {
        fontSize: 14,
        color: COLORS.ui.text,
        fontWeight: '500',
    },
    resultCount: {
        fontSize: 14,
        color: COLORS.ui.textSecondary,
    },
    filterOptions: {
        backgroundColor: COLORS.ui.background,
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.ui.border,
    },
    filterSection: {
        marginBottom: 16,
    },
    filterSectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.ui.text,
        marginBottom: 8,
    },
    filterChips: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    filterChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor: COLORS.ui.card,
        gap: 4,
    },
    filterChipActive: {
        backgroundColor: COLORS.priority.medium,
    },
    filterChipText: {
        fontSize: 12,
        color: COLORS.ui.text,
    },
    filterChipTextActive: {
        color: COLORS.ui.background,
    },
    listContent: {
        flexGrow: 1,
    },
});