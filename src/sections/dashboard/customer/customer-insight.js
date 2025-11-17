import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";

import { RouterLink } from "src/components/router-link";
import { SeverityPill } from "src/components/severity-pill";
import { countries } from "src/utils/constant";
import { format } from "date-fns";
import { paths } from "src/paths";
import { Iconify } from "src/components/iconify";

export const CustomerInsight = (props) => {
  const { customer } = props;

  return (
    <Card 
      {...props}
      sx={{
        height: 'fit-content',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        borderRadius: 2,
        '&:hover': {
          boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
          transition: 'box-shadow 0.3s ease-in-out'
        }
      }}
    >
      <CardHeader 
        title="Insight" 
      />
      <CardContent
        sx={{
          pt: 2,
          pb: 3,
          px: { xs: 3},
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        {customer?.client?.brand_status_array?.length > 0 && (
          <Box>
            <Typography 
              sx={{ 
                mb: 2, 
                mx: 1
              }}
            >
              Brand Statuses
            </Typography>
            <Stack spacing={2}>
              {customer?.client?.brand_status_array?.map((status) => (
                <Box
                  key={status?.value}
                  sx={{
                    p: 2,
                    borderRadius: 1.5,
                    backgroundColor: 'background.neutral',
                    border: '1px solid',
                    borderColor: 'divider',
                    '&:hover': {
                      backgroundColor: 'background.paper',
                      borderColor: 'primary.main',
                      transition: 'all 0.2s ease-in-out'
                    }
                  }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Stack direction="row" alignItems="center" gap={1.5} flexWrap="wrap">
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: 'text.secondary',
                            fontWeight: 500,
                            lineHeight: 1,
                            letterSpacing: 0.5,
                            fontSize: { xs: 14 }
                          }}
                        >
                          Agent: 
                        </Typography>
                        {status?.account_id ? (
                          <Link
                            color="primary.main"
                            component={RouterLink}
                            href={paths.dashboard.settings + `/${status?.account_id}/access`}
                            sx={{
                              alignItems: "center",
                              display: "inline-flex",
                              textDecoration: 'none',
                              '&:hover': {
                                textDecoration: 'underline'
                              },
                            }}
                          >
                            <Typography sx={{ fontWeight: 500, fontSize: { xs: 14 }, lineHeight: 1, wordBreak: 'break-word' }}>
                              {status?.account_name}
                            </Typography>
                          </Link>
                        ) : (
                          <Typography sx={{ color: 'text.secondary', fontStyle: 'italic', lineHeight: 1, fontSize: { xs: 14 } }}>
                            n/a
                          </Typography>
                        )}
                      </Stack>
                    </Grid>

                    <Grid item xs={12}>
                      <Stack direction="row" alignItems="center" gap={1.5} flexWrap="wrap">
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: 'text.secondary',
                            fontWeight: 500,
                            lineHeight: 1,
                            letterSpacing: 0.5,
                            fontSize: { xs: 14 }
                          }}
                        >
                          Value: 
                        </Typography>
                        <Typography sx={{ fontWeight: 500, fontSize: { xs: 14 }, lineHeight: 1, wordBreak: 'break-word' }}>
                          {status?.value}
                        </Typography>
                      </Stack>
                    </Grid>

                    <Grid item xs={12}>
                      <Stack direction="row" alignItems="center" gap={1.5} flexWrap="wrap">
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: 'text.secondary',
                            fontWeight: 500,
                            lineHeight: 1,
                            letterSpacing: 0.5,
                            fontSize: { xs: 14 }
                          }}
                        >
                          Created At: 
                        </Typography>
                        <Typography sx={{ fontWeight: 500, fontSize: { xs: 14 }, lineHeight: 1 }}>
                          {format(
                            new Date(status?.created_at),
                            "dd MMM yyyy HH:mm"
                          )}
                        </Typography>
                      </Stack>
                    </Grid>
                  </Grid>
                </Box>
              ))}
            </Stack>
          </Box>
        )}

        <Box>
          <Typography 
            sx={{ 
              mb: 2, 
              mx: 1
            }}
          >
            Phone Status
          </Typography>
          <Box
            sx={{
              p: { xs: 2 },
              borderRadius: 1.5,
              backgroundColor: 'background.neutral',
              border: '1px solid',
              borderColor: 'divider',
              overflowX: 'auto'
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Stack direction="row" alignItems="center" gap={1.5} flexWrap="wrap">
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: 600,
                      color: 'text.secondary',
                      lineHeight: 1,
                      fontSize: { xs: 14 },
                      minWidth: 0,
                      flexShrink: 0
                    }}
                  >
                    Country:
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    {customer?.phone_status?.country && (
                      <Iconify 
                        icon={`circle-flags:${customer?.phone_status?.country?.toLowerCase()}`} 
                        width={14}
                      />
                    )}
                    {customer?.phone_status?.country ? (
                      <Typography variant="body2" sx={{ lineHeight: 1, fontWeight: 500, fontSize: { xs: 12 }, py: 0.5, mx: '4px !important', wordBreak: 'break-word' }}>
                        {
                          countries.find(
                            (c) => c.code === customer?.phone_status?.country
                          )?.label
                        }
                      </Typography>
                    ) : (
                      <SeverityPill color="warning" sx={{ lineHeight: 1, py: 0.5, fontSize: { xs: 12 } }}>
                        n/a
                      </SeverityPill>
                    )}
                  </Stack>
                </Stack>
              </Grid>

              <Grid item xs={12}>
                <Stack direction="row" alignItems="center" gap={1.5} flexWrap="wrap">
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: 600,
                      color: 'text.secondary',
                      fontSize: { xs: 14 },
                      lineHeight: 1,
                      minWidth: 0,
                      flexShrink: 0
                    }}
                  >
                    Area Code:
                  </Typography>
                  <SeverityPill color="info" sx={{ fontSize: { xs: 12 }, lineHeight: 1, px: 1, py: 0.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {customer?.phone_status?.area_code ?? "n/a"}
                  </SeverityPill>
                </Stack>
              </Grid>

              <Grid item xs={12}>
                <Stack direction="row" alignItems="center" gap={1.5} flexWrap="wrap">
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: 600,
                      color: 'text.secondary',
                      lineHeight: 1,
                      fontSize: { xs: 14 },
                      minWidth: 0,
                      flexShrink: 0
                    }}
                  >
                    Human Type:
                  </Typography>
                  <SeverityPill color="success" sx={{ fontSize: { xs: 12 }, lineHeight: 1, px: 1, py: 0.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {customer?.phone_status?.human_type ?? "n/a"}
                  </SeverityPill>
                </Stack>
              </Grid>

              <Grid item xs={12}>
                <Stack direction="row" alignItems="center" gap={1.5} flexWrap="wrap">
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: 600,
                      color: 'text.secondary',
                      lineHeight: 1,
                      fontSize: { xs: 14 },
                      minWidth: 0,
                      flexShrink: 0
                    }}
                  >
                    Geo Name:
                  </Typography>
                  <SeverityPill color="primary" sx={{ fontSize: { xs: 12 }, lineHeight: 1, px: 1, py: 0.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {customer?.phone_status?.geo_name ?? "n/a"}
                  </SeverityPill>
                </Stack>
              </Grid>

              <Grid item xs={12}>
                <Stack direction="row" alignItems="center" gap={1.5} flexWrap="wrap">
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: 600,
                      color: 'text.secondary',
                      fontSize: { xs: 14 },
                      lineHeight: 1,
                      minWidth: 0,
                      flexShrink: 0
                    }}
                  >
                    Local Number:
                  </Typography>
                  <SeverityPill color="secondary" sx={{ fontSize: { xs: 14 }, lineHeight: 1, px: 0, py: 0.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {customer?.phone_status?.local_number ?? "n/a"}
                  </SeverityPill>
                </Stack>
              </Grid>

              <Grid item xs={12}>
                <Stack direction="row" alignItems="center" gap={1.5} flexWrap="wrap">
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: 600,
                      color: 'text.secondary',
                      fontSize: { xs: 14 },
                      lineHeight: 1,
                      minWidth: 0,
                      flexShrink: 0
                    }}
                  >
                    Timezone:
                  </Typography>
                  <SeverityPill color="warning" sx={{ fontSize: { xs: 12 }, lineHeight: 1, px: 1, py: 0.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {customer?.phone_status?.timezone ?? "n/a"}
                  </SeverityPill>
                </Stack>
              </Grid>

              <Grid item xs={12}>
                <Stack direction="row" alignItems="center" gap={1.5} flexWrap="wrap">
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: 600,
                      color: 'text.secondary',
                      fontSize: { xs: 14 },
                      lineHeight: 1,
                      minWidth: 0,
                      flexShrink: 0
                    }}
                  >
                    Carrier:
                  </Typography>
                  <SeverityPill color="info" sx={{ fontSize: { xs: 12 }, lineHeight: 1, px: 1, py: 0.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {customer?.phone_status?.carrier ?? "n/a"}
                  </SeverityPill>
                </Stack>
              </Grid>
            </Grid>
          </Box>
        </Box>

        <Stack spacing={2}>
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            alignItems={{ xs: 'flex-start', sm: 'center' }} 
            gap={1.5}
            sx={{
              p: { xs: 2 },
              borderRadius: 1.5,
              backgroundColor: 'background.neutral',
              border: '1px solid',
              borderColor: 'divider',
              flexWrap: 'wrap'
            }}
          >
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600,
                color: 'text.primary',
                fontSize: { xs: 14 },
                minWidth: 0,
                flexShrink: 0
              }}
            >
              Total Called:
            </Typography>
            <SeverityPill color="success" sx={{ fontSize: { xs: 12 }, px: 1, py: 0.5, lineHeight: 1 }}>
              {customer?.client?.total_called ?? 0}
            </SeverityPill>
          </Stack>

          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            alignItems={{ xs: 'flex-start', sm: 'center' }} 
            gap={1.5}
            sx={{
              p: { xs: 2 },
              borderRadius: 1.5,
              backgroundColor: 'background.neutral',
              border: '1px solid',
              borderColor: 'divider',
              flexWrap: 'wrap'
            }}
          >
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600,
                color: 'text.primary',
                fontSize: { xs: 14 },
                minWidth: 0,
                flexShrink: 0
              }}
            >
              Reaction Time:
            </Typography>
            <SeverityPill color="primary" sx={{ display: 'inline-block', fontSize: { xs: 12 }, px: 1, py: 0.5, whiteSpace: 'normal', lineHeight: 1, wordBreak: 'break-word', }}>
              {customer?.reaction_time ?? "n/a"}
            </SeverityPill>
          </Stack>
        </Stack>

      </CardContent>
    </Card>
  );
};
