import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Users, Trophy, TrendingUp } from 'lucide-react';

const ImpactMetricsWidget = () => {
  const metrics = [
    {
      icon: Heart,
      label: 'Lives Saved',
      value: '12,547',
      subtext: 'Total impact',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      icon: Users,
      label: 'Active Contributors',
      value: '50,234',
      subtext: 'Registered donors',
      color: 'text-rose-600',
      bgColor: 'bg-rose-50',
    },
    {
      icon: Trophy,
      label: 'Community Reach',
      value: '150+',
      subtext: 'Cities covered',
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
    },
    {
      icon: TrendingUp,
      label: 'Monthly Growth',
      value: '+12.5%',
      subtext: 'Active donors',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
  ];

  return (
    <Card className="rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle>Community Impact</CardTitle>
        <CardDescription>Overall platform performance and reach</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <div key={metric.label} className={`${metric.bgColor} p-4 rounded-xl`}>
                <div className="flex items-center justify-between mb-3">
                  <Icon className={`h-5 w-5 ${metric.color}`} />
                </div>
                <p className="text-sm font-medium text-gray-600 mb-1">{metric.label}</p>
                <p className="text-xl font-bold text-foreground mb-1">{metric.value}</p>
                <p className="text-xs text-gray-500">{metric.subtext}</p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ImpactMetricsWidget;
