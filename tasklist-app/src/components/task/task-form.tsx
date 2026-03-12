import { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Modal,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Task, TaskPriority, TaskStatus, Project } from '../../types/database';
import { COLORS } from '../../constants/colors';
import { PriorityBadge } from '../ui/priority-badge';

interface TaskFormProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (data: {
        title: string;
        description?: string;
        priority: TaskPriority;
        project_id: string | null;
    }) => void;
    initialData?: Task;
    projects: Project[];
    selectedProjectId?: string | null;
    isEditing?: boolean;
}

const PRIORITY_OPTIONS: TaskPriority[] = ['low', 'medium', 'high'];

export const TaskForm = ({
    visible,
    onClose,
    onSubmit,
    initialData,
    projects,
    selectedProjectId,
    isEditing = false,
}: TaskFormProps) => {
    const [title, setTitle] = useState(initialData?.title || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const [priority, setPriority] = useState<TaskPriority>(initialData?.priority || 'medium');
    const [projectId, setProjectId] = useState<string | null>(
        initialData?.project_id || selectedProjectId || null
    );
    const [showProjectPicker, setShowProjectPicker] = useState(false);

    useEffect(() => {
        if (visible) {
            setTitle(initialData?.title || '');
            setDescription(initialData?.description || '');
            setPriority(initialData?.priority || 'medium');
            setProjectId(initialData?.project_id || selectedProjectId || null);
        }
    }, [visible, initialData, selectedProjectId]);

    const handleSubmit = () => {
        if (!title.trim()) return;

        onSubmit({
            title: title.trim(),
            description: description.trim() || undefined,
            priority,
            project_id: projectId,
        });

        setTitle('');
        setDescription('');
        setPriority('medium');
        setProjectId(null);
        onClose(); 
    };

    const selectedProject = projects.find(p => p.id === projectId);

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.modalContainer}
            >
                <View style={styles.modalContent}>
                    <View style={styles.header}>
                        <Text style={styles.title}>
                            {isEditing ? 'Edit Task' : 'New Task'}
                        </Text>
                        <TouchableOpacity onPress={onClose}>
                            <Feather name="x" size={24} color={COLORS.ui.text} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Title <Text style={styles.required}>*</Text></Text>
                            <TextInput
                                style={styles.input}
                                value={title}
                                onChangeText={setTitle}
                                placeholder="Enter task title"
                                placeholderTextColor={COLORS.ui.textSecondary}
                                autoFocus
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Description (Optional)</Text>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                value={description}
                                onChangeText={setDescription}
                                placeholder="Add more details about this task"
                                placeholderTextColor={COLORS.ui.textSecondary}
                                multiline
                                numberOfLines={3}
                                textAlignVertical="top"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Priority</Text>
                            <View style={styles.priorityContainer}>
                                {PRIORITY_OPTIONS.map((p) => (
                                    <TouchableOpacity
                                        key={p}
                                        style={[
                                            styles.priorityOption,
                                            priority === p && styles.priorityOptionSelected,
                                            { borderColor: COLORS.priority[p] },
                                        ]}
                                        onPress={() => setPriority(p)}
                                    >
                                        <PriorityBadge priority={p} size="medium" />
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Project (Optional)</Text>
                            <TouchableOpacity
                                style={styles.projectSelector}
                                onPress={() => setShowProjectPicker(true)}
                            >
                                {selectedProject ? (
                                    <View style={styles.selectedProject}>
                                        <Text style={styles.selectedProjectText}>
                                            {selectedProject.title}
                                        </Text>
                                    </View>
                                ) : (
                                    <Text style={styles.placeholderText}>
                                        Select a project
                                    </Text>
                                )}
                                <Feather name="chevron-down" size={20} color={COLORS.ui.textSecondary} />
                            </TouchableOpacity>
                        </View>
                    </ScrollView>

                    <TouchableOpacity
                        style={[styles.submitButton, !title.trim() && styles.submitButtonDisabled]}
                        onPress={handleSubmit}
                        disabled={!title.trim()}
                    >
                        <Text style={styles.submitButtonText}>
                            {isEditing ? 'Update Task' : 'Create Task'}
                        </Text>
                    </TouchableOpacity>
                </View>

                <Modal
                    visible={showProjectPicker}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={() => setShowProjectPicker(false)}
                >
                    <View style={styles.pickerModal}>
                        <View style={styles.pickerContent}>
                            <View style={styles.pickerHeader}>
                                <Text style={styles.pickerTitle}>Select Project</Text>
                                <TouchableOpacity onPress={() => setShowProjectPicker(false)}>
                                    <Feather name="x" size={24} color={COLORS.ui.text} />
                                </TouchableOpacity>
                            </View>

                            <ScrollView>
                                <TouchableOpacity
                                    style={styles.projectItem}
                                    onPress={() => {
                                        setProjectId(null);
                                        setShowProjectPicker(false);
                                    }}
                                >
                                    <View style={[styles.projectIcon, { backgroundColor: COLORS.ui.card }]}>
                                        <Feather name="inbox" size={20} color={COLORS.ui.textSecondary} />
                                    </View>
                                    <View style={styles.projectInfo}>
                                        <Text style={styles.projectTitle}>No Project</Text>
                                        <Text style={styles.projectSubtitle}>Tasks without a project</Text>
                                    </View>
                                    {projectId === null && (
                                        <Feather name="check" size={20} color={COLORS.priority.medium} />
                                    )}
                                </TouchableOpacity>

                                {projects.map((project) => (
                                    <TouchableOpacity
                                        key={project.id}
                                        style={styles.projectItem}
                                        onPress={() => {
                                            setProjectId(project.id);
                                            setShowProjectPicker(false);
                                        }}
                                    >
                                        <View style={[styles.projectIcon, { backgroundColor: COLORS.ui.card }]}>
                                            <Feather name="folder" size={20} color={COLORS.ui.text} />
                                        </View>
                                        <View style={styles.projectInfo}>
                                            <Text style={styles.projectTitle}>{project.title}</Text>
                                        </View>
                                        {projectId === project.id && (
                                            <Feather name="check" size={20} color={COLORS.priority.medium} />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    </View>
                </Modal>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: COLORS.ui.background,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        maxHeight: '90%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        color: COLORS.ui.text,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: COLORS.ui.textSecondary,
        marginBottom: 8,
    },
    required: {
        color: COLORS.ui.error,
    },
    input: {
        borderWidth: 1,
        borderColor: COLORS.ui.border,
        borderRadius: 12,
        padding: 12,
        fontSize: 16,
        color: COLORS.ui.text,
        backgroundColor: COLORS.ui.background,
    },
    textArea: {
        minHeight: 80,
        textAlignVertical: 'top',
    },
    priorityContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    priorityOption: {
        flex: 1,
        borderWidth: 2,
        borderRadius: 12,
        padding: 8,
        alignItems: 'center',
    },
    priorityOptionSelected: {
        backgroundColor: COLORS.ui.card,
    },
    projectSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: COLORS.ui.border,
        borderRadius: 12,
        padding: 12,
        backgroundColor: COLORS.ui.background,
    },
    selectedProject: {
        flex: 1,
    },
    selectedProjectText: {
        fontSize: 16,
        color: COLORS.ui.text,
    },
    placeholderText: {
        fontSize: 16,
        color: COLORS.ui.textSecondary,
    },
    submitButton: {
        backgroundColor: COLORS.priority.medium,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 20,
    },
    submitButtonDisabled: {
        opacity: 0.5,
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    pickerModal: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    pickerContent: {
        backgroundColor: COLORS.ui.background,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '80%',
    },
    pickerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.ui.border,
    },
    pickerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.ui.text,
    },
    projectItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.ui.border,
    },
    projectIcon: {
        width: 40,
        height: 40,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    projectInfo: {
        flex: 1,
    },
    projectTitle: {
        fontSize: 16,
        color: COLORS.ui.text,
        marginBottom: 4,
    },
    projectSubtitle: {
        fontSize: 12,
        color: COLORS.ui.textSecondary,
    },
});