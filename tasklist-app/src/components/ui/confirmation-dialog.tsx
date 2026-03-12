import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../../constants/colors';

interface ConfirmationDialogProps {
    visible: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    destructive?: boolean;
}

export const ConfirmationDialog = ({
    visible,
    title,
    message,
    confirmText = 'Delete',
    cancelText = 'Cancel',
    onConfirm,
    onCancel,
    destructive = true,
}: ConfirmationDialogProps) => {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onCancel}
        >
            <View style={styles.overlay}>
                <View style={styles.dialog}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>

                    <View style={styles.buttons}>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={onCancel}
                        >
                            <Text style={styles.cancelText}>{cancelText}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.button,
                                destructive ? styles.destructiveButton : styles.confirmButton
                            ]}
                            onPress={onConfirm}
                        >
                            <Text style={destructive ? styles.destructiveText : styles.confirmText}>
                                {confirmText}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dialog: {
        backgroundColor: COLORS.ui.background,
        borderRadius: 14,
        padding: 20,
        width: '80%',
        maxWidth: 400,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.ui.text,
        marginBottom: 8,
    },
    message: {
        fontSize: 14,
        color: COLORS.ui.textSecondary,
        marginBottom: 20,
        lineHeight: 20,
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 8,
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        minWidth: 80,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: COLORS.ui.card,
    },
    destructiveButton: {
        backgroundColor: COLORS.ui.error,
    },
    confirmButton: {
        backgroundColor: COLORS.priority.medium,
    },
    cancelText: {
        color: COLORS.ui.text,
        fontWeight: '600',
    },
    destructiveText: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
    confirmText: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
});