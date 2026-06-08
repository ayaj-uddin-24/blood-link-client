import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const DonationTrendsChart = () => {
  const data = [
    { month: 'Jan', donations: 2400, donors: 1200 },
    { month: 'Feb', donations: 3200, donors: 1800 },
    { month: 'Mar', donations: 2800, donors: 1500 },
    { month: 'Apr', donations: 3600, donors: 2100 },
    { month: 'May', donations: 4200, donors: 2400 },
    { month: 'Jun', donations: 4800, donors: 2800 },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorDonations" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#DC2626" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#DC2626" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorDonors" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#EC4899" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#EC4899" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis dataKey="month" stroke="#6B7280" style={{ fontSize: '12px' }} />
        <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
        <Tooltip
          contentStyle={{
            backgroundColor: '#FFF',
            border: '1px solid #E5E7EB',
            borderRadius: '8px',
          }}
        />
        <Area
          type="monotone"
          dataKey="donations"
          stroke="#DC2626"
          fillOpacity={1}
          fill="url(#colorDonations)"
          isAnimationActive={true}
        />
        <Area
          type="monotone"
          dataKey="donors"
          stroke="#EC4899"
          fillOpacity={1}
          fill="url(#colorDonors)"
          isAnimationActive={true}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default DonationTrendsChart;
