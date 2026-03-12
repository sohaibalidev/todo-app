export type Profile = {
    id: string;
    email: string;
    full_name: string | null;
    avatar_url: string | null;
    created_at: string;
    updated_at: string;
};

export type Project = {
    id: string;
    user_id: string;
    title: string;
    icon_name: string;
    created_at: string;
    updated_at: string;
};

export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export type Task = {
    id: string;
    user_id: string;
    project_id: string | null;
    title: string;
    description: string | null;
    status: TaskStatus;
    priority: TaskPriority;
    created_at: string;
    updated_at: string;
};

export type TaskInsert = Omit<Task, 'id' | 'created_at' | 'updated_at' | 'user_id'> & {
    user_id?: string; 
};

export type TaskUpdate = Partial<Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>> & {
    id: string;
};

export type ProjectInsert = Omit<Project, 'id' | 'created_at' | 'updated_at' | 'user_id'> & {
    user_id?: string;
};

export type ProjectUpdate = Partial<Omit<Project, 'id' | 'user_id' | 'created_at' | 'updated_at'>> & {
    id: string;
};