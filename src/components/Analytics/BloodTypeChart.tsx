import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const BloodTypeChart = () => {
  const data = [
    { name: 'O+', value: 8500, percentage: 28 },
    { name: 'A+', value: 7200, percentage: 24 },
    { name: 'B+', value: 5800, percentage: 19 },
    { name: 'AB+', value: 2400, percentage: 8 },
    { name: 'O-', value: 2100, percentage: 7 },
    { name: 'A-', value: 1500, percentage: 5 },
    { name: 'B-', value: 1200, percentage: 4 },
    { name: 'AB-', value: 1143, percentage: 5 },
  ];

  const COLORS = ['#DC2626', '#E11D48', '#EC4899', '#F472B6', '#FCA5A5', '#FEE2E2', '#FECACA', '#FED7D7'];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percentage }) => `${name} ${percentage}%`}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
          isAnimationActive={true}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => [`${value} units`, 'Inventory']}
          contentStyle={{
            backgroundColor: '#FFF',
            border: '1px solid #E5E7EB',
            borderRadius: '8px',
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default BloodTypeChart;
