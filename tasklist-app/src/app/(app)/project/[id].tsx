import { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProject, useProjects } from '../../../hooks/use-project';
import { useTasks, useTasksByFilter } from '../../../hooks/use-tasks';
import { TaskList } from '../../../components/task/task-list';
import { LoadingSpinner } from '../../../components/ui/loading-spinner';
import { ErrorMessage } from '../../../components/ui/error-message';
import { ConfirmationDialog } from '../../../components/ui/confirmation-dialog';
import { ProjectForm } from '../../../components/project/project-form';
import { COLORS } from '../../../constants/colors';
import { getProjectIcon, getProjectIconColor } from '../../../constants/icons';

export default function ProjectDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { updateTaskStatus, deleteTask } = useTasks();
    const { updateProject, deleteProject, isUpdating, isDeleting } = useProjects();
    const router = useRouter();
    const [showEditForm, setShowEditForm] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const {
        data: project,
        isLoading: projectLoading,
        error: projectError,
        refetch: refetchProject
    } = useProject(id);

    useEffect(() => {
        if (!projectLoading && !project) {
            Alert.alert(
                "Project Not Found",
                "This project may have been deleted.",
                [{ text: "OK", onPress: () => router.back() }]
            );
        }
    }, [project, projectLoading]);

    const {
        data: tasks = [],
        isLoading: tasksLoading,
        error: tasksError,
        refetch: refetchTasks,
    } = useTasksByFilter('project', id);

    const IconComponent = project ? getProjectIcon(project.icon_name) : null;
    const iconColor = project ? getProjectIconColor(project.icon_name) : COLORS.ui.text;

    const handleEditProject = () => {
        setShowEditForm(true);
    };

    const handleDeleteProject = () => {
        setShowDeleteDialog(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await deleteProject(id);
            setShowDeleteDialog(false);
            if (router.canGoBack()) {
                router.back();
            } else {
                router.replace('/(app)');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to delete project');
        }
    };

    const handleUpdateProject = async (data: { title: string; icon_name: string }) => {
        try {
            await updateProject({
                id: project!.id,
                title: data.title,
                icon_name: data.icon_name,
            });
            setShowEditForm(false);
        } catch (error) {
            Alert.alert('Error', 'Failed to update project');
        }
    };

    if (projectLoading || tasksLoading) {
        return <LoadingSpinner fullScreen />;
    }

    if (projectError || tasksError) {
        return (
            <ErrorMessage
                message="Failed to load project details"
                onRetry={() => {
                    refetchProject();
                    refetchTasks();
                }}
                fullScreen
            />
        );
    }

    if (!project) {
        return (
            <View style={styles.notFound}>
                <Feather name="folder" size={64} color={COLORS.ui.textSecondary} />
                <Text style={styles.notFoundTitle}>Project not found</Text>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Text style={styles.backButtonText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <Stack.Screen
                options={{
                    headerShown: true,
                    headerTitle: '',
                    headerLeft: () => (
                        <TouchableOpacity
                            onPress={() => {
                                if (router.canGoBack()) {
                                    router.back();
                                } else {
                                    router.replace('/(app)');
                                }
                            }}
                            style={styles.headerButton}
                        >
                            <Feather name="arrow-left" size={24} color={COLORS.ui.text} />
                        </TouchableOpacity>
                    ),
                    headerRight: () => (
                        <View style={styles.headerButtons}>
                            <TouchableOpacity
                                onPress={handleEditProject}
                                style={styles.headerButton}
                                disabled={isUpdating}
                            >
                                <Feather
                                    name="edit-2"
                                    size={20}
                                    color={isUpdating ? COLORS.ui.textSecondary : COLORS.ui.text}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleDeleteProject}
                                style={styles.headerButton}
                                disabled={isDeleting}
                            >
                                <Feather
                                    name="trash-2"
                                    size={20}
                                    color={isDeleting ? COLORS.ui.textSecondary : COLORS.ui.error}
                                />
                            </TouchableOpacity>
                        </View>
                    ),
                }}
            />

            <View style={styles.header}>
                <View style={[styles.iconContainer, { backgroundColor: iconColor + '20' }]}>
                    {IconComponent && <IconComponent size={40} color={iconColor} />}
                </View>
                <View style={styles.headerInfo}>
                    <Text style={styles.projectTitle}>{project.title}</Text>
                    <Text style={styles.taskCount}>
                        {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
                    </Text>
                </View>
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
                emptyStateProps={{
                    icon: 'check-square',
                    title: 'No tasks yet',
                    message: 'Create your first task in this project',
                }}
            />

            {project && (
                <ProjectForm
                    visible={showEditForm}
                    onClose={() => setShowEditForm(false)}
                    onSubmit={handleUpdateProject}
                    initialData={project}
                    isEditing
                />
            )}

            <ConfirmationDialog
                visible={showDeleteDialog}
                title="Delete Project"
                message={`Are you sure you want to delete "${project.title}"? All tasks inside this project will also be deleted.`}
                onConfirm={handleConfirmDelete}
                onCancel={() => setShowDeleteDialog(false)}
                destructive
            />

            <TouchableOpacity
                style={styles.fab}
                onPress={() => {
                    router.push({
                        pathname: '/(app)/modal/create-task',
                        params: {
                            projectId: project.id,
                            projectTitle: project.title
                        }
                    });
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
    headerButton: {
        padding: 8,
        marginHorizontal: 4,
    },
    headerButtons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.ui.border,
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    headerInfo: {
        flex: 1,
    },
    projectTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: COLORS.ui.text,
        marginBottom: 4,
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
    notFound: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    notFoundTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.ui.text,
        marginTop: 16,
        marginBottom: 12,
    },
    backButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: COLORS.ui.card,
        borderRadius: 8,
    },
    backButtonText: {
        color: COLORS.ui.text,
        fontSize: 14,
        fontWeight: '500',
    },
});