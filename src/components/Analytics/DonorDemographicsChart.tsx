import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DonorDemographicsChart = () => {
  const data = [
    { ageGroup: '18-25', male: 2400, female: 2210 },
    { ageGroup: '26-35', male: 3210, female: 2890 },
    { ageGroup: '36-45', male: 2290, female: 2000 },
    { ageGroup: '46-55', male: 2000, female: 1800 },
    { ageGroup: '56-65', male: 1490, female: 1300 },
    { ageGroup: '65+', male: 1240, female: 1100 },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
        isAnimationActive={true}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis dataKey="ageGroup" stroke="#6B7280" style={{ fontSize: '12px' }} />
        <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
        <Tooltip
          contentStyle={{
            backgroundColor: '#FFF',
            border: '1px solid #E5E7EB',
            borderRadius: '8px',
          }}
        />
        <Legend />
        <Bar dataKey="male" fill="#DC2626" radius={[8, 8, 0, 0]} />
        <Bar dataKey="female" fill="#EC4899" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default DonorDemographicsChart;
