import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import LinearProgress from '@mui/material/LinearProgress';
import { Iconify } from 'src/components/iconify';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

import { WorldMap } from './world-map';
import { countries } from 'src/utils/constant';
import Skeleton from '@mui/material/Skeleton';

export const AnalyticsMapByCountry = ({ data, isLoading }) => {
  const theme = useTheme();
  const markerColor = theme.palette.primary.main;

  return (
    <Card>
      <CardHeader title="Analytics by Country" />
      <Stack
        alignItems={{
          md: 'center'
        }}
        component={CardContent}
        direction={{
          xs: 'column',
          sm: 'row'
        }}
        spacing={3}
        sx={{
          pt: 0,
          minHeight: 340
        }}
      >
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'center',
            flexGrow: 1,
            flexShrink: 1,
            flexBasis: {
              xs: '100%',
              md: '50%',
              lg: '60%'
            }
          }}
        >
          <WorldMap
            markerColor={markerColor}
            data={data} />
        </Box>
        {isLoading && <Box
          sx={{
            flexGrow: 1,
            flexShrink: 1,
            flexBasis: {
              xs: '100%',
              md: '50%',
              lg: '40%'
            }
          }}
        >
          <Stack
            component="ul"
            spacing={2}
            sx={{
              listStyle: 'none',
              m: 0,
              p: 0
            }}
          >
            {
              [...new Array(5).keys()]?.map((item) => (
                <Stack key={item}>
                  <Skeleton
                    sx={{ height: '53px' }}
                  />
                </Stack>
              ))
            }
          </Stack>
        </Box>}
        {(!!data?.length && !isLoading) &&
          <Box
            sx={{
              flexGrow: 1,
              flexShrink: 1,
              flexBasis: {
                xs: '100%',
                md: '50%',
                lg: '40%'
              }
            }}
          >
            <Stack
              component="ul"
              spacing={2}
              sx={{
                listStyle: 'none',
                m: 0,
                p: 0
              }}
            >
              {data?.map((item, index) => (
                <Stack
                  alignItems="center"
                  direction="row"
                  key={index}
                  spacing={2}
                >
                  <Iconify 
                    icon={`circle-flags:${item?.country?.toLowerCase()}`}
                    width={24}
                  />
                  <Stack
                    spacing={1}
                    sx={{ flexGrow: 1 }}
                  >
                    <Typography variant="subtitle2">
                      {countries?.find((country) => (country?.code === item?.country))?.label}
                    </Typography>
                    <Stack
                      alignItems="center"
                      direction="row"
                      spacing={3}
                    >
                      <LinearProgress
                        sx={{ flexGrow: 1 }}
                        value={parseFloat(item.percentage?.split('%')[0])}
                        variant="determinate" />
                      <Typography>
                        {item.percentage}
                      </Typography>
                    </Stack>
                  </Stack>
                </Stack>
              ))}
            </Stack>
          </Box>}
      </Stack>
    </Card>
  );
};
