import {
    Briefcase,
    Home,
    ShoppingCart,
    BookOpen,
    Heart,
} from 'lucide-react-native';
import { ComponentType } from 'react';
import { LucideProps } from 'lucide-react-native';

export interface ProjectIcon {
    id: string;
    name: string;
    icon: ComponentType<LucideProps>;
    color: string;
}

export const PROJECT_ICONS: ProjectIcon[] = [
    {
        id: 'briefcase',
        name: 'Work',
        icon: Briefcase,
        color: '#4A6FA5',
    },
    {
        id: 'home',
        name: 'Personal',
        icon: Home,
        color: '#4CAF50',
    },
    {
        id: 'shopping-cart',
        name: 'Shopping',
        icon: ShoppingCart,
        color: '#FF9800',
    },
    {
        id: 'book-open',
        name: 'Learning',
        icon: BookOpen,
        color: '#9C27B0',
    },
    {
        id: 'heart',
        name: 'Health',
        icon: Heart,
        color: '#F44336',
    },
];

export type ProjectIconId = string;


export const getProjectIcon = (iconId: string): ComponentType<LucideProps> => {
    return PROJECT_ICONS.find(icon => icon.id === iconId)?.icon || Briefcase;
};

export const getProjectIconColor = (iconId: string): string => {
    return PROJECT_ICONS.find(icon => icon.id === iconId)?.color || '#4A6FA5';
};