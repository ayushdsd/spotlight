interface ActivityItemProps {
  title: string;
  description: string;
  time: string;
  status?: 'pending' | 'completed' | 'rejected';
  icon?: React.ReactNode;
}

export default function ActivityItem({ title, description, time, status, icon }: ActivityItemProps) {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  };

  return (
    <div className="flex gap-4 p-4 hover:bg-dark-50 rounded-lg transition-colors">
      {icon && (
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
            {icon}
          </div>
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-dark-900 truncate">{title}</p>
          <time className="text-xs text-dark-500">{time}</time>
        </div>
        <p className="text-sm text-dark-600 mt-1">{description}</p>
        {status && (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 ${statusColors[status]}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        )}
      </div>
    </div>
  );
}
