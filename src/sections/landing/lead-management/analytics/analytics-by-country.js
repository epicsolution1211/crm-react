import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

import { AnalyticsWorldMap } from './analytics-world-map';
import { getAssetPath } from "src/utils/asset-path";

const flagMap = {
  au: getAssetPath('/assets/flags/flag-au.svg'),
  ca: getAssetPath('/assets/flags/flag-ca.svg'),
  de: getAssetPath('/assets/flags/flag-de.svg'),
  es: getAssetPath('/assets/flags/flag-es.svg'),
  in: getAssetPath('/assets/flags/flag-in.svg'),
  ru: getAssetPath('/assets/flags/flag-ru.svg'),
  uk: getAssetPath('/assets/flags/flag-uk.svg'),
  us: getAssetPath('/assets/flags/flag-us.svg')
};

export const LandingAnalyticsCountry = (props) => {
  const { sales } = props;
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
        sx={{ pt: 5, mb: 4 }}
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
          <AnalyticsWorldMap markerColor={markerColor} />
        </Box>
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
            {sales.map((sale) => {
              const flag = flagMap[sale.id];

              return (
                <Stack
                  alignItems="center"
                  direction="row"
                  key={sale.id}
                  spacing={1}
                >
                  <Box
                    sx={{
                      height: 48,
                      width: 48
                    }}
                  >
                    <img src={flag} />
                  </Box>
                  <Stack
                    spacing={1}
                    sx={{ flexGrow: 1 }}
                  >
                    <Typography variant="subtitle2">
                      {sale.country}
                    </Typography>
                    <Stack
                      alignItems="center"
                      direction="row"
                      spacing={3}
                    >
                      <LinearProgress
                        sx={{ flexGrow: 1 }}
                        value={sale.amount}
                        variant="determinate"
                      />
                      <Typography>
                        {sale.amount}%
                      </Typography>
                    </Stack>
                  </Stack>
                </Stack>
              );
            })}
          </Stack>
        </Box>
      </Stack>
    </Card>
  );
};

LandingAnalyticsCountry.propTypes = {
  sales: PropTypes.array.isRequired
};
