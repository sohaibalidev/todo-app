import { PostgrestError } from '@supabase/supabase-js';

export type AppError = {
    message: string;
    code?: string;
    details?: string;
};

export const handleServiceError = (error: unknown): AppError => {
    if (error && typeof error === 'object' && 'message' in error) {
        const supabaseError = error as PostgrestError;

        switch (supabaseError.code) {
            case '23505': 
                return {
                    message: 'This item already exists.',
                    code: supabaseError.code,
                    details: supabaseError.details,
                };
            case '23503':
                return {
                    message: 'Cannot delete because related items exist.',
                    code: supabaseError.code,
                    details: supabaseError.details,
                };
            case '42P01':
                return {
                    message: 'Database configuration error.',
                    code: supabaseError.code,
                };
            default:
                return {
                    message: supabaseError.message || 'An unexpected error occurred.',
                    code: supabaseError.code,
                };
        }
    }

    if (error instanceof Error && error.message === 'Network request failed') {
        return {
            message: 'Network connection lost. Please check your internet.',
            code: 'NETWORK_ERROR',
        };
    }

    return {
        message: error instanceof Error ? error.message : 'An unexpected error occurred.',
    };
};

export const getUserFriendlyErrorMessage = (error: unknown): string => {
    const appError = handleServiceError(error);

    switch (appError.code) {
        case 'NETWORK_ERROR':
            return 'Unable to connect. Please check your internet connection.';
        case '23505':
            return 'This name is already taken. Please choose another.';
        default:
            return appError.message;
    }
};