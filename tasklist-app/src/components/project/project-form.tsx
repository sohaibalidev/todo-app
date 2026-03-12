import { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Modal,
    FlatList,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { PROJECT_ICONS, ProjectIcon } from '../../constants/icons';
import { COLORS } from '../../constants/colors';
import { Project } from '../../types/database';

interface ProjectFormProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (data: { title: string; icon_name: string }) => void;
    initialData?: Project;
    isEditing?: boolean;
}

export const ProjectForm = ({
    visible,
    onClose,
    onSubmit,
    initialData,
    isEditing = false,
}: ProjectFormProps) => {
    const [title, setTitle] = useState(initialData?.title || '');
    const [selectedIcon, setSelectedIcon] = useState(
        initialData?.icon_name || PROJECT_ICONS[0].id
    );
    const [showIconPicker, setShowIconPicker] = useState(false);

    const handleSubmit = () => {
        if (!title.trim()) return;

        onSubmit({
            title: title.trim(),
            icon_name: selectedIcon,
        });

        setTitle('');
        setSelectedIcon(PROJECT_ICONS[0].id);
        onClose();
    };

    const renderIconItem = ({ item }: { item: ProjectIcon }) => {
        const IconComponent = item.icon;
        const isSelected = selectedIcon === item.id;

        return (
            <TouchableOpacity
                style={[
                    styles.iconItem,
                    isSelected && styles.selectedIconItem,
                ]}
                onPress={() => {
                    setSelectedIcon(item.id);
                    setShowIconPicker(false);
                }}
            >
                <IconComponent
                    size={32}
                    color={isSelected ? COLORS.ui.background : item.color}
                />
                <Text style={[
                    styles.iconItemName, 
                    isSelected && styles.selectedIconItemName, 
                ]}>
                    {item.name}
                </Text>
            </TouchableOpacity>
        );
    };

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
                            {isEditing ? 'Edit Project' : 'New Project'}
                        </Text>
                        <TouchableOpacity onPress={onClose}>
                            <Feather name="x" size={24} color={COLORS.ui.text} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Project Name</Text>
                        <TextInput
                            style={styles.input}
                            value={title}
                            onChangeText={setTitle}
                            placeholder="e.g., Work, Personal, Shopping"
                            placeholderTextColor={COLORS.ui.textSecondary}
                            autoFocus
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Project Icon</Text>
                        <TouchableOpacity
                            style={styles.iconSelector}
                            onPress={() => setShowIconPicker(true)}
                        >
                            {(() => {
                                const selectedIconData = PROJECT_ICONS.find(i => i.id === selectedIcon);
                                const IconComponent = selectedIconData?.icon;
                                return (
                                    <>
                                        <View style={styles.selectedIconPreview}>
                                            {IconComponent && selectedIconData && (
                                                <>
                                                    <IconComponent size={24} color={selectedIconData.color} />
                                                    <Text style={styles.selectedIconName}>
                                                        {selectedIconData.name}
                                                    </Text>
                                                </>
                                            )}
                                        </View>
                                        <Feather name="chevron-down" size={20} color={COLORS.ui.textSecondary} />
                                    </>
                                );
                            })()}
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={[styles.submitButton, !title.trim() && styles.submitButtonDisabled]}
                        onPress={handleSubmit}
                        disabled={!title.trim()}
                    >
                        <Text style={styles.submitButtonText}>
                            {isEditing ? 'Update Project' : 'Create Project'}
                        </Text>
                    </TouchableOpacity>
                </View>

                <Modal
                    visible={showIconPicker}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={() => setShowIconPicker(false)}
                >
                    <View style={styles.iconPickerModal}>
                        <View style={styles.iconPickerContent}>
                            <View style={styles.iconPickerHeader}>
                                <Text style={styles.iconPickerTitle}>Choose an Icon</Text>
                                <TouchableOpacity onPress={() => setShowIconPicker(false)}>
                                    <Feather name="x" size={24} color={COLORS.ui.text} />
                                </TouchableOpacity>
                            </View>

                            <FlatList
                                data={PROJECT_ICONS}
                                renderItem={renderIconItem}
                                keyExtractor={(item) => item.id}
                                numColumns={2}
                                contentContainerStyle={styles.iconList}
                            />
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
        minHeight: 400,
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
    input: {
        borderWidth: 1,
        borderColor: COLORS.ui.border,
        borderRadius: 12,
        padding: 12,
        fontSize: 16,
        color: COLORS.ui.text,
        backgroundColor: COLORS.ui.card,
    },
    iconSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: COLORS.ui.border,
        borderRadius: 12,
        padding: 12,
        backgroundColor: COLORS.ui.card,
    },
    selectedIconPreview: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    selectedIconName: {
        fontSize: 16,
        color: COLORS.ui.text,
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
    iconPickerModal: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    iconPickerContent: {
        backgroundColor: COLORS.ui.background,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '80%',
    },
    iconPickerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.ui.border,
    },
    iconPickerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.ui.text,
    },
    iconList: {
        padding: 20,
    },
    iconItem: {
        flex: 1,
        alignItems: 'center',
        padding: 16,
        margin: 8,
        borderRadius: 12,
        backgroundColor: COLORS.ui.card,
    },
    selectedIconItem: {
        backgroundColor: COLORS.priority.medium,
    },
    iconItemName: {
        marginTop: 8,
        fontSize: 14,
        color: COLORS.ui.text,
    },
    selectedIconItemName: { 
        color: COLORS.ui.background,
    },
});