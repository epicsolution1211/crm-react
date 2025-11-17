import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { useRouter } from "src/hooks/use-router";
import { useSearchParams } from "src/hooks/use-search-params";

export const OfferItemPublic = ({ offer }) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  return (
    <Grid item md={6} lg={6} xl={6} xs={12} sm={12}>
      <Card
        onClick={() =>
          router.push(
            `/offers/${offer?.id}?company=${searchParams.get("company")}`
          )
        }
        sx={{
          ":hover": {
            boxShadow: 20,
          },
          cursor: "pointer",
        }}
      >
        <CardHeader
          title={
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                <img
                  loading="lazy"
                  width="20"
                  src={`https://flagcdn.com/w20/${offer.country.toLowerCase()}.png`}
                  srcSet={`https://flagcdn.com/w40/${offer.country.toLowerCase()}.png 2x`}
                  alt=""
                />
                <Typography variant="h6">
                  {offer?.name.toUpperCase()}
                </Typography>
              </Stack>

              {offer?.active ? (
                <Typography variant="h6" sx={{ color: "green" }}>
                  ACTIVE
                </Typography>
              ) : (
                <Typography variant="h6" sx={{ color: "red" }}>
                  INACTIVE
                </Typography>
              )}
            </Stack>
          }
        />

        <CardContent sx={{ p: 3 }}>
          <Grid
            container
            spacing={{
              xs: 3,
              sm: 3,
              md: 8,
              lg: 8,
              xl: 8,
            }}
          >
            <Grid item xs={6}>
              <Stack spacing={2}>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography
                    sx={{
                      typography: {
                        xs: "h7",
                        sm: "h7",
                        md: "h6",
                        lg: "h6",
                        xl: "h6",
                      },
                    }}
                  >
                    Country:
                  </Typography>
                  <Typography
                    sx={{
                      typography: {
                        xs: "h7",
                        sm: "h7",
                        md: "h6",
                        lg: "h6",
                        xl: "h6",
                      },
                    }}
                  >
                    {offer?.country?.toUpperCase()}
                  </Typography>
                </Stack>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography
                    sx={{
                      typography: {
                        xs: "h7",
                        sm: "h7",
                        md: "h6",
                        lg: "h6",
                        xl: "h6",
                      },
                    }}
                  >
                    CR%:
                  </Typography>
                  <Typography
                    sx={{
                      typography: {
                        xs: "h7",
                        sm: "h7",
                        md: "h6",
                        lg: "h6",
                        xl: "h6",
                      },
                    }}
                  >
                    {offer?.cr}
                  </Typography>
                </Stack>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography
                    sx={{
                      typography: {
                        xs: "h7",
                        sm: "h7",
                        md: "h6",
                        lg: "h6",
                        xl: "h6",
                      },
                    }}
                  >
                    Avg. Player Value:
                  </Typography>
                  <Typography
                    sx={{
                      typography: {
                        xs: "h7",
                        sm: "h7",
                        md: "h6",
                        lg: "h6",
                        xl: "h6",
                      },
                    }}
                  >
                    {offer?.apv}
                  </Typography>
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={6}>
              <Stack spacing={2}>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography
                    sx={{
                      typography: {
                        xs: "h7",
                        sm: "h7",
                        md: "h6",
                        lg: "h6",
                        xl: "h6",
                      },
                    }}
                  >
                    CPL:
                  </Typography>
                  <Typography
                    sx={{
                      typography: {
                        xs: "h7",
                        sm: "h7",
                        md: "h6",
                        lg: "h6",
                        xl: "h6",
                      },
                    }}
                  >
                    {offer?.cpi}
                  </Typography>
                </Stack>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography
                    sx={{
                      typography: {
                        xs: "h7",
                        sm: "h7",
                        md: "h6",
                        lg: "h6",
                        xl: "h6",
                      },
                    }}
                  >
                    CRG%:
                  </Typography>
                  <Typography
                    sx={{
                      typography: {
                        xs: "h7",
                        sm: "h7",
                        md: "h6",
                        lg: "h6",
                        xl: "h6",
                      },
                    }}
                  >
                    {offer?.crg}
                  </Typography>
                </Stack>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography
                    sx={{
                      typography: {
                        xs: "h7",
                        sm: "h7",
                        md: "h6",
                        lg: "h6",
                        xl: "h6",
                      },
                    }}
                  >
                    Min Order:
                  </Typography>
                  <Typography
                    sx={{
                      typography: {
                        xs: "h7",
                        sm: "h7",
                        md: "h6",
                        lg: "h6",
                        xl: "h6",
                      },
                    }}
                  >
                    {offer?.min}
                  </Typography>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
};
