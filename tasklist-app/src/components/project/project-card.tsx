import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Project } from '../../types/database';
import { getProjectIcon, getProjectIconColor } from '../../constants/icons';
import { COLORS } from '../../constants/colors';
import { Feather } from '@expo/vector-icons';

interface ProjectCardProps {
    project: Project;
    taskCount?: number;
    onPress: () => void;
    onLongPress?: () => void;
}

export const ProjectCard = ({
    project,
    taskCount = 0,
    onPress,
    onLongPress
}: ProjectCardProps) => {
    const IconComponent = getProjectIcon(project.icon_name as any);
    const iconColor = getProjectIconColor(project.icon_name as any);
    const iconBgColor = COLORS.projectBg[project.icon_name as keyof typeof COLORS.projectBg] || COLORS.ui.card;

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={onPress}
            onLongPress={onLongPress}
            delayLongPress={500}
            activeOpacity={0.7}
        >
            <View style={[styles.iconContainer, { backgroundColor: iconBgColor }]}>
                <IconComponent size={24} color={iconColor} />
            </View>

            <View style={styles.content}>
                <Text style={styles.title} numberOfLines={1}>
                    {project.title}
                </Text>
                <View style={styles.taskInfo}>
                    <Feather name="check-circle" size={14} color={COLORS.ui.textSecondary} />
                    <Text style={styles.taskCount}>
                        {taskCount} {taskCount === 1 ? 'task' : 'tasks'}
                    </Text>
                </View>
            </View>

            <Feather name="chevron-right" size={20} color={COLORS.ui.textSecondary} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: COLORS.ui.card,
        borderRadius: 12,
        marginBottom: 8,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    content: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.ui.text,
        marginBottom: 4,
    },
    taskInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    taskCount: {
        fontSize: 14,
        color: COLORS.ui.textSecondary,
    },
});