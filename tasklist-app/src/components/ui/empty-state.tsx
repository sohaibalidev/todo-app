import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';

interface EmptyStateProps {
    icon?: keyof typeof Feather.glyphMap;
    title: string;
    message?: string;
}

export const EmptyState = ({
    icon = 'inbox',
    title,
    message
}: EmptyStateProps) => {
    return (
        <View style={styles.container}>
            <Feather name={icon} size={64} color={COLORS.ui.textSecondary} />
            <Text style={styles.title}>{title}</Text>
            {message && <Text style={styles.message}>{message}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.ui.text,
        marginTop: 16,
        marginBottom: 8,
        textAlign: 'center',
    },
    message: {
        fontSize: 14,
        color: COLORS.ui.textSecondary,
        textAlign: 'center',
        lineHeight: 20,
    },
});