import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';

interface ErrorMessageProps {
    message: string;
    onRetry?: () => void;
    fullScreen?: boolean;
}

export const ErrorMessage = ({
    message,
    onRetry,
    fullScreen = false
}: ErrorMessageProps) => {
    const content = (
        <View style={styles.content}>
            <Feather name="alert-circle" size={48} color={COLORS.ui.error} />
            <Text style={styles.message}>{message}</Text>
            {onRetry && (
                <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
                    <Text style={styles.retryText}>Try Again</Text>
                </TouchableOpacity>
            )}
        </View>
    );

    if (fullScreen) {
        return <View style={styles.fullScreenContainer}>{content}</View>;
    }

    return <View style={styles.container}>{content}</View>;
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        alignItems: 'center',
    },
    fullScreenContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.ui.background,
    },
    content: {
        alignItems: 'center',
        gap: 12,
    },
    message: {
        fontSize: 16,
        color: COLORS.ui.textSecondary,
        textAlign: 'center',
        marginBottom: 8,
    },
    retryButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: COLORS.ui.card,
        borderRadius: 8,
    },
    retryText: {
        color: COLORS.ui.text,
        fontSize: 14,
        fontWeight: '600',
    },
});