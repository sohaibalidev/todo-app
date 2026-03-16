# Todo App

A **React Native Expo application** for managing tasks and projects with a **Supabase backend**.

---

# Features

- Create and manage projects with custom icons
- Create, edit, and track tasks within projects
- Task status management (Todo, In Progress, Done)
- Task priority levels (Low, Medium, High)
- Search tasks by title or description
- Google Sign-In authentication
- Offline support
- Real-time updates

---

# Screenshots

<p align="center">
  <img src="screenshots/home.png" width="220">
  <img src="screenshots/project.png" width="220">
  <img src="screenshots/tasks.png" width="220">
  <img src="screenshots/create-task.png" width="220">
</p>

---

# Tech Stack

## Frontend

- React Native with Expo
- TypeScript
- Expo Router for navigation
- React Context for state management
- Custom UI components

## Backend

- Supabase (PostgreSQL, Authentication, RLS)
- Google OAuth 2.0

---

# Prerequisites

Make sure you have installed:

- Node.js (v18 or newer)
- npm or yarn
- Git
- Expo CLI

```bash
npm install -g expo-cli
```

- EAS CLI

```bash
npm install -g eas-cli
```

- Expo Go app on your phone

---

# Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/sohaibalidev/todo-app.git
cd todo-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create environment file

```bash
cp .env.example .env.local
```

### 4. Add credentials to `.env.local`

```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your_google_web_client_id
```

### 5. Start the app

```bash
npx expo start
```

### 6. Scan the QR code with the Expo Go app

---

# Database Setup

Run the following SQL in your **Supabase SQL Editor**.

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
    ON profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION handle_new_user();

CREATE TABLE projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    icon_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own projects"
ON projects FOR ALL USING (auth.uid() = user_id);

CREATE TABLE tasks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL CHECK (status IN ('todo','in-progress','done')) DEFAULT 'todo',
    priority TEXT NOT NULL CHECK (priority IN ('low','medium','high')) DEFAULT 'medium',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own tasks"
ON tasks FOR ALL USING (auth.uid() = user_id);

CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_tasks_status ON tasks(status);
```

---

# Google Sign-In Setup

This project uses **Google OAuth with Supabase**.
You must create **two OAuth clients** in Google Cloud:

- Web Client (for Supabase authentication)
- Android Client (for the mobile app)

---

## 1. Create Google Cloud Project

1. Go to https://console.cloud.google.com
2. Create a **new project** or select an existing one
3. Enable the **Google People API**

---

# 2. Create Web OAuth Client (Required for Supabase)

1. Go to **APIs & Services → Credentials**
2. Click **Create Credentials → OAuth Client ID**
3. Select **Web Application**

Add the following **Authorized redirect URI**:

```
https://your-project.supabase.co/auth/v1/callback
```

Replace `your-project` with your **Supabase project ID**.

After creating the client:

- Copy the **Client ID**
- Copy the **Client Secret**

Add the **Client ID** to your `.env.local` file:

```
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your_google_web_client_id
```

---

# 3. Create Android OAuth Client

Since this is a **React Native / Expo mobile app**, you must also create an **Android OAuth client**.

1. Go to **Create Credentials → OAuth Client ID**
2. Select **Android**

Fill the fields:

### Package Name

```
com.yourcompany.todoapp
```

(Use the same package name defined in your `app.json` or `app.config.js`)

### SHA-1 Certificate Fingerprint

You must add the **SHA-1 fingerprint** of your Android build.

If using **EAS Build**, get it with:

```
eas credentials
```

or from the Expo dashboard.

For **local debug builds**, you can get it with:

```
keytool -list -v -alias androiddebugkey -keystore ~/.android/debug.keystore
```

Default password:

```
android
```

Copy the **SHA-1 fingerprint** and paste it into the Google Cloud form.

---

# 4. Configure Google Provider in Supabase

1. Open **Supabase Dashboard**
2. Go to **Authentication → Providers**
3. Enable **Google**

Add:

- **Client ID** (from Web OAuth client)
- **Client Secret**

Save changes.

---

# Project Structure

```
src/
├── app/                 # Expo Router routes
│   ├── (app)            # Protected routes
│   └── (auth)           # Authentication screens
├── components/          # Reusable components
│   ├── modals
│   ├── project
│   ├── task
│   └── ui
├── constants
├── context
├── hooks
├── lib
├── services
├── types
└── utils
```

---

# Building APK

### Configure EAS

```bash
eas build:configure
```

### Push environment variables

```bash
eas env:push --environment preview
```

### Build APK

```bash
eas build -p android --profile preview
```

---

# Production Build

```bash
eas env:push --environment production
eas build -p android --profile production
```

This generates an **AAB file for the Google Play Store**.

---

# License

MIT
