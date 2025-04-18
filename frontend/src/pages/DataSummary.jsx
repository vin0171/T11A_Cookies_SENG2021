import BarGraph from "../components/BarGraph";
import { Container, Box } from "@mui/material";
import { Grid } from '@mui/system';
import SessionsChart from "../components/SessionChart";
import LineGraph from "../components/LineGraph";
import { Typography } from "@mui/material";

const DataGraph = () => {
  return (
    // mt is margin top which is the distance from the top of the page
    <Container sx={{ mt: 20 }}>
      <Grid item xs={12}>
        <Box display="flex" justifyContent="center">
          <SessionsChart />
        </Box>
      </Grid>

      <Typography variant="h5" component="p" sx={{ fontWeight: 'bold', marginTop: 3 }}>
        Your Overview
      </Typography>

      <Box display="flex" justifyContent="left">
        <hr style={{ width: '100%', borderColor: 'white' }} />
      </Box>
      <Box display="flex" gap={2} width="100%" sx={{ flexWrap: 'nowrap', marginTop: 2, marginBottom: 20 }}>
        <Box sx={{ flex: 1 }}>
          <BarGraph 
            title="Customer" 
            rawValues={[2,10,4,16,70,50,30]}
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <LineGraph 
            title="Gross Volume" 
            rawValues={[6422, 3241, 1768, 5855, 4320, 2197, 6880]}
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <LineGraph  
            title="Net Volume of Sales" 
            rawValues={[4000, 3000, 2000, 1000, 5000, 6000, 7000]} 
          />
        </Box>
      </Box>

    </Container>
  );
};

export default DataGraph;