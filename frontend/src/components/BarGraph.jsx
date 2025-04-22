import { Card, CardContent, Typography, Box } from "@mui/material";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import dayjs from "dayjs";

export default function BarGraph({ title, rawValues }) {
  const today = dayjs();
  const data = rawValues.map((value, index) => ({
    name: today.subtract(6 - index, "day").format("ddd"),
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
              {total.toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {today.format("dddd, MMMM Do")}
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
        


        <ResponsiveContainer width="100%" height={220}>
          <BarChart
            data={data}
            margin={{ top: 10 }}
            barCategoryGap={8}
          >

            <XAxis
              dataKey="name"
              tickLine={false}
              tick={{ fontSize: 12 }}
            />
            
            <Tooltip
              contentStyle={{
                borderRadius: 8,
                boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
              }}
              formatter={(value) => [`${value} views`]} // ← only one item
            />

            <Bar
              dataKey="value"
              radius={[4, 4, 0, 0]}
              fill="#a370f0"/>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
