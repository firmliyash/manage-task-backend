# Task Manager Backend
    1. Node.js (v18 or higher)
    2. Copy and paste .enc.development for .env file
    3. Replace the values
    4. npm i
    5. npm run dev
Your node application will start.

## Features

-   **Authentication System**: Login and Signup with JWT tokens
-   **Hash Password**: bycrpt
-   **Protected Routes**: auth middleware based routes
-   **Database**: postgres
-   **ORM**: Sequelize
-   **Error Handleing**: error handle by helper function

## Table Schemas

• users (id, name, email, password_hash, created_at)
• projects (id, name, description, created_by, created_at)
• project_members (id, project_id, user_id, role [Admin/Member])
• tasks (id, project_id, title, description, status, assigned_to, deadline, created_at, updated_at)



