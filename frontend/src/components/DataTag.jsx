import { Box, Card, Typography } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

export default function StatCard({icon, value, title, subtitle, growth, color}) {
  const isPositive = growth >= 0;

  return (
    <Card
      sx={{
        borderRadius: 4,
        px: 2,
        py: 2,
       
        position: "relative",
        overflow: "hidden",
        boxShadow: "0px 4px 16px rgba(0,0,0,0.05)",
        width: "100%",
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box
          sx={{
            width: 36,
            height: 36,
            backgroundColor: `${color}80`, 
            color: color,
            borderRadius: 2,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: 20,
            fontWeight: "bold",
          }}
        >
          {icon}
        </Box>

        <Box
          sx={{
            backgroundColor: isPositive ? "rgba(76, 175, 80, 0.15)" : "rgba(244, 67, 54, 0.15)",
            color: isPositive ? "#4caf50" : "#f44336",
            px: 1.2,
            py: 0.5,
            fontSize: "0.75rem",
            fontWeight: "bold",
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            gap: "2px",
          }}
        >
          {`${growth >= 0 ? "+" : ""}${growth}%`}{" "}
          <ArrowUpwardIcon
            sx={{
              fontSize: 14,
              transform: isPositive ? "rotate(0deg)" : "rotate(180deg)",
            }}
          />
        </Box>
      </Box>

      <Typography variant="h4" fontWeight="bold" mb={0.}>
        {value}
      </Typography>

      <Typography variant="subtitle1" color="black">
        {title}
      </Typography>

      <Typography variant="body2" color="#BEBEBE">
        {subtitle}
      </Typography>
    </Card>
  );
}
