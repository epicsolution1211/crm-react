import numeral from 'numeral';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import { getAssetPath } from "src/utils/asset-path";

const countries = [
  {
    flag: getAssetPath('/assets/flags/flag-us.svg'),
    name: 'United States',
    seo: 40,
    visits: 58200
  },
  {
    flag: getAssetPath('/assets/flags/flag-es.svg'),
    name: 'Spain',
    seo: 47,
    visits: 22700
  },
  {
    flag: getAssetPath('/assets/flags/flag-uk.svg'),
    name: 'United Kingdom',
    seo: 65,
    visits: 10360
  },
  {
    flag: getAssetPath('/assets/flags/flag-de.svg'),
    name: 'Germany',
    seo: 23,
    visits: 5749
  },
  {
    flag: getAssetPath('/assets/flags/flag-ca.svg'),
    name: 'Canada',
    seo: 45,
    visits: 5432
  }
];

export const LandingAnalyticsCountryTable = ({ action }) => (

  <Card>
    <CardHeader title="Country Count" />
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>
            Country
          </TableCell>
          <TableCell sx={{ whiteSpace: "nowrap" }}>
            TOTAL LEADS
          </TableCell>
          <TableCell sx={{ whiteSpace: "nowrap" }}>
            VERIFIED LEADS
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {countries.map((country) => {
          const visits = numeral(country.visits).format('0,0');
          return (
            <TableRow
              key={country.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell>
                <Stack
                  alignItems="center"
                  direction="row"
                  spacing={2}
                >
                  <Box
                    sx={{
                      height: 36,
                      width: 36,
                      '& img': {
                        height: 36,
                        width: 36
                      }
                    }}
                  >
                    <img
                      alt={country.name}
                      src={country.flag}
                    />
                  </Box>
                  <Typography variant="subtitle2">
                    {country.name}
                  </Typography>
                </Stack>
              </TableCell>
              <TableCell>
                {visits}
              </TableCell>
              <TableCell>
                {country.seo}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
    <Divider />
    <CardActions>
      {action}
    </CardActions>
  </Card>
);
