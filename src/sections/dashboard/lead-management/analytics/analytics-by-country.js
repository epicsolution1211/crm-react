import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import Box from "@mui/material/Box";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from "src/components/scrollbar";
import { TableSkeleton } from "src/components/table-skeleton";
import { countries } from "src/utils/constant";
import { useAuth } from "src/hooks/use-auth";
import { getAssetPath } from "src/utils/asset-path";

export const AnalyticsByCounty = ({
  data,
  onClick,
  isLoading,
  isPublic = false,
}) => {
  const { user } = useAuth();
  return (
    <Card>
      <CardHeader title="Country Count" />
      <Scrollbar>
        <Table>
          <TableHead>
            <TableRow>
              {["Country", "Total Leads", "Verified Leads"]?.map((item) => (
                <TableCell key={item} sx={{ whiteSpace: "nowrap" }}>
                  {item}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableSkeleton rowCount={5} cellCount={3} />
            ) : (
              data?.map((item, index) => (
                <TableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Iconify 
                        icon={`circle-flags:${item?.country?.toLowerCase()}`}
                        width={24}
                      />
                      <Typography variant="subtitle2" noWrap>
                        {countries?.find((country) => country?.code === item?.country)?.label}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{item?.total_leads}</TableCell>
                  <TableCell>{item?.verified_leads}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Scrollbar>
      {!isLoading && !data?.length && (
        <Box
          sx={{
            py: 5,
            maxWidth: 1,
            alignItems: "center",
            display: "flex",
            flexGrow: 1,
            flexDirection: "column",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <Box
            component="img"
            src={getAssetPath("/assets/errors/error-404.png")}
            sx={{
              height: "auto",
              maxWidth: 120,
            }}
          />
          <Typography color="text.secondary" sx={{ mt: 2 }} variant="subtitle1">
            No Data.
          </Typography>
        </Box>
      )}
      <Divider />
      {isPublic || (user?.acc?.acc_v_lm_leads !== undefined && !user?.acc?.acc_v_lm_leads) ? null : (
        <CardActions>
          <Button
            color="inherit"
            endIcon={<Iconify icon="octicon:arrow-right-16" width={22} />}
            onClick={() => onClick()}
            size="small"
          >
            See more
          </Button>
        </CardActions>
      )}
    </Card>
  );
};
