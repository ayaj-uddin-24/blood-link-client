import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const RequestTrendsChart = () => {
  const data = [
    { week: 'Week 1', fulfilled: 85, pending: 15 },
    { week: 'Week 2', fulfilled: 88, pending: 12 },
    { week: 'Week 3', fulfilled: 90, pending: 10 },
    { week: 'Week 4', fulfilled: 92, pending: 8 },
    { week: 'Week 5', fulfilled: 94, pending: 6 },
    { week: 'Week 6', fulfilled: 94, pending: 6 },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        isAnimationActive={true}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis dataKey="week" stroke="#6B7280" style={{ fontSize: '12px' }} />
        <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
        <Tooltip
          contentStyle={{
            backgroundColor: '#FFF',
            border: '1px solid #E5E7EB',
            borderRadius: '8px',
          }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="fulfilled"
          stroke="#DC2626"
          strokeWidth={2}
          dot={{ fill: '#DC2626', r: 5 }}
          activeDot={{ r: 7 }}
        />
        <Line
          type="monotone"
          dataKey="pending"
          stroke="#FCA5A5"
          strokeWidth={2}
          dot={{ fill: '#FCA5A5', r: 5 }}
          activeDot={{ r: 7 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default RequestTrendsChart;
