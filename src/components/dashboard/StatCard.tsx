interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
}

export default function StatCard({ title, value, subtitle, trend, icon }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-dark-100">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-dark-500 text-sm font-medium">{title}</p>
          <h3 className="text-2xl font-bold mt-2 text-dark-900">{value}</h3>
          <p className="text-dark-400 text-sm mt-1">{subtitle}</p>
          {trend && (
            <div className="flex items-center mt-2">
              <span className={`text-sm font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
              <span className="text-dark-400 text-sm ml-1">vs last month</span>
            </div>
          )}
        </div>
        {icon && (
          <div className="p-3 bg-primary-50 rounded-lg">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
