import { useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { LineChart } from '@mui/x-charts/LineChart';

function getDaysInMonth(month, year) {
  const date = new Date(year, month, 0);
  const monthName = date.toLocaleDateString('en-US', {
    month: 'short',
  });
  const daysInMonth = date.getDate();
  const days = [];
  let i = 1;
  while (days.length < daysInMonth) {
    days.push(`${monthName} ${i}`);
    i += 1;
  }
  return days;
}

function createData(data, itemName, color, chartItems) {
  chartItems.push({
    id: itemName,
    label: itemName,
    showMark: false,
    curve: 'linear',
    stack: 'total',
    area: true,
    stackOrder: 'ascending',
    color: color,
    data: data,
  });
}

export default function SessionsChart() {
  const theme = useTheme();
  const data = getDaysInMonth(4, 2024);
  const imagine_data = [
    {
      label: 'Direct',
      data: [
        300, 900, 600, 1200, 1500, 1800, 2400, 2100, 2700, 3000, 1800,
        3300, 3600, 3900, 4200, 4500, 3900, 4800, 5100, 5400, 4800,
        5700, 6000, 6300, 6600, 6900, 7200, 7500, 7800,
      ],
    },
    {
      label: 'Referral',
      data: [
        500, 900, 700, 1400, 1100, 1700, 2300, 2000, 2600, 2900, 2300,
        3200, 3500, 3800, 4100, 4400, 2900, 4700, 5000, 5300, 5600,
        5900, 6200, 6500, 5600, 6800, 7100, 7400, 7700,
      ],
    },
    {
      label: 'Organic',
      data: [
        1000, 1500, 1200, 1700, 1300, 2000, 2400, 2200, 2600, 2800, 2500,
        3000, 3400, 3700, 3200, 3900, 4100, 3500, 4300, 4500, 4000,
        4700, 5000, 5200, 4800, 5400, 5600, 5900, 6100,
      ],
    }
  ];
  

  const colorPalette = [
    'rgba(244, 67, 54, 0.4)',   // Red
    'rgba(63, 81, 181, 0.4)',   // Indigo
    'rgba(255, 193, 7, 0.4)',   // Yellow/Orange
    'rgba(156, 39, 176, 0.4)',  // Purple
    'rgba(76, 175, 80, 0.4)',   // Green
  ];
  
  
  const chartItems = [];

  for (let i = 0; i < imagine_data.length; i++) {
    const { label, data } = imagine_data[i]; 
    createData(data, label, colorPalette[i], chartItems);
  }
  

  return (
    <Card
      elevation={3}
      sx={{
        borderRadius: 3,
        width: "100%",
        overflow: "hidden",
        boxShadow: "0px 4px 16px rgba(0,0,0,0.05)",
      }}
    >
      <CardContent>
        <Stack sx={{ justifyContent: 'space-between' }}>
          <Stack
            direction="row"
            sx={{
              alignContent: { xs: 'center', sm: 'flex-start' },
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Typography variant="h5" component="p" sx={{ fontWeight: 'bold' }}>
              Year To Date
            </Typography>
          </Stack>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Sale of Popular Items
          </Typography>
        </Stack>
        <LineChart
          series={chartItems}
          xAxis={[{ scaleType: 'point', data }]}
          height={250}
          grid={{ horizontal: true }}
          margin={{ left: 50, right: 20, top: 20, bottom: 10 }}

        />
      </CardContent>
    </Card>
  );
}
