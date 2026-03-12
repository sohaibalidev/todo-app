import { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { RectButton, Swipeable } from 'react-native-gesture-handler';
import { Task, TaskStatus } from '../../types/database';
import { PriorityBadge } from '../ui/priority-badge';
import { StatusBadge } from '../ui/status-badge';
import { COLORS } from '../../constants/colors';

interface TaskItemProps {
    task: Task;
    projectName?: string;
    projectId?: string | null;
    onPress: () => void;
    onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
    onDelete: (taskId: string) => void;
    showProject?: boolean;
}

export const TaskItem = ({
    task,
    projectName,
    projectId,
    onPress,
    onStatusChange,
    onDelete,
    showProject = false,
}: TaskItemProps) => {
    const router = useRouter();
    const [isUpdating, setIsUpdating] = useState(false);
    const swipeableRef = useRef<Swipeable>(null);

    const getNextStatus = (currentStatus: TaskStatus): TaskStatus => {
        switch (currentStatus) {
            case 'todo':
                return 'in-progress';
            case 'in-progress':
                return 'done';
            case 'done':
                return 'todo';
        }
    };

    const handleStatusPress = async () => {
        if (isUpdating) return;

        setIsUpdating(true);
        const nextStatus = getNextStatus(task.status);
        await onStatusChange(task.id, nextStatus);
        setIsUpdating(false);
    };

    const handleDelete = () => {
        swipeableRef.current?.close();
        onDelete(task.id);
    };

    const handleProjectPress = () => {
        if (projectId) {
            router.push(`/(app)/project/${projectId}`);
        }
    };

    const getStatusIcon = (status: TaskStatus) => {
        switch (status) {
            case 'todo':
                return 'circle';
            case 'in-progress':
                return 'clock';
            case 'done':
                return 'check-circle';
        }
    };

    const getStatusColor = (status: TaskStatus) => {
        switch (status) {
            case 'todo':
                return COLORS.status.todo;
            case 'in-progress':
                return COLORS.status['in-progress'];
            case 'done':
                return COLORS.status.done;
        }
    };

    const renderRightActions = () => {
        return (
            <RectButton
                style={styles.deleteAction}
                onPress={handleDelete}
            >
                <Feather name="trash-2" size={24} color="#FFFFFF" />
                <Text style={styles.deleteActionText}>Delete</Text>
            </RectButton>
        );
    };

    const taskContent = (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={handleStatusPress}
                disabled={isUpdating}
                style={styles.statusButton}
            >
                <Feather
                    name={getStatusIcon(task.status)}
                    size={24}
                    color={getStatusColor(task.status)}
                />
            </TouchableOpacity>

            <View style={styles.content}>
                <View style={styles.header}>
                    <Text
                        style={[
                            styles.title,
                            task.status === 'done' && styles.completedTitle,
                        ]}
                        numberOfLines={1}
                    >
                        {task.title}
                    </Text>
                    <PriorityBadge priority={task.priority} size="small" />
                </View>

                {task.description ? (
                    <Text
                        style={[
                            styles.description,
                            task.status === 'done' && styles.completedDescription,
                        ]}
                        numberOfLines={2}
                    >
                        {task.description}
                    </Text>
                ) : null}

                <View style={styles.footer}>
                    <StatusBadge status={task.status} />

                    {showProject && projectName && (
                        <TouchableOpacity
                            style={styles.projectInfo}
                            onPress={handleProjectPress}
                            disabled={!projectId}
                        >
                            <Feather name="folder" size={12} color={COLORS.priority.medium} />
                            <Text style={styles.projectName}>
                                {projectName}
                            </Text>
                            <Feather name="chevron-right" size={12} color={COLORS.ui.textSecondary} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </View>
    );

    if (showProject) {
        return (
            <Swipeable
                ref={swipeableRef}
                renderRightActions={renderRightActions}
                overshootRight={false}
                rightThreshold={40}
            >
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={onPress}
                    onLongPress={() => { }} 
                    delayLongPress={500}
                >
                    {taskContent}
                </TouchableOpacity>
            </Swipeable>
        );
    }

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={onPress}
        >
            {taskContent}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: COLORS.ui.background,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.ui.border,
    },
    statusButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    content: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    title: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
        color: COLORS.ui.text,
        marginRight: 8,
    },
    completedTitle: {
        textDecorationLine: 'line-through',
        color: COLORS.ui.textSecondary,
    },
    description: {
        fontSize: 14,
        color: COLORS.ui.textSecondary,
        marginBottom: 8,
    },
    completedDescription: {
        textDecorationLine: 'line-through',
        color: COLORS.ui.textSecondary,
        opacity: 0.7,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    projectInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: COLORS.ui.card,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    projectName: {
        fontSize: 12,
        color: COLORS.priority.medium,
        fontWeight: '500',
    },
    deleteAction: {
        backgroundColor: COLORS.ui.error,
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
        height: '100%',
    },
    deleteActionText: {
        color: '#FFFFFF',
        fontSize: 12,
        marginTop: 4,
        fontWeight: '500',
    },
});