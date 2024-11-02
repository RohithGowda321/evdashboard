import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  RadialBarChart,
  RadialBar,
  Legend,
} from 'recharts';
import { Typography, Grid, Box, Card } from '@mui/material';

const Charts = ({ data }) => {
  const validData = data || [];

  const modelYearData = validData.reduce((acc, vehicle) => {
    const year = vehicle.ModelYear;
    acc[year] = (acc[year] || 0) + 1;
    return acc;
  }, {});

  const electricTypeData = validData.reduce((acc, vehicle) => {
    const type = vehicle.ElectricVehicleType;
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const electricRangeData = validData.reduce((acc, vehicle) => {
    const range = Math.floor(vehicle.ElectricRange / 50) * 50;
    acc[range] = (acc[range] || 0) + 1;
    return acc;
  }, {});

  const makeModelData = validData.reduce((acc, vehicle) => {
    const makeModel = `${vehicle.Make} ${vehicle.Model}`;
    acc[makeModel] = (acc[makeModel] || 0) + 1;
    return acc;
  }, {});

  const sortedMakeModelData = Object.entries(makeModelData)
    .map(([makeModel, count]) => ({ makeModel, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const rangeValues = validData.map(vehicle => vehicle.ElectricRange);
  const minRange = Math.min(...rangeValues);
  const maxRange = Math.max(...rangeValues);
  const avgRange = (rangeValues.reduce((sum, range) => sum + range, 0) / rangeValues.length).toFixed(2);

  const modelYearArray = Object.entries(modelYearData).map(([year, count]) => ({ year, count }));
  const electricTypeArray = Object.entries(electricTypeData).map(([type, count]) => ({ type, count }));
  const electricRangeArray = Object.entries(electricRangeData).map(([range, count]) => ({ range, count }));

  const COLORS = ['#6a1b9a', '#ec407a', '#29b6f6', '#ffb300', '#66bb6a'];

  return (
    <Box padding="20px" bgcolor="#f5f5f5">
      <Typography variant="h4" align="center" color="primary" gutterBottom fontWeight="600">
        Electric Vehicle Data Analysis
      </Typography>
      
      <Grid container spacing={4}>
        
        {/* Model Year Distribution */}
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <Typography variant="h6" align="center">Model Year Trends</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={modelYearArray}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#6a1b9a" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Grid>

        {/* Electric Vehicle Type Donut Chart */}
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <Typography variant="h6" align="center">Electric Vehicle Type Distribution</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={electricTypeArray} dataKey="count" nameKey="type" outerRadius={100} innerRadius={50} fill="#29b6f6">
                  {electricTypeArray.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Grid>

        {/* Electric Range Distribution */}
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <Typography variant="h6" align="center">Electric Range Distribution</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={electricRangeArray}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#66bb6a" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Grid>

        {/* Top 5 Makes and Models */}
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <Typography variant="h6" align="center">Top 5 Make and Model</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sortedMakeModelData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="makeModel" />
                <Tooltip />
                <Bar dataKey="count" fill="#ffb300" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Grid>

        {/* Electric Range Summary - Radial Bar Chart */}
        <Grid item xs={12} md={6}>
          <Card elevation={3} style={{ padding: '20px' }}>
            <Typography variant="h6" align="center">Electric Range Summary</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="10%"
                outerRadius="80%"
                barSize={10}
                data={[
                  { name: 'Min Range', value: minRange, fill: '#ffb300' },
                  { name: 'Average Range', value: avgRange, fill: '#8884d8' },
                  { name: 'Max Range', value: maxRange, fill: '#66bb6a' },
                ]}
              >
                <RadialBar minAngle={15} clockWise dataKey="value" />
                <Legend iconSize={10} layout="horizontal" verticalAlign="bottom" align="center" />
                <Tooltip />
              </RadialBarChart>
            </ResponsiveContainer>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Charts;
