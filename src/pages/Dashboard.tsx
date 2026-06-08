import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Users, Droplet, TrendingUp, Activity, AlertCircle } from 'lucide-react';
import DonorDemographicsChart from '@/components/Analytics/DonorDemographicsChart';
import BloodTypeChart from '@/components/Analytics/BloodTypeChart';
import RequestTrendsChart from '@/components/Analytics/RequestTrendsChart';
import DonationTrendsChart from '@/components/Analytics/DonationTrendsChart';
import ImpactMetricsWidget from '@/components/Analytics/ImpactMetricsWidget';
import AnalyticsCard from '@/components/Analytics/AnalyticsCard';

const Dashboard = () => {
  // Mock KPI data
  const kpis = [
    {
      label: 'Active Donors',
      value: '50,234',
      change: '+12.5%',
      icon: Users,
      color: 'from-red-500 to-rose-600',
    },
    {
      label: 'Blood Units Available',
      value: '25,847',
      change: '+8.2%',
      icon: Droplet,
      color: 'from-rose-500 to-pink-600',
    },
    {
      label: 'Lives Saved This Month',
      value: '1,243',
      change: '+15.3%',
      icon: Heart,
      color: 'from-pink-500 to-rose-600',
    },
    {
      label: 'Fulfillment Rate',
      value: '94.2%',
      change: '+2.1%',
      icon: TrendingUp,
      color: 'from-red-600 to-rose-700',
    },
  ];

  const urgentRequests = [
    { bloodType: 'O-', units: 5, hospitals: 3 },
    { bloodType: 'AB+', units: 2, hospitals: 1 },
    { bloodType: 'B-', units: 3, hospitals: 2 },
  ];

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">Real-time insights into blood donations and community impact</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpis.map((kpi) => (
            <AnalyticsCard key={kpi.label} {...kpi} />
          ))}
        </div>

        {/* Main Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>Donation Trends</CardTitle>
              <CardDescription>Last 6 months activity</CardDescription>
            </CardHeader>
            <CardContent>
              <DonationTrendsChart />
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>Blood Type Distribution</CardTitle>
              <CardDescription>Available units by type</CardDescription>
            </CardHeader>
            <CardContent>
              <BloodTypeChart />
            </CardContent>
          </Card>
        </div>

        {/* Secondary Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>Donor Demographics</CardTitle>
              <CardDescription>Distribution by age and gender</CardDescription>
            </CardHeader>
            <CardContent>
              <DonorDemographicsChart />
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>Request Processing</CardTitle>
              <CardDescription>Fulfillment trends over time</CardDescription>
            </CardHeader>
            <CardContent>
              <RequestTrendsChart />
            </CardContent>
          </Card>
        </div>

        {/* Impact Metrics and Urgent Requests */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ImpactMetricsWidget />
          </div>

          <Card className="rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                Urgent Requests
              </CardTitle>
              <CardDescription>High priority needs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {urgentRequests.map((request) => (
                  <div
                    key={request.bloodType}
                    className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100"
                  >
                    <div>
                      <p className="font-semibold text-foreground">{request.bloodType}</p>
                      <p className="text-sm text-gray-600">{request.hospitals} hospitals</p>
                    </div>
                    <Badge variant="destructive" className="bg-red-600 hover:bg-red-700">
                      {request.units} units
                    </Badge>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4 bg-red-600 hover:bg-red-700">
                View All Requests
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
