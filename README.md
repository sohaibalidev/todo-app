# Tasklist

A **React Native Expo** application for managing tasks and projects with a **Supabase backend**.

---

# Prerequisites

Before starting, install the following:

- Node.js (v18 or newer)
- npm or yarn
- Git
- Expo CLI
- EAS CLI
- Expo Go app on your phone

Install the required CLIs:

```bash
npm install -g expo-cli
npm install -g eas-cli
```

Install **Expo Go**:

Android: https://play.google.com/store/apps/details?id=host.exp.exponent  
iOS: https://apps.apple.com/app/expo-go/id982107779

---

# Environment Setup

Clone the repository:

```bash
git clone https://github.com/sohaibalidev/tasklist.git
cd tasklist
```

Install dependencies:

```bash
npm install
```

Create a `.env.local` file:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add:

```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your_google_web_client_id
```

---

# Supabase Setup

1. Create a project at  
   https://supabase.com

2. Open **SQL Editor**

3. Run the following SQL:

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
ON profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
INSERT INTO profiles (id,email,full_name,avatar_url)
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

CREATE POLICY "Users can view own projects"
ON projects FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own projects"
ON projects FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects"
ON projects FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects"
ON projects FOR DELETE
USING (auth.uid() = user_id);

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

CREATE POLICY "Users can view own tasks"
ON tasks FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tasks"
ON tasks FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks"
ON tasks FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tasks"
ON tasks FOR DELETE
USING (auth.uid() = user_id);

CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_priority ON tasks(priority);
```

---

# Google Sign-In Configuration

1. Open  
   https://console.cloud.google.com

2. Create or select a project.

3. Enable **Google Sign-In API**.

4. Create **OAuth 2.0 Credentials**  
   Type: **Web Application**

5. Add the **Web Client ID** to `.env.local`.

6. In Supabase:

Dashboard → Authentication → Providers → Google

Enable Google and add:

- Client ID
- Client Secret

---

# Running the App

Start the Expo development server:

```bash
npx expo start
```

A **QR code** will appear.

Open **Expo Go** on your phone and scan it.

No Android Studio required.

---

# Building the APK (Cloud Build)

Login to EAS:

```bash
eas login
```

Configure build:

```bash
eas build:configure
```

Set secrets:

```bash
eas env:push --environment preview
```

or

```bash
eas env:push --environment production
```

Build APK:

```bash
eas build -p android --profile preview
```

Expo will build your APK on their cloud servers and give you a **download link**.

---

# Installing the APK

1. Download the APK.
2. Transfer to your phone.
3. Enable **Install Unknown Apps**.
4. Install the APK.


---

# Production Build

```bash
eas build -p android --profile production
```

This generates an **AAB file for Google Play submission**.

---
