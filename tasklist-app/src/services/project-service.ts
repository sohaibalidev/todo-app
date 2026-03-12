import { supabase } from '../lib/supabase';
import { Project, ProjectInsert, ProjectUpdate } from '../types/database';
import { handleServiceError } from '../utils/error-handler';

export const projectService = {
    async getProjects(): Promise<Project[]> {
        try {
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data || [];
        } catch (error) {
            throw handleServiceError(error);
        }
    },

    async getProjectById(id: string): Promise<Project | null> {
        try {
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            throw handleServiceError(error);
        }
    },

    async createProject(project: ProjectInsert): Promise<Project> {
        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                throw new Error('No authenticated user');
            }

            const { data, error } = await supabase
                .from('projects')
                .insert([{
                    title: project.title,
                    icon_name: project.icon_name,
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

    async updateProject(project: ProjectUpdate): Promise<Project> {
        try {
            const { data, error } = await supabase
                .from('projects')
                .update(project)
                .eq('id', project.id)
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            throw handleServiceError(error);
        }
    },

    async deleteProject(id: string): Promise<void> {
        try {
            const { error } = await supabase
                .from('projects')
                .delete()
                .eq('id', id);

            if (error) throw error;
        } catch (error) {
            throw handleServiceError(error);
        }
    },

    async getProjectsWithTaskCount(): Promise<(Project & { task_count: number })[]> {
        try {
            const { data, error } = await supabase
                .from('projects')
                .select(`
          *,
          tasks!left (count)
        `)
                .order('created_at', { ascending: false });

            if (error) throw error;

            return (data || []).map(project => ({
                ...project,
                task_count: project.tasks?.[0]?.count || 0
            }));
        } catch (error) {
            throw handleServiceError(error);
        }
    }
};
