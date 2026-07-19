import { supabase } from "../lib/supabase";

import type {
  CreateTaskInput,
  Task,
  TaskStatus,
  UpdateTaskInput,
} from "../types/task";

export async function getTasks(): Promise<Task[]> {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function createTask(
  input: CreateTaskInput,
): Promise<Task> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user) {
    throw new Error(
      "No authenticated guest user found.",
    );
  }

  const { data, error } = await supabase
    .from("tasks")
    .insert({
      title: input.title.trim(),
      description:
        input.description?.trim() || null,
      priority: input.priority ?? "normal",
      due_date: input.due_date || null,
      status: "todo",
      user_id: user.id,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function updateTaskStatus(
  taskId: string,
  status: TaskStatus,
): Promise<Task> {
  const { data, error } = await supabase
    .from("tasks")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", taskId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function updateTask(
  taskId: string,
  input: UpdateTaskInput,
): Promise<Task> {
  const { data, error } = await supabase
    .from("tasks")
    .update({
      title: input.title.trim(),
      description: input.description?.trim() || null,
      priority: input.priority,
      due_date: input.due_date || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", taskId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function deleteTask(
  taskId: string,
): Promise<void> {
  const { error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", taskId);

  if (error) {
    throw error;
  }
}