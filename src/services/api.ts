import { projectId, publicAnonKey } from '../utils/supabase/info';
import { Task } from '../App';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-8ed456c2`;

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${publicAnonKey}`,
};

export const api = {
  async getTasks(): Promise<Task[]> {
    try {
      const response = await fetch(`${API_BASE}/tasks`, { headers });
      const data = await response.json();
      
      if (!data.success) {
        console.error('Error fetching tasks:', data.error);
        return [];
      }
      
      return data.tasks || [];
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return [];
    }
  },

  async createTask(task: Omit<Task, 'id' | 'completed'>): Promise<Task | null> {
    try {
      const newTask = {
        ...task,
        completed: false,
      };
      
      const response = await fetch(`${API_BASE}/tasks`, {
        method: 'POST',
        headers,
        body: JSON.stringify(newTask),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        console.error('Error creating task:', data.error);
        return null;
      }
      
      return { ...data.task, id: data.id };
    } catch (error) {
      console.error('Error creating task:', error);
      return null;
    }
  },

  async updateTask(id: string, updates: Partial<Task>): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE}/tasks/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(updates),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        console.error('Error updating task:', data.error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error updating task:', error);
      return false;
    }
  },

  async deleteTask(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE}/tasks/${id}`, {
        method: 'DELETE',
        headers,
      });
      
      const data = await response.json();
      
      if (!data.success) {
        console.error('Error deleting task:', data.error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting task:', error);
      return false;
    }
  },
};
