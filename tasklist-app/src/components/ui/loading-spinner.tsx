import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';

interface LoadingSpinnerProps {
    size?: 'small' | 'large';
    color?: string;
    fullScreen?: boolean;
}

export const LoadingSpinner = ({
    size = 'large',
    color = COLORS.ui.text,
    fullScreen = false
}: LoadingSpinnerProps) => {
    if (fullScreen) {
        return (
            <View style={styles.fullScreenContainer}>
                <ActivityIndicator size={size} color={color} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ActivityIndicator size={size} color={color} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    fullScreenContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.ui.background,
    },
});