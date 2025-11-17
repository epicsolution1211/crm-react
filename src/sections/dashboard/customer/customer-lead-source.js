import { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { statusApi } from "src/api/lead-management/status";
import { RouterLink } from "src/components/router-link";
import { useAuth } from "src/hooks/use-auth";
import { paths } from "src/paths";
import { countries } from "src/utils/constant";
import format from "date-fns-tz/format";
import { Iconify } from "src/components/iconify";

export const CustomerLeadSource = ({ leads }) => {
  const [customFields, setCustomFields] = useState([]);
  const { user } = useAuth();

  const getCustomFields = async () => {
    try {
      const { lead_fields } = await statusApi.getLeadCustomFields();
      setCustomFields(lead_fields);
    } catch (error) {
      console.error("error: ", error);
    }
  };

  useEffect(() => {
    getCustomFields();
  }, []);

  if (leads?.length === 0) {
    return (
      <Stack alignItems="center" justifyContent="center" sx={{ pt: 20 }}>
        <Typography variant="h5">There are no lead sources</Typography>
      </Stack>
    );
  }

  return (
    <Stack spacing={4}>
      <Typography variant="h5">Lead source</Typography>

      <Stack spacing={4}>
        {leads?.map((lead) => (
          <Card key={lead?.id}>
            <CardHeader 
              title={
                user?.acc?.acc_v_lead_management !== false && 
                user?.acc?.acc_v_lm_aff !== false && 
                lead?.account_id ? (
                  <Link
                    color="text.primary"
                    component={RouterLink}
                    href={paths.dashboard.lead.affiliate.detail.replace(
                      ":affiliateId",
                      lead?.account_id
                    )}
                    sx={{
                      alignItems: "center",
                      display: "inline-flex",
                      fontSize: "1.125rem",
                      fontWeight: "600",
                    }}
                    underline="hover"
                  >
                    {lead?.account_name}
                  </Link>
                ) : (
                  lead?.account_name
                )
              } 
            />
            <CardContent>
              <Grid container spacing={2}>
                {lead.id && (
                  <Grid item xs={4}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      ID:
                    </Typography>
                    <Link
                      color="text.primary"
                      component={RouterLink}
                      href={paths.dashboard.lead.status.detail.replace(
                        ":leadId",
                        lead?.id
                      )}
                      sx={{
                        alignItems: "center",
                        display: "inline-flex",
                        fontSize: "0.875rem",
                        fontWeight: "500",
                      }}
                      underline="hover"
                    >
                      {lead?.id}
                    </Link>
                  </Grid>
                )}

                {lead.agent_name && (
                  <Grid item xs={4}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Agent:
                    </Typography>
                    <Typography variant="subtitle2">
                      {lead?.agent_name}
                    </Typography>
                  </Grid>
                )}

                {lead?.brand_name && (
                  <Grid item xs={4}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Brand:
                    </Typography>
                    <Typography variant="subtitle2">
                      {lead?.brand_name}
                    </Typography>
                  </Grid>
                )}

                {lead?.campaign && (
                  <Grid item xs={4}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Campaign:
                    </Typography>
                    <Typography variant="subtitle2">
                      {lead?.campaign}
                    </Typography>
                  </Grid>
                )}

                {lead?.country && (
                  <Grid item xs={4}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Country:
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography variant="subtitle2">
                        {countries.find((c) => c.code === lead?.country)?.label}
                      </Typography>
                      <Iconify 
                        icon={`circle-flags:${lead?.country?.toLowerCase()}`}
                        width={25}
                      />
                    </Stack>
                  </Grid>
                )}

                {lead?.deposit && (
                  <Grid item xs={4}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Deposit:
                    </Typography>
                    <Typography variant="subtitle2">{lead?.deposit}</Typography>
                  </Grid>
                )}

                {lead?.description && (
                  <Grid item xs={4}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Description:
                    </Typography>
                    <Typography variant="subtitle2">
                      {lead?.description}
                    </Typography>
                  </Grid>
                )}

                {lead?.email &&
                (user?.acc?.acc_v_client_email === undefined ||
                  user?.acc?.acc_v_client_email) ? (
                  <Grid item xs={4}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Email:
                    </Typography>
                    <Typography variant="subtitle2">{lead?.email}</Typography>
                  </Grid>
                ) : null}

                {lead?.first_name && (
                  <Grid item xs={4}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      First Name:
                    </Typography>
                    <Typography variant="subtitle2">
                      {lead?.first_name}
                    </Typography>
                  </Grid>
                )}

                {lead?.last_name && (
                  <Grid item xs={4}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Last Name:
                    </Typography>
                    <Typography variant="subtitle2">
                      {lead?.last_name}
                    </Typography>
                  </Grid>
                )}

                {lead?.ftd_amount && (
                  <Grid item xs={4}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      FTD Amount:
                    </Typography>
                    <Typography variant="subtitle2">
                      {lead?.ftd_amount}
                    </Typography>
                  </Grid>
                )}

                {lead?.ftd_date && (
                  <Grid item xs={4}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      FTD Date:
                    </Typography>
                    <Typography variant="subtitle2">
                      {lead?.ftd_date}
                    </Typography>
                  </Grid>
                )}

                {lead?.ip_address && (
                  <Grid item xs={4}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      IP Address:
                    </Typography>
                    <Typography variant="subtitle2">
                      {lead?.ip_address}
                    </Typography>
                  </Grid>
                )}

                {lead?.labels?.length > 0 && (
                  <Grid item xs={4}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Labels:
                    </Typography>
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1}
                      sx={{ pt: 2 }}
                    >
                      {lead?.labels?.map((item) => (
                        <Chip
                          key={item.id}
                          label={item.name}
                          size="small"
                          color="primary"
                          sx={{
                            backgroundColor: item?.color,
                            mr: 1,
                          }}
                        />
                      ))}
                    </Stack>
                  </Grid>
                )}

                {lead?.language && (
                  <Grid item xs={4}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Language:
                    </Typography>
                    <Typography variant="subtitle2">
                      {lead?.language}
                    </Typography>
                  </Grid>
                )}

                {lead?.note && (
                  <Grid item xs={4}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Note:
                    </Typography>
                    <Typography variant="subtitle2">{lead?.note}</Typography>
                  </Grid>
                )}

                {lead?.phone &&
                (user?.acc?.acc_v_client_phone === undefined ||
                  user?.acc?.acc_v_client_phone) ? (
                  <Grid item xs={4}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Phone Number:
                    </Typography>
                    <Typography variant="subtitle2">{lead?.phone}</Typography>
                  </Grid>
                ) : null}

                {lead?.registration_date && (
                  <Grid item xs={4}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Registration Date:
                    </Typography>
                    <Typography variant="subtitle2">
                      {format(new Date(lead?.registration_date), "yyyy-MM-dd HH:mm:ss")}
                    </Typography>
                  </Grid>
                )}

                {lead?.source && (
                  <Grid item xs={4}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Source:
                    </Typography>
                    <Typography variant="subtitle2">{lead?.source}</Typography>
                  </Grid>
                )}

                {lead?.source_brand && (
                  <Grid item xs={4}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Source Brand:
                    </Typography>
                    <Typography variant="subtitle2">
                      {lead?.source_brand}
                    </Typography>
                  </Grid>
                )}

                {lead?.status && (
                  <Grid item xs={4}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Status:
                    </Typography>
                    <Typography variant="subtitle2">{lead?.status}</Typography>
                  </Grid>
                )}

                {lead?.team_name && (
                  <Grid item xs={4}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Team Name:
                    </Typography>
                    <Typography variant="subtitle2">
                      {lead?.team_name}
                    </Typography>
                  </Grid>
                )}

                {lead?.created_at && (
                  <Grid item xs={4}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Created At:
                    </Typography>
                    <Typography variant="subtitle2">
                      {format(new Date(lead?.created_at), "yyyy-MM-dd HH:mm:ss")}
                    </Typography>
                  </Grid>
                )}

                {lead?.lead_fields && (
                  <>
                    {customFields?.map((field) => {
                      const val = lead?.lead_fields[field?.id];

                      if (val) {
                        return (
                          <Grid item xs={4} key={field?.id}>
                            <Typography
                              variant="subtitle1"
                              sx={{ fontWeight: 600 }}
                            >
                              {field?.friendly_name}
                            </Typography>
                            <Typography>{val}</Typography>
                          </Grid>
                        );
                      }
                    })}
                  </>
                )}
              </Grid>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Stack>
  );
};
