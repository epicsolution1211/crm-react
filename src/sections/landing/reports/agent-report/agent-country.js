import { useMemo } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Unstable_Grid2';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Iconify } from 'src/components/iconify';

import { AgentWorldMap } from './agent-world-map';
import { countries } from 'src/utils/constant';

export const AgentCountry = ({report}) => {
  const theme = useTheme();
  const markerColor = theme.palette.primary.main;
  const xlUp = useMediaQuery((theme) => theme.breakpoints.down('xl'));

  const geoReportInfo = useMemo(()=> {
    if(report) {
      const result = report?.client_geo_report?.map((item)=> ({ code: item?.country, amount:item?.total } ))
      return result;
    }
  }, [report]);

  return (
    <Grid xs={12} sm={6}>
      <Card sx={{p:1}}>
        <CardHeader title="Geo Distribution vs FTD" />
        <Stack
          alignItems={{
            md: 'center'
          }}
          component={CardContent}
          direction={{
            xs: 'column',
            sm: 'row'
          }}
          gap={4}
          sx={{ pt: 2 }}
        >
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
            {geoReportInfo?.map((country) => {
                return (
                  <Stack
                    alignItems="center"
                    direction="row"
                    key={country.code}
                    spacing={2}
                  >
                    <Iconify 
                      icon={`circle-flags:${country?.code?.toLowerCase()}`}
                      width={35}
                      sx={{ borderRadius: 0.75 }}
                    />
                    <Stack
                      spacing={1}
                      sx={{ flexGrow: 1 }}
                    >
                      <Typography variant="subtitle2">
                        {countries?.find((item) => {
                          return item.code === country.code;
                        })?.label}
                      </Typography>
                      <Stack
                        alignItems="center"
                        direction="row"
                        spacing={3}
                      >
                        <LinearProgress
                          sx={{ flexGrow: 1 }}
                          value={country?.amount}
                          variant="determinate"
                        />
                        <Typography>
                          {country?.amount}%
                        </Typography>
                      </Stack>
                    </Stack>
                  </Stack>
                );
              })}
            </Stack>
          </Box>
        {!xlUp &&
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
            <AgentWorldMap markerColor={markerColor} />
          </Box>}
        </Stack>
      </Card>
    </Grid>
  );
};

