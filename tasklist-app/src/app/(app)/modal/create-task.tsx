import { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useTasks } from '../../../hooks/use-tasks';
import { useProjects } from '../../../hooks/use-project';
import { TaskForm } from '../../../components/task/task-form';
import { LoadingSpinner } from '../../../components/ui/loading-spinner';
import { ErrorMessage } from '../../../components/ui/error-message';
import { COLORS } from '../../../constants/colors';
import { TaskInsert } from '../../../types/database';

export default function CreateTaskModal() {
    const router = useRouter();
    const { projectId, projectTitle } = useLocalSearchParams<{
        projectId?: string;
        projectTitle?: string;
    }>();

    const { projects, isLoading: projectsLoading, isError: projectsError } = useProjects();
    const { createTask, isCreating } = useTasks();

    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
        projectId || null
    );

    useEffect(() => {
        if (projectId) {
            setSelectedProjectId(projectId);
        }
    }, [projectId]);

    const handleSubmit = async (data: {
        title: string;
        description?: string;
        priority: 'low' | 'medium' | 'high';
        project_id: string | null;
    }) => {
        const newTask: TaskInsert = {
            title: data.title,
            description: data.description || null,
            priority: data.priority,
            project_id: data.project_id,
            status: 'todo',
        };

        await createTask(newTask);

        router.dismiss();
    };

    const handleClose = () => {
        router.dismiss();
    };

    if (projectsLoading) {
        return <LoadingSpinner fullScreen />;
    }

    if (projectsError) {
        return (
            <ErrorMessage
                message="Failed to load projects"
                onRetry={() => { }}
                fullScreen
            />
        );
    }

    return (
        <>
            <Stack.Screen
                options={{
                    title: 'Create Task',
                    presentation: 'modal',
                    headerLeft: () => (
                        <TouchableOpacity onPress={handleClose}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                    ),
                }}
            />
            <View style={styles.container}>
                <TaskForm
                    visible={true}
                    onClose={handleClose}
                    onSubmit={handleSubmit}
                    projects={projects}
                    selectedProjectId={selectedProjectId}
                />
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.ui.background,
    },
    cancelText: {
        color: COLORS.ui.error,
        fontSize: 16,
        marginLeft: 16,
    },
});