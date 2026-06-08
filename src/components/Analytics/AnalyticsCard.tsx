import { LucideIcon } from 'lucide-react';

interface AnalyticsCardProps {
  label: string;
  value: string;
  change: string;
  icon: LucideIcon;
  color: string;
}

const AnalyticsCard = ({ label, value, change, icon: Icon, color }: AnalyticsCardProps) => {
  return (
    <div className="rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-6 bg-white">
      <div className="flex items-start justify-between mb-4">
        <div className={`bg-gradient-to-br ${color} p-3 rounded-lg`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
          {change}
        </span>
      </div>
      <h3 className="text-gray-600 text-sm font-medium mb-2">{label}</h3>
      <p className="text-2xl font-bold text-foreground">{value}</p>
    </div>
  );
};

export default AnalyticsCard;
