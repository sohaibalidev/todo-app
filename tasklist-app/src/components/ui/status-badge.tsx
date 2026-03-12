import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { TaskStatus } from '../../types/database';

interface StatusBadgeProps {
    status: TaskStatus;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
    const color = COLORS.status[status];
    const text = status === 'in-progress' ? 'In Progress' :
        status.charAt(0).toUpperCase() + status.slice(1);

    return (
        <View style={[styles.badge, { backgroundColor: color + '20' }]}>
            <Text style={[styles.text, { color }]}>{text}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    badge: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 100,
        alignSelf: 'flex-start',
    },
    text: {
        fontSize: 12,
        fontWeight: '500',
    },
});