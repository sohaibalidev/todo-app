import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectService } from '../services/project-service';
import { ProjectInsert, ProjectUpdate, Project } from '../types/database';
import { getUserFriendlyErrorMessage } from '../utils/error-handler';
import { Alert } from 'react-native';

export const projectKeys = {
    all: ['projects'] as const,
    lists: () => [...projectKeys.all, 'list'] as const,
    list: (filters: string) => [...projectKeys.lists(), { filters }] as const,
    details: () => [...projectKeys.all, 'detail'] as const,
    detail: (id: string) => [...projectKeys.details(), id] as const,
};

export const useProjects = () => {
    const queryClient = useQueryClient();

    const projectsQuery = useQuery({
        queryKey: projectKeys.lists(),
        queryFn: projectService.getProjects,
    });

    const projectsWithCountQuery = useQuery({
        queryKey: [...projectKeys.lists(), 'with-count'],
        queryFn: projectService.getProjectsWithTaskCount,
    });

    const createProject = useMutation({
        mutationFn: (newProject: ProjectInsert) =>
            projectService.createProject(newProject),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
        },
        onError: (error) => {
            Alert.alert('Error', getUserFriendlyErrorMessage(error));
        },
    });

    const updateProject = useMutation({
        mutationFn: (project: ProjectUpdate) =>
            projectService.updateProject(project),
        onSuccess: (updatedProject) => {
            queryClient.setQueryData(
                projectKeys.detail(updatedProject.id),
                updatedProject
            );
            queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
        },
        onError: (error) => {
            Alert.alert('Error', getUserFriendlyErrorMessage(error));
        },
    });

    const deleteProject = useMutation({
        mutationFn: (id: string) => projectService.deleteProject(id),
        onSuccess: (_, deletedId) => {
            queryClient.removeQueries({ queryKey: projectKeys.detail(deletedId) });
            queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
        onError: (error) => {
            Alert.alert('Error', getUserFriendlyErrorMessage(error));
        },
    });

    return {
        projects: projectsQuery.data ?? [],
        isLoading: projectsQuery.isLoading,
        isError: projectsQuery.isError,
        error: projectsQuery.error,
        refetch: projectsQuery.refetch,

        projectsWithCount: projectsWithCountQuery.data ?? [],
        isLoadingWithCount: projectsWithCountQuery.isLoading,

        createProject: createProject.mutate,
        updateProject: updateProject.mutate,
        deleteProject: deleteProject.mutate,

        isCreating: createProject.isPending,
        isUpdating: updateProject.isPending,
        isDeleting: deleteProject.isPending,
    };
};

export const useProject = (id: string) => {
    const queryClient = useQueryClient();

    return useQuery({
        queryKey: projectKeys.detail(id),
        queryFn: () => projectService.getProjectById(id),
        enabled: !!id,
        initialData: () => {
            const projects = queryClient.getQueryData<Project[]>(projectKeys.lists());
            return projects?.find(p => p.id === id);
        },
    });
};
