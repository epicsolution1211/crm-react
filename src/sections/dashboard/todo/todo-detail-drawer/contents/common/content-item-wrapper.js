import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

export const ContentInfoItemWrapper = ({ title, children, startIcon }) => {
  return (
    <>
      <Grid xs={4} sm={3}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Stack sx={{ width: 16, alignItems: 'center' }}>
            {startIcon}
          </Stack>
          <Typography
            color="text.secondary"
            variant="caption"
            whiteSpace="nowrap"
          >
            {`${title} :`}
          </Typography>
        </Stack>
      </Grid>
      <Grid xs={8} sm={9} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
        {children}
      </Grid>
    </>
  );
};