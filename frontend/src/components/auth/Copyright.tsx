import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

const Copyright = () => {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        NUSwaps
      </Link>{' '}
      {'.'}
    </Typography>
  );
};

export default Copyright;
