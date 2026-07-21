# Kanban Task Board

A modern Kanban-style task management application built with React, TypeScript, Supabase, and dnd-kit.

The application allows users to create, edit, delete, search, filter, and visually organize tasks across four workflow stages. Each visitor is automatically authenticated through a Supabase anonymous guest session and can access only their own tasks.

## Live Demo

[Open the live application](https://kanban-task-board-puce.vercel.app)

## Features

### Core functionality

- Kanban board with four columns:
  - To Do
  - In Progress
  - In Review
  - Done
- Drag-and-drop task movement between columns
- Task creation, editing, and deletion
- Persistent task storage using Supabase
- Automatic anonymous guest authentication
- Row Level Security policies for user-specific data access
- Responsive layout
- Loading and error states

### Task details

Each task can contain:

- Title
- Description
- Priority
- Due date
- Current workflow status

### Advanced features

- Search by task title or description
- Filter by priority
- Board statistics:
  - Total tasks
  - Completed tasks
  - Overdue tasks
- Due-date indicators:
  - Overdue
  - Due today
  - Due tomorrow
  - Future date
- Custom deletion confirmation dialog
- Optimistic UI updates for task movement and deletion

## Technology Stack

### Frontend

- React
- TypeScript
- Vite
- CSS
- dnd-kit
- Lucide React

### Backend and data

- Supabase PostgreSQL
- Supabase Authentication
- Supabase Row Level Security

### Deployment

- Vercel
- GitHub

## Architecture

The project separates presentation, state management, and data access responsibilities.

```text
src/
├── components/
│   ├── board/
│   │   ├── BoardColumn/
│   │   ├── BoardToolbar/
│   │   └── TaskBoard/
│   ├── common/
│   │   └── ConfirmDialog/
│   └── tasks/
│       ├── TaskCard/
│       └── TaskFormModal/
├── hooks/
│   └── useTasks.ts
├── lib/
│   ├── boardColumns.ts
│   └── supabase.ts
├── services/
│   ├── authService.ts
│   └── taskService.ts
├── types/
│   └── task.ts
├── utils/
│   └── date.ts
├── App.tsx
└── main.tsx
```
