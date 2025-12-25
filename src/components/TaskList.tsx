import { CheckCircle2, Circle, Edit2, Trash2, Clock, AlertCircle } from 'lucide-react';
import { Task } from '../App';

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const categoryColors = {
  work: 'bg-blue-100 text-blue-700 border-blue-200',
  health: 'bg-green-100 text-green-700 border-green-200',
  personal: 'bg-purple-100 text-purple-700 border-purple-200',
  leisure: 'bg-orange-100 text-orange-700 border-orange-200',
};

const priorityIcons = {
  low: { color: 'text-gray-400', label: 'Low' },
  medium: { color: 'text-yellow-500', label: 'Medium' },
  high: { color: 'text-red-500', label: 'High' },
};

export function TaskList({ tasks, onToggleComplete, onEdit, onDelete }: TaskListProps) {
  const categories: Task['category'][] = ['work', 'health', 'personal', 'leisure'];

  if (tasks.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-12 border border-gray-100 text-center">
        <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-gray-900 mb-2">No tasks scheduled</h3>
        <p className="text-gray-500">Start planning your day by adding your first task</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {categories.map(category => {
        const categoryTasks = tasks
          .filter(task => task.category === category)
          .sort((a, b) => a.startTime.localeCompare(b.startTime));

        if (categoryTasks.length === 0) return null;

        return (
          <div key={category} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-gray-900 mb-4 capitalize">{category}</h3>
            
            <div className="space-y-3">
              {categoryTasks.map(task => (
                <div
                  key={task.id}
                  className={`border-2 rounded-xl p-4 transition-all ${
                    task.completed 
                      ? 'bg-gray-50 border-gray-200 opacity-75' 
                      : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <button
                      onClick={() => onToggleComplete(task.id)}
                      className="flex-shrink-0 mt-1"
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                      ) : (
                        <Circle className="w-6 h-6 text-gray-300 hover:text-blue-500 transition-colors" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1">
                          <h4 className={`text-gray-900 mb-1 ${task.completed ? 'line-through' : ''}`}>
                            {task.title}
                          </h4>
                          {task.description && (
                            <p className="text-gray-600">{task.description}</p>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onEdit(task)}
                            className="text-gray-400 hover:text-blue-600 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDelete(task.id)}
                            className="text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-gray-600 flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {task.startTime} - {task.endTime}
                        </span>

                        <span className={`flex items-center gap-1 ${priorityIcons[task.priority].color}`}>
                          <AlertCircle className="w-4 h-4" />
                          {priorityIcons[task.priority].label}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
