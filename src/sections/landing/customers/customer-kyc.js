import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Iconify } from 'src/components/iconify';
import { countries } from "src/utils/constant";
import { getAssetPath } from "src/utils/asset-path";

export const LandingCustomerKyc = ({ customer }) => (
  <Card>
    <CardHeader title={<Typography variant="h5">KYC</Typography>} />
    <CardContent>
      <Stack spacing={5}>
        <Stack direction="row" alignItems="center" spacing={3}>
          <Typography variant="h6">Country of residence:</Typography>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Stack direction="row" alignItems="center" spacing={1} pr={2}>
              <Iconify 
                icon={`circle-flags:${(customer?.country ?? "").toLowerCase()}`}
                width={35}
                sx={{ ml: "7px" }}
              />
              <Typography variant="h6">
                {countries.find(
                  (c) => c.code === customer?.country
                )?.label}
              </Typography>
            </Stack>
            <Button
              variant="outlined"
            >
              Change
            </Button>
          </Stack>
        </Stack>

        <Stack spacing={5}>
          <Typography variant="h6">ID</Typography>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <Stack spacing={2} alignItems="center">
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Typography variant="h6">Front side</Typography>
                </Stack>
                <Box
                  sx={{
                    pt: 4,
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
                    }} />
                  <Typography
                    color="text.secondary"
                    sx={{ mt: 2 }}
                    variant="subtitle1"
                  >
                    There is no image
                  </Typography>
                </Box>

              </Stack>
            </Grid>
            <Grid item xs={6}>
              <Stack spacing={2} alignItems="center">
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Typography variant="h6">Back side</Typography>
                </Stack>
                <Box
                  sx={{
                    pt: 4,
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
                    }} />
                  <Typography
                    color="text.secondary"
                    sx={{ mt: 2 }}
                    variant="subtitle1"
                  >
                    There is no image
                  </Typography>
                </Box>

              </Stack>
            </Grid>
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Button
                  variant="contained"
                  color="success"
                  sx={{ width: "120px" }}
                >
                  Approve
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  sx={{ width: "120px" }}
                >
                  Reject
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Stack>

        <Stack spacing={5} sx={{ pt: 5 }}>
          <Typography variant="h6">Proof of address</Typography>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <Stack spacing={1} alignItems="center">
                <Typography>Billing</Typography>
                {(<Box
                  sx={{
                    pt: 4,
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
                    }} />
                  <Typography
                    color="text.secondary"
                    sx={{ mt: 2 }}
                    variant="subtitle1"
                  >
                    There is no image
                  </Typography>
                </Box>
                )}
              </Stack>
            </Grid>
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Button
                  variant="contained"
                  color="success"
                  sx={{ width: "120px" }}
                >
                  Approve
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  sx={{ width: "120px" }}
                >
                  Reject
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Stack>
      </Stack>
    </CardContent>
  </Card>
);
