import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

import { Iconify } from "src/components/iconify";
import { PayWallLayout } from "src/layouts/dashboard/paywall-layout";
import { RouterLink } from "src/components/router-link";
import { Seo } from "src/components/seo";
import { SeverityPill } from "src/components/severity-pill";
import { betsApi } from "src/api/bets";
import { currencyFlagMap, currencyOption } from "src/utils/constant";
import { paths } from "src/paths";
import { toast } from "react-hot-toast";
import { useAuth } from "src/hooks/use-auth";
import { usePageView } from "src/hooks/use-page-view";
import { useTimezone } from "src/hooks/use-timezone";

const statuses = {
  "settled_win": "Settled Win",
  "settled_loss": "Settled Loss",
  "settled_push": "Settled Push",
  "pending": "Pending",
  "cancelled": "Cancelled",
  "voided": "Voided",
};

const Page = () => {
  usePageView();

  const { betId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toLocalTime } = useTimezone();

  const [bet, setBet] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.acc?.acc_v_risk_bets === false) {
      navigate(paths.notFound);
    }
  }, [user, navigate]);

  const getBet = async () => {
    try {
      setIsLoading(true);
      const res = await betsApi.getBets({ ids: [betId] });
      if (res?.bets?.length > 0) {
        setBet(res.bets[0]);
      }
    } catch (error) {
      console.error("error: ", error);
      toast.error("Failed to fetch bet details");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (betId) {
      getBet();
    }
  }, [betId]);

  if (isLoading) {
    return (
      <Box
        component="main"
        sx={{ flexGrow: 1, pt: 7, pb: 2 }}
      >
        <Container maxWidth="xxl">
          <Typography>Loading...</Typography>
        </Container>
      </Box>
    );
  }

  if (!bet) {
    return (
      <Box
        component="main"
        sx={{ flexGrow: 1, pt: 7, pb: 2 }}
      >
        <Container maxWidth="xxl">
          <Typography>Bet not found</Typography>
        </Container>
      </Box>
    );
  }

  return (
    <>
      <Seo title={`Dashboard: Bet ${bet.id}`} />
      <Box
        component="main"
        sx={{ flexGrow: 1, pt: 7, pb: 2 }}
      >
        <Container maxWidth="xxl">
          <Stack spacing={4}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <IconButton
                component={RouterLink}
                href={paths.dashboard.risk.bets}
                sx={{ '&:hover': { color: 'primary.main' } }}
              >
                <ArrowBackIcon />
              </IconButton>
              <Stack spacing={1}>
                <Typography variant="h4">Bet Details</Typography>
                <Typography variant="body2" color="text.secondary">
                  ID: {bet.id}
                </Typography>
              </Stack>
            </Stack>
            <PayWallLayout>
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Card>
                    <Box sx={{ p: 3 }}>
                      <Typography variant="h6" sx={{ mb: 2 }}>
                        Basic Information
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="text.secondary">
                            Client
                          </Typography>
                          <Link
                            color="text.primary"
                            component={RouterLink}
                            href={`${paths.dashboard.customers.index}/${bet.client_id}`}
                            sx={{
                              alignItems: 'center',
                              display: 'inline-flex'
                            }}
                            underline="hover"
                          >
                            <Typography variant="body1">
                              {bet.client_name ?? ""}
                            </Typography>
                          </Link>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="text.secondary">
                            External Bet ID
                          </Typography>
                          <Typography variant="body1">
                            {bet.external_bet_id || "N/A"}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="text.secondary">
                            External Brand
                          </Typography>
                          <Typography variant="body1">
                            {bet.external_brand || "N/A"}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="text.secondary">
                            External User ID
                          </Typography>
                          <Typography variant="body1">
                            {bet.external_user_id || "N/A"}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="text.secondary">
                            Source System
                          </Typography>
                          <Typography variant="body1">
                            {bet.source_system || "N/A"}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="text.secondary">
                            Bet Type
                          </Typography>
                          <SeverityPill
                            color={
                              bet.bet_type === "sports"
                                ? "success"
                                : bet.bet_type === "casino"
                                  ? "warning"
                                  : "info"
                            }
                          >
                            {bet.bet_type || "N/A"}
                          </SeverityPill>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="text.secondary">
                            Bet Category
                          </Typography>
                          <Typography variant="body1">
                            {bet.bet_category || "N/A"}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="text.secondary">
                            Bet Sub Type
                          </Typography>
                          <Typography variant="body1">
                            {bet.bet_sub_type || "N/A"}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="text.secondary">
                            Platform
                          </Typography>
                          <Typography variant="body1">
                            {bet.platform || "N/A"}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="text.secondary">
                            Timing
                          </Typography>
                          <Typography variant="body1">
                            {bet.timing || "N/A"}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                    <Divider />
                    <Box sx={{ p: 3 }}>
                      <Typography variant="h6" sx={{ mb: 2 }}>
                        Financial Information
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="text.secondary">
                            Real Balance Before
                          </Typography>
                          <Typography variant="body1">
                            {bet.real_balance_before || "N/A"}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="text.secondary">
                            Real Balance After
                          </Typography>
                          <Typography variant="body1">
                            {bet.real_balance_after || "N/A"}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="text.secondary">
                            Bonus Balance Before
                          </Typography>
                          <Typography variant="body1">
                            {bet.bonus_balance_before || "N/A"}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="text.secondary">
                            Bonus Balance After
                          </Typography>
                          <Typography variant="body1">
                            {bet.bonus_balance_after || "N/A"}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                    <Divider />
                    <Box sx={{ p: 3 }}>
                      <Typography variant="h6" sx={{ mb: 2 }}>
                        Bet Details
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="text.secondary">
                            Account ID
                          </Typography>
                          <Typography variant="body1">
                            {bet.account_id || "N/A"}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="text.secondary">
                            Desk ID
                          </Typography>
                          <Typography variant="body1">
                            {bet.desk_id || "N/A"}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="text.secondary">
                            Description
                          </Typography>
                          <Typography variant="body1">
                            {bet.description || "N/A"}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                    <Divider />
                    <Box sx={{ p: 3 }}>
                      <Typography variant="h6" sx={{ mb: 2 }}>
                        Financial Information
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="text.secondary">
                            Bet Amount
                          </Typography>
                          <Typography variant="h6">
                            {bet.bet_amount || "0.00"}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="text.secondary">
                            Win Amount
                          </Typography>
                          <Typography variant="h6" color={bet.win_amount > 0 ? "success.main" : "text.primary"}>
                            {bet.win_amount || "0.00"}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="text.secondary">
                            Potential Win
                          </Typography>
                          <Typography variant="body1">
                            {bet.potential_win || "0.00"}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="text.secondary">
                            Total Odds
                          </Typography>
                          <Typography variant="body1">
                            {bet.total_odds || "N/A"}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="text.secondary">
                            Selection Count
                          </Typography>
                          <Typography variant="body1">
                            {bet.selection_count || "N/A"}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="text.secondary">
                            Currency
                          </Typography>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Iconify icon={bet.currency ? currencyFlagMap[bet.currency] : currencyFlagMap[1]} width={24}/>
                            <Typography variant="body1">
                              {bet.currency ? currencyOption?.find((currency) => currency?.value === bet.currency)?.name : "USD"}
                            </Typography>
                          </Stack>
                        </Grid>
                      </Grid>
                    </Box>
                    <Divider />
                    <Box sx={{ p: 3 }}>
                      <Typography variant="h6" sx={{ mb: 2 }}>
                        Status & Processing
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="text.secondary">
                            Status
                          </Typography>
                          <SeverityPill
                            color={
                              bet.status === "settled_win"
                                ? "success"
                                : bet.status === "settled_loss"
                                  ? "error"
                                  : bet.status === "pending"
                                    ? "warning"
                                    : "info"
                            }
                          >
                            {statuses[bet.status] || bet.status}
                          </SeverityPill>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="text.secondary">
                            Settlement Status
                          </Typography>
                          <Typography variant="body1">
                            {bet.settlement_status || "N/A"}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="text.secondary">
                            Processing Status
                          </Typography>
                          <SeverityPill
                            color={
                              bet.processing_status === "processed"
                                ? "success"
                                : bet.processing_status === "processing"
                                  ? "warning"
                                  : "error"
                            }
                          >
                            {bet.processing_status || "N/A"}
                          </SeverityPill>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="text.secondary">
                            Is Processed
                          </Typography>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Iconify icon={bet.is_processed ? "mdi:check-circle-outline" : "mdi:close-circle-outline"} color={bet.is_processed ? "success.main" : "error.main"} width={24} />
                          </Stack>
                        </Grid>
                      </Grid>
                    </Box>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Stack spacing={3} sx={{ pr: { md: 4 } }}>
                    <Card>
                      <Box sx={{ p: 3 }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                          Bet Properties
                        </Typography>
                        <Stack spacing={2}>
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">
                              Live
                            </Typography>
                            <Iconify icon={bet.is_live ? "mdi:check-circle-outline" : "mdi:close-circle-outline"} color={bet.is_live ? "success.main" : "error.main"} width={24} />
                          </Stack>
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">
                              Virtual
                            </Typography>
                            <Iconify icon={bet.is_virtual ? "mdi:check-circle-outline" : "mdi:close-circle-outline"} color={bet.is_virtual ? "success.main" : "error.main"} width={24} />
                          </Stack>
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">
                              Cash Out
                            </Typography>
                            <Iconify icon={bet.is_cash_out ? "mdi:check-circle-outline" : "mdi:close-circle-outline"} color={bet.is_cash_out ? "success.main" : "error.main"} width={24} />
                          </Stack>
                        </Stack>
                      </Box>
                    </Card>
                    <Card>
                      <Box sx={{ p: 3 }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                          Dates
                        </Typography>
                        <Stack spacing={2}>
                          <Stack>
                            <Typography variant="body2" color="text.secondary">
                              Bet Date
                            </Typography>
                            <Typography variant="body1">
                              {bet.bet_date ? toLocalTime(bet.bet_date) : "N/A"}
                            </Typography>
                          </Stack>
                          <Stack>
                            <Typography variant="body2" color="text.secondary">
                              Settlement Date
                            </Typography>
                            <Typography variant="body1">
                              {bet.settlement_date ? toLocalTime(bet.settlement_date) : "N/A"}
                            </Typography>
                          </Stack>
                          <Stack>
                            <Typography variant="body2" color="text.secondary">
                              Event Date
                            </Typography>
                            <Typography variant="body1">
                              {bet.event_date ? toLocalTime(bet.event_date) : "N/A"}
                            </Typography>
                          </Stack>
                          <Stack>
                            <Typography variant="body2" color="text.secondary">
                              Created At
                            </Typography>
                            <Typography variant="body1">
                              {toLocalTime(bet.created_at)}
                            </Typography>
                          </Stack>
                        </Stack>
                      </Box>
                    </Card>
                    {bet.competitors && bet.competitors.length > 0 && (
                      <Card>
                        <Box sx={{ p: 3 }}>
                          <Typography variant="h6" sx={{ mb: 2 }}>
                            Competitors
                          </Typography>
                          <Stack spacing={1}>
                            {bet.competitors.map((competitor, index) => (
                              <Typography key={index} variant="body1">
                                {competitor}
                              </Typography>
                            ))}
                          </Stack>
                        </Box>
                      </Card>
                    )}
                    {bet.sport_data && (
                      <Card>
                        <Box sx={{ p: 3 }}>
                          <Typography variant="h6" sx={{ mb: 2 }}>
                            Sport Data
                          </Typography>
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="body2" color="text.secondary">
                                League
                              </Typography>
                              <Typography variant="body1">
                                {bet.sport_data.league || "N/A"}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="body2" color="text.secondary">
                                Market
                              </Typography>
                              <Typography variant="body1">
                                {bet.sport_data.market || "N/A"}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="body2" color="text.secondary">
                                Outcome
                              </Typography>
                              <Typography variant="body1">
                                {bet.sport_data.outcome || "N/A"}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="body2" color="text.secondary">
                                Sport Type
                              </Typography>
                              <Typography variant="body1">
                                {bet.sport_data.sport_type || "N/A"}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Box>
                      </Card>
                    )}
                    {bet.webhook_data && (
                      <Card>
                        <Box sx={{ p: 3 }}>
                          <Typography variant="h6" sx={{ mb: 2 }}>
                            Webhook Data
                          </Typography>
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="body2" color="text.secondary">
                                Sport Match ID
                              </Typography>
                              <Typography variant="body1">
                                {bet.webhook_data.sport_match_id || "N/A"}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="body2" color="text.secondary">
                                Last Bet ID
                              </Typography>
                              <Typography variant="body1">
                                {bet.webhook_data.sport_last_bet_id || "N/A"}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="body2" color="text.secondary">
                                Last Bet Type
                              </Typography>
                              <Typography variant="body1">
                                {bet.webhook_data.sport_last_bet_type || "N/A"}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="body2" color="text.secondary">
                                Last Bet Amount
                              </Typography>
                              <Typography variant="body1">
                                {bet.webhook_data.sport_last_bet_amount || "N/A"}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Box>
                      </Card>
                    )}
                  </Stack>
                </Grid>
              </Grid>
            </PayWallLayout>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default Page;
