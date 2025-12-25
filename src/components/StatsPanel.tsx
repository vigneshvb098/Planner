import { Target, CheckCircle2, Clock, TrendingUp } from 'lucide-react';
import { Task } from '../App';

interface StatsPanelProps {
  tasks: Task[];
}

export function StatsPanel({ tasks }: StatsPanelProps) {
  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const categoryStats = {
    work: tasks.filter(t => t.category === 'work').length,
    health: tasks.filter(t => t.category === 'health').length,
    personal: tasks.filter(t => t.category === 'personal').length,
    leisure: tasks.filter(t => t.category === 'leisure').length,
  };

  const highPriorityTasks = tasks.filter(t => t.priority === 'high' && !t.completed).length;

  const calculateTotalTime = () => {
    let totalMinutes = 0;
    tasks.forEach(task => {
      const [startHour, startMin] = task.startTime.split(':').map(Number);
      const [endHour, endMin] = task.endTime.split(':').map(Number);
      const start = startHour * 60 + startMin;
      const end = endHour * 60 + endMin;
      totalMinutes += end - start;
    });
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="space-y-6">
      {/* Progress Card */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-gray-900 mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-600" />
          Progress
        </h3>
        
        <div className="mb-4">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Completion Rate</span>
            <span className="text-gray-900">{completionRate}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
          <div>
            <p className="text-gray-500 mb-1">Completed</p>
            <p className="text-gray-900">{completedTasks}</p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">Remaining</p>
            <p className="text-gray-900">{totalTasks - completedTasks}</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          Quick Stats
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Total Time
            </span>
            <span className="text-gray-900">{calculateTotalTime()}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-600 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Total Tasks
            </span>
            <span className="text-gray-900">{totalTasks}</span>
          </div>

          {highPriorityTasks > 0 && (
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
              <span className="text-red-700">High Priority</span>
              <span className="text-red-900">{highPriorityTasks}</span>
            </div>
          )}
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-gray-900 mb-4">Categories</h3>

        <div className="space-y-3">
          {Object.entries(categoryStats).map(([category, count]) => (
            <div key={category} className="flex items-center justify-between">
              <span className="text-gray-600 capitalize">{category}</span>
              <span className="px-3 py-1 bg-gray-100 text-gray-900 rounded-full">
                {count}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
