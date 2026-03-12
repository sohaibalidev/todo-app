import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { TaskPriority } from '../../types/database';

interface PriorityBadgeProps {
    priority: TaskPriority;
    size?: 'small' | 'medium';
}

export const PriorityBadge = ({ priority, size = 'medium' }: PriorityBadgeProps) => {
    const color = COLORS.priority[priority];
    const text = priority.charAt(0).toUpperCase() + priority.slice(1);

    return (
        <View style={[
            styles.badge,
            { backgroundColor: color + '20' }, 
            size === 'small' ? styles.smallBadge : styles.mediumBadge,
        ]}>
            <View style={[styles.dot, { backgroundColor: color }]} />
            <Text style={[
                styles.text,
                { color },
                size === 'small' ? styles.smallText : styles.mediumText,
            ]}>
                {text}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 100,
        alignSelf: 'flex-start',
    },
    smallBadge: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        gap: 4,
    },
    mediumBadge: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        gap: 6,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    text: {
        fontWeight: '500',
    },
    smallText: {
        fontSize: 12,
    },
    mediumText: {
        fontSize: 14,
    },
});