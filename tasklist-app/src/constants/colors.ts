export const COLORS = {
    priority: {
        high: '#FF3B30', 
        medium: '#FF9F0A', 
        low: '#34C759', 
    },

    status: {
        todo: '#8E8E93', 
        'in-progress': '#007AFF', 
        done: '#34C759', 
    },

    ui: {
        background: '#FFFFFF',
        card: '#F2F2F7',
        text: '#000000',
        textSecondary: '#8E8E93',
        border: '#E5E5EA',
        error: '#FF3B30',
        success: '#34C759',
    },

    projectBg: {
        briefcase: '#E8EEF5',
        home: '#E8F5E9',
        'shopping-cart': '#FFF3E0',
        'book-open': '#F3E5F5',
        heart: '#FFEBEE',
    },
} as const;

export type PriorityColor = keyof typeof COLORS.priority;
export type StatusColor = keyof typeof COLORS.status;