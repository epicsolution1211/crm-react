import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { Iconify } from 'src/components/iconify';

import { HomeWorldMap } from './home-world-map';
import { RouterLink } from 'src/components/router-link';
import { paths } from 'src/paths';

export const HomePage = () => {
  const theme = useTheme();
  const markerColor = theme.palette.primary.main;

  return (
    <Stack id='home' direction='row' width={1} justifyContent='center' alignItems='center' sx={{ pt: { md: 3.5, xs: 2 }, pb: 8 }}>
      <Container maxWidth="md"
      >
        <Stack direction='column' width={1} justifyContent='center' alignItems='center'>
          <Typography
            textAlign='center'
            variant="h1"
          >
            Empower Your Business
          </Typography>
          <Typography
            textAlign='center'
            color="primary.main"
            variant="h1"
          >
            Have Data on Your side
          </Typography>
          <Typography
            textAlign='center'
            variant="h1"
          >
            Streamline Workflows
          </Typography>
          <Typography
            color="text.secondary"
            sx={{
              py: 5,
              px: 5,
              fontSize: 20,
              fontWeight: 500,
              textAlign: 'center'
            }}
          >
            Unlock the full potential of your business with our cutting-edge solutions. Leverage the power of data and streamlined workflows to drive success and efficiency.
          </Typography>
          <Stack
            alignItems="center"
            direction="row"
            flexWrap="wrap"
            spacing={1}
            pb={2}
          >
            <Rating
              readOnly
              value={4.7}
              precision={0.1}
              max={5}
            />
            <Typography
              color="text.primary"
              variant="caption"
              sx={{ fontWeight: 700 }}
            >
              4.7/5
            </Typography>
            <Typography
              color="text.secondary"
              variant="caption"
            >
              based on (70+ reviews)
            </Typography>
          </Stack>
          <Stack
            alignItems="center"
            direction="row"
            spacing={2}
            pt={2}
          >
            <Button
              component={RouterLink}
              href={paths.home.contactUs}
              startIcon={(
                <Iconify icon="iconamoon:eye" width={24} />
              )}
              sx={(theme) => theme.palette.mode === 'dark'
                ? {
                  width: 145,
                  backgroundColor: 'neutral.50',
                  color: 'neutral.900',
                  '&:hover': {
                    backgroundColor: 'neutral.200'
                  }
                }
                : {
                  width: 145,
                  backgroundColor: 'neutral.900',
                  color: 'neutral.50',
                  '&:hover': {
                    backgroundColor: 'neutral.700'
                  }
                }}
              variant="contained"
            >
              Live Demo
            </Button>
            <Button
              component={RouterLink}
              href={paths.home.product}
              sx={{ width: 145 }}
              color="inherit"
              startIcon={(
                <Iconify icon="ci:bar-bottom" width={24} />
              )}
            >
              Products
            </Button>
          </Stack>
          <Stack sx={{ pt: 4, maxWidth: 500, width: 1 }}>
            <HomeWorldMap markerColor={markerColor} />
          </Stack>
        </Stack>
        <Stack direction='row' justifyContent='center' pt={3}>
          <Chip
            label="V4.1.0"
            size="small"
          />
        </Stack>
      </Container>
    </Stack>
  );
};
