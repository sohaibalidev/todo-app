import { supabase } from '../lib/supabase';
import { Task, TaskInsert, TaskUpdate, TaskStatus, TaskPriority } from '../types/database';
import { handleServiceError } from '../utils/error-handler';

export const taskService = {
    async getTasks(): Promise<Task[]> {
        try {
            const { data, error } = await supabase
                .from('tasks')
                .select(`
        *,
        projects (
          id,
          title,
          icon_name
        )
      `).order('created_at', { ascending: false });

            if (error) throw error;
            return data || [];
        } catch (error) {
            throw handleServiceError(error);
        }
    },

    async getTasksByProject(projectId: string): Promise<Task[]> {
        try {
            const { data, error } = await supabase
                .from('tasks')
                .select('*')
                .eq('project_id', projectId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data || [];
        } catch (error) {
            throw handleServiceError(error);
        }
    },

    async getTasksByPriority(priority: TaskPriority): Promise<Task[]> {
        try {
            const { data, error } = await supabase
                .from('tasks')
                .select(`
          *,
          projects (
            id,
            title,
            icon_name
          )
        `)
                .eq('priority', priority)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data || [];
        } catch (error) {
            throw handleServiceError(error);
        }
    },

    async getTasksByStatus(status: TaskStatus): Promise<Task[]> {
        try {
            const { data, error } = await supabase
                .from('tasks')
                .select(`
          *,
          projects (
            id,
            title,
            icon_name
          )
        `)
                .eq('status', status)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data || [];
        } catch (error) {
            throw handleServiceError(error);
        }
    },

    async searchTasks(searchTerm: string): Promise<Task[]> {
        try {
            const { data, error } = await supabase
                .from('tasks')
                .select(`
          *,
          projects (
            id,
            title,
            icon_name
          )
        `)
                .ilike('title', `%${searchTerm}%`)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data || [];
        } catch (error) {
            throw handleServiceError(error);
        }
    },

    async createTask(task: TaskInsert): Promise<Task> {
        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                throw new Error('No authenticated user');
            }

            const { data, error } = await supabase
                .from('tasks')
                .insert([{
                    title: task.title,
                    description: task.description,
                    status: task.status,
                    priority: task.priority,
                    project_id: task.project_id,
                    user_id: user.id,
                }])
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            throw handleServiceError(error);
        }
    },

    async updateTask(task: TaskUpdate): Promise<Task> {
        try {
            const { data, error } = await supabase
                .from('tasks')
                .update(task)
                .eq('id', task.id)
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            throw handleServiceError(error);
        }
    },

    async deleteTask(id: string): Promise<void> {
        try {
            const { error } = await supabase
                .from('tasks')
                .delete()
                .eq('id', id);

            if (error) throw error;
        } catch (error) {
            throw handleServiceError(error);
        }
    },

    async getTaskStats(): Promise<{
        total: number;
        completed: number;
        pending: number;
        byPriority: Record<TaskPriority, number>;
    }> {
        try {
            const { data, error } = await supabase
                .from('tasks')
                .select('status, priority');

            if (error) throw error;

            const stats = {
                total: data.length,
                completed: data.filter(t => t.status === 'done').length,
                todo: data.filter(t => t.status === 'todo').length,
                pending: data.filter(t => t.status === 'in-progress').length,
                byPriority: {
                    low: data.filter(t => t.priority === 'low').length,
                    medium: data.filter(t => t.priority === 'medium').length,
                    high: data.filter(t => t.priority === 'high').length,
                }
            };

            return stats;
        } catch (error) {
            throw handleServiceError(error);
        }
    }
};
