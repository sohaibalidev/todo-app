import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../../context/auth-context';
import { useProjects } from '../../hooks/use-project';
import { useTasks } from '../../hooks/use-tasks';
import { useModal } from '../../context/modal-context';
import { ProjectCard } from '../../components/project/project-card';
import { LoadingSpinner } from '../../components/ui/loading-spinner';
import { ErrorMessage } from '../../components/ui/error-message';
import { EmptyState } from '../../components/ui/empty-state';
import { ConfirmationDialog } from '../../components/ui/confirmation-dialog';
import { COLORS } from '../../constants/colors';
import { useRouter } from 'expo-router';

type UserMetadata = {
  full_name?: string;
  avatar_url?: string;
  picture?: string;
};

export default function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const { openModal } = useModal();
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

  const metadata = user?.user_metadata as UserMetadata | undefined;

  const avatar = metadata?.avatar_url || metadata?.picture || null;
  const name = metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const initial = metadata?.full_name?.[0] || user?.email?.[0] || 'U';

  const {
    projects,
    projectsWithCount,
    isLoading,
    isError,
    error,
    refetch,
    deleteProject,
  } = useProjects();

  const { stats, isLoadingStats } = useTasks();

  const handleDeleteProject = () => {
    if (projectToDelete) {
      deleteProject(projectToDelete);
      setProjectToDelete(null);
    }
  };

  const handleEditProject = (project: any) => {
    openModal('edit-project', project);
  };

  if (isLoading || isLoadingStats) {
    return <LoadingSpinner fullScreen />;
  }

  if (isError) {
    return (
      <ErrorMessage
        message={error?.message || 'Failed to load data'}
        onRetry={refetch}
        fullScreen
      />
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello,</Text>
            <Text style={styles.userName}>{name}</Text>
          </View>

          <View style={styles.profileBadge}>
            {avatar ? (
              <Image
                source={{ uri: avatar }}
                style={styles.avatar}
                resizeMode="cover"
              />
            ) : (
              <Text style={styles.profileInitial}>
                {initial.toUpperCase()}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <View style={[styles.statCard, { backgroundColor: COLORS.priority.medium + '10' }]}>
              <Text style={styles.statNumber}>{stats?.total || 0}</Text>
              <Text style={styles.statLabel}>Total Tasks</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: COLORS.status.done + '10' }]}>
              <Text style={styles.statNumber}>{stats?.completed || 0}</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
          </View>
          <View style={styles.statsRow}>
            <View style={[styles.statCard, { backgroundColor: COLORS.status['in-progress'] + '10' }]}>
              <Text style={styles.statNumber}>{stats?.pending || 0}</Text>
              <Text style={styles.statLabel}>In Progress</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: COLORS.ui.card }]}>
              <Text style={styles.statNumber}>{projects.length}</Text>
              <Text style={styles.statLabel}>Projects</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Priority</Text>
          <View style={styles.priorityContainer}>
            {(['high', 'medium', 'low'] as const).map((priority) => (
              <TouchableOpacity
                key={priority}
                style={[styles.priorityCard, { backgroundColor: COLORS.priority[priority] + '10' }]}
                onPress={() => router.push({
                  pathname: '/(app)/all-tasks',
                  params: {
                    filterPriority: priority,
                    filterStatus: 'all'
                  }
                })}
              >
                <View style={[styles.priorityDot, { backgroundColor: COLORS.priority[priority] }]} />
                <Text style={[styles.priorityText, { color: COLORS.priority[priority] }]}>
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </Text>
                <Text style={styles.priorityCount}>
                  {stats?.byPriority[priority] || 0} tasks
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Projects</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => openModal('create-project')}
            >
              <Feather name="plus" size={20} color={COLORS.ui.background} />
              <Text style={styles.addButtonText}>New</Text>
            </TouchableOpacity>
          </View>

          {projectsWithCount.length === 0 ? (
            <EmptyState
              icon="folder"
              title="No projects yet"
              message="Create your first project to start organizing tasks"
            />
          ) : (
            projectsWithCount.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                taskCount={project.task_count}
                onPress={() => {
                  router.push(`/(app)/project/${project.id}`);
                }}
                onLongPress={() => handleEditProject(project)}
              />
            ))
          )}
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => openModal('create-task')}
      >
        <Feather name="plus" size={24} color={COLORS.ui.background} />
      </TouchableOpacity>

      <ConfirmationDialog
        visible={!!projectToDelete}
        title="Delete Project"
        message="Are you sure you want to delete this project? All tasks inside this project will also be deleted."
        onConfirm={handleDeleteProject}
        onCancel={() => setProjectToDelete(null)}
        destructive
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.ui.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  greeting: {
    fontSize: 14,
    color: COLORS.ui.textSecondary,
    marginBottom: 4,
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.ui.text,
  },
  profileBadge: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  profileInitial: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.ui.background,
  },
  statsContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: COLORS.ui.card,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.ui.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: COLORS.ui.textSecondary,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.ui.text,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.priority.medium,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  addButtonText: {
    color: COLORS.ui.background,
    fontSize: 14,
    fontWeight: '500',
  },
  priorityContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  priorityCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  priorityText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  priorityCount: {
    fontSize: 12,
    color: COLORS.ui.textSecondary,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.priority.medium,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    zIndex: 999,
  },
}); 