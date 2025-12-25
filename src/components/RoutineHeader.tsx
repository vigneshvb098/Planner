import { Calendar, Clock, Plus, List, CalendarClock } from 'lucide-react';

interface RoutineHeaderProps {
  view: 'list' | 'timeline';
  onViewChange: (view: 'list' | 'timeline') => void;
  onAddTask: () => void;
}

export function RoutineHeader({ view, onViewChange, onAddTask }: RoutineHeaderProps) {
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-gray-900 mb-2 flex items-center gap-3">
            <Calendar className="w-8 h-8 text-blue-600" />
            Smart Daily Routine
          </h1>
          <p className="text-gray-600 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            {dateStr}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => onViewChange('timeline')}
              className={`px-4 py-2 rounded-md transition-all flex items-center gap-2 ${
                view === 'timeline' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <CalendarClock className="w-4 h-4" />
              Timeline
            </button>
            <button
              onClick={() => onViewChange('list')}
              className={`px-4 py-2 rounded-md transition-all flex items-center gap-2 ${
                view === 'list' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <List className="w-4 h-4" />
              List
            </button>
          </div>

          <button
            onClick={onAddTask}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-md hover:shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Add Task
          </button>
        </div>
      </div>
    </div>
  );
}