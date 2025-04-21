import { Box, Typography, CircularProgress } from '@mui/material';


const CreditsProgress = ({ total, left }) => {
  const consumed = total - left;
  const percentage = (consumed / total) * 100;

  return (
    <Box sx={{ textAlign: 'center', mt: 4 }}>
      <Box
        sx={{
          position: 'relative',
          display: 'inline-flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {/* Background circle */}
        <CircularProgress
          variant="determinate"
          value={100}
          size={150}
          thickness={4}
          sx={{ color: '#e5edf5' }}
        />

        {/* Foreground progress circle */}
        <CircularProgress
          variant="determinate"
          value={percentage}
          size={150}
          thickness={4}
          sx={{
            color: '#3eb8b2',
            position: 'absolute',
            left: 0,
          }}
        />

        {/* Center text */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            {left}
          </Typography>
          <Typography variant="body2" sx={{ color: '#555' }}>
            of {total} credits left
          </Typography>
        </Box>
      </Box>

      {/* Below text */}
      <Typography
        variant="body1"
        sx={{ mt: 2, color: '#a0a3bd', fontWeight: 500 }}
      >
        {consumed} credits consumed
      </Typography>
    </Box>
  );
};

export default CreditsProgress;
