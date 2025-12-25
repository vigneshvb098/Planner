import { useState, useEffect } from 'react';
import { RoutineHeader } from './components/RoutineHeader';
import { TaskForm } from './components/TaskForm';
import { TaskList } from './components/TaskList';
import { DailyTimeline } from './components/DailyTimeline';
import { StatsPanel } from './components/StatsPanel';
import { api } from './services/api';

export interface Task {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  category: 'work' | 'health' | 'personal' | 'leisure';
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [view, setView] = useState<'list' | 'timeline'>('timeline');
  const [loading, setLoading] = useState(true);

  // Load tasks from Supabase
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    const fetchedTasks = await api.getTasks();
    setTasks(fetchedTasks);
    setLoading(false);
  };

  const addTask = async (task: Omit<Task, 'id' | 'completed'>) => {
    const newTask = await api.createTask(task);
    if (newTask) {
      setTasks([...tasks, newTask]);
      setShowForm(false);
    }
  };

  const updateTask = async (id: string, updatedTask: Omit<Task, 'id' | 'completed'>) => {
    const success = await api.updateTask(id, updatedTask);
    if (success) {
      setTasks(tasks.map(task => 
        task.id === id ? { ...task, ...updatedTask } : task
      ));
      setEditingTask(null);
      setShowForm(false);
    }
  };

  const deleteTask = async (id: string) => {
    const success = await api.deleteTask(id);
    if (success) {
      setTasks(tasks.filter(task => task.id !== id));
    }
  };

  const toggleComplete = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      const success = await api.updateTask(id, { completed: !task.completed });
      if (success) {
        setTasks(tasks.map(t =>
          t.id === id ? { ...t, completed: !t.completed } : t
        ));
      }
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <RoutineHeader 
          view={view}
          onViewChange={setView}
          onAddTask={() => setShowForm(true)}
        />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {showForm && (
              <TaskForm
                onSubmit={editingTask ? (task) => updateTask(editingTask.id, task) : addTask}
                onCancel={handleCancelForm}
                initialTask={editingTask}
              />
            )}

            {loading ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 border border-gray-100 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-4">Loading tasks...</p>
              </div>
            ) : view === 'timeline' ? (
              <DailyTimeline
                tasks={tasks}
                onToggleComplete={toggleComplete}
                onEdit={handleEdit}
                onDelete={deleteTask}
              />
            ) : (
              <TaskList
                tasks={tasks}
                onToggleComplete={toggleComplete}
                onEdit={handleEdit}
                onDelete={deleteTask}
              />
            )}
          </div>

          <div>
            <StatsPanel tasks={tasks} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;