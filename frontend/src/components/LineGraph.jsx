import { Card, CardContent, Typography, Box } from "@mui/material";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import dayjs from "dayjs";

export default function LineGraph({ title, rawValues }) {
  const today = dayjs();

  const data = rawValues.map((value, index) => ({
    name: today.subtract(6 - index, "day").format("MMM D"),
    value,
  }));

  const yesterdayValue = rawValues[rawValues.length - 2] || 0;
  const todayValue = rawValues[rawValues.length - 1] || 0;

  const growth = ((todayValue - yesterdayValue) / (yesterdayValue || 1)) * 100;
  const growthDisplay = `${growth >= 0 ? '+' : ''}${growth.toFixed(2)}%`;
  const isPositive = growth >= 0;

  const total = rawValues.reduce((acc, val) => acc + val, 0);

  return (
    <Card
      elevation={3}
      sx={{
        borderRadius: 3,
        width: "100%",
        height: "100%",
        overflow: "hidden",
        boxShadow: "0px 4px 16px rgba(0,0,0,0.05)",
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" alignItems="flex-start" justifyContent="space-between" mb={1}>
          <Box>
            <Typography variant="h6" fontWeight="bold">
              {title}
            </Typography>
            <Typography variant="subtitle2" fontWeight="bold">
              ${total.toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total last 7 days
            </Typography>
          </Box>

          <Box
            sx={{
              px: 1.25,
              py: 0.25,
              mt: 0.5,
              bgcolor: isPositive ? "rgba(5, 224, 12, 0.2)" : "rgba(244, 67, 54, 0.1)",
              color: isPositive ? "green" : "red",
              borderRadius: 2,
              fontWeight: "bold",
              lineHeight: 1.4,
            }}
          >
            {growthDisplay}
          </Box>
        </Box>

        <ResponsiveContainer height={220} width="100%">
          <AreaChart data={data} margin={{ top: 10, bottom: 0 }}>
            <XAxis
              dataKey="name"
              tickLine={false}
              tick={{ fontSize: 12 }}
              padding={{ left: 18, right: 18 }}
              ticks={[data[0].name, data[data.length - 1].name]}
              tickFormatter={(value) =>
                value === data[data.length - 1].name ? "Today" : value
              }
            />
            <Tooltip
              contentStyle={{
                borderRadius: 8,
                boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
              }}
              formatter={(value) => [`$${value}`]}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#3f51b5"
              fill="blue"
              fillOpacity={0.2}
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
