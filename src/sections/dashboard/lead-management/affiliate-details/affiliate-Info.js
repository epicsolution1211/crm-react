import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import Card from "@mui/material/Card";
import Grid from "@mui/material/Unstable_Grid2";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import { Iconify } from "src/components/iconify";
import { ConfirmationDialog } from "src/components/confirmation-dialog";
import { affiliateApi } from "src/api/lead-management/affiliate";
import { copyToClipboard } from "src/utils/copy-to-clipboard";
import { useAuth } from "src/hooks/use-auth";
import { useDebounce } from "src/hooks/use-debounce";

export const AffiliateInfo = ({ affiliate, updateAffiliate }) => {
  const { user } = useAuth();
  const [password, setPassword] = useState("");

  const [isActive, setIsActive] = useState(false);
  const [isIpValidation, setIsIpValidation] = useState(false);
  const [autoFtd, setAutoFtd] = useState(false);
  const [autoFtdAmount, setAutoFtdAmount] = useState(false);
  const [isByPass, setIsByPass] = useState(false);
  const [isLoginLink, setIsLoginLink] = useState(false);
  const [allowSignup, setAllowSignup] = useState(false);
  const [isDuplicateExpire, setIsDuplicateExpire] = useState(false);
  const [duplicateExpireDays, setDuplicateExpireDays] = useState(null);
  const [errorDuplicate, setErrorDuplicate] = useState(false);
  const [preventOffline, setPreventOffline] = useState(false);

  const [apiKeyHidden, setApiKeyHidden] = useState(true);
  const [passwordHidden, setPasswordHidden] = useState(true);
  const [openRefreshPasswordDialog, setOpenRefreshPasswordDialog] =
    useState(false);

  const newDuplicateExpireDays = useDebounce(duplicateExpireDays, 500);

  const handleSwitchChange = (value, target, silentUpdate = false) => {
    try {
      if (target === "active") {
        updateAffiliate(affiliate?.id, { aff_active: value });
        setIsActive(value);
      }
      if (target === "aff_ip_validation") {
        updateAffiliate(affiliate?.id, { aff_ip_validation: value });
        setIsIpValidation(value);
      }
      if (target === "auto_ftd") {
        updateAffiliate(affiliate?.id, { auto_ftd: value });
        setAutoFtd(value);
      }
      if (target === "auto_ftd_amount") {
        updateAffiliate(affiliate?.id, { auto_ftd_amount: value });
        setAutoFtdAmount(value);
      }
      if (target === "bypass") {
        updateAffiliate(affiliate?.id, { bypass_aff_verification: value });
        setIsByPass(value);
      }
      if (target === "login_link") {
        updateAffiliate(affiliate?.id, { return_aff_login: value });
        setIsLoginLink(value);
      }
      if (target === "duplicate_expire") {
        updateAffiliate(affiliate?.id, { duplicate_expire: value });
        setIsDuplicateExpire(value);
      }
      if (target === "duplicate_expire_days") {
        updateAffiliate(affiliate?.id, { duplicate_expire_days: value }, silentUpdate);
        setDuplicateExpireDays(value);
      }
      if (target === "error_duplicate") {
        updateAffiliate(affiliate?.id, { error_duplicate: value });
        setErrorDuplicate(value);
      }
      if (target === "allow_signup") {
        updateAffiliate(affiliate?.id, { allow_signup: value });
        setAllowSignup(value);
      }
      if (target === "prevent_offline") {
        updateAffiliate(affiliate?.id, { prevent_offline: value });
        setPreventOffline(value);
      }
    } catch (error) {
      console.error("error: ", error);
    }
  };

  useEffect(() => {
    setIsActive(affiliate?.aff_active);
    setIsByPass(affiliate?.bypass_aff_verification);
    setIsLoginLink(affiliate?.return_aff_login);
    setPassword(affiliate?.password ?? "");
    setIsDuplicateExpire(affiliate?.duplicate_expire);
    setDuplicateExpireDays(affiliate?.duplicate_expire_days ?? 30);
    setErrorDuplicate(affiliate?.error_duplicate);
    setAllowSignup(affiliate?.allow_signup);
    setPreventOffline(affiliate?.prevent_offline);
    setIsIpValidation(affiliate?.aff_ip_validation);
    setAutoFtd(affiliate?.auto_ftd);
    setAutoFtdAmount(affiliate?.auto_ftd_amount);
  }, [affiliate]);

  useEffect(() => {
    if (
      affiliate?.id &&
      affiliate?.duplicate_expire_days !== null &&
      affiliate?.duplicate_expire_days !== newDuplicateExpireDays
    ) {
      handleSwitchChange(newDuplicateExpireDays, "duplicate_expire_days", true);
    }
  }, [newDuplicateExpireDays]);

  const handleOpenRefreshPasswordConfirmation = useCallback(() => {
    setOpenRefreshPasswordDialog(true);
  }, []);

  const handleCloseRefreshPasswordConfirmation = useCallback(() => {
    setOpenRefreshPasswordDialog(false);
  }, []);

  const handleRefreshPassword = useCallback(async () => {
    try {
      const response = await affiliateApi.refreshAffiliatePassword(
        affiliate?.id
      );
      if (response?.password) setPassword(response?.password);
      handleCloseRefreshPasswordConfirmation();
      toast.success("Affiliate password successfully refreshed!");
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }, [affiliate]);

  const handleChangeExpireDays = (e) =>
    setDuplicateExpireDays(e?.target?.value);

  return (
    <Card sx={{ minHeight: { md: 300, lg: 520 } }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        spacing={4}
        sx={{ pt: 4, px: 4, pb: 2 }}
      >
        <Typography variant="h5">Information</Typography>
      </Stack>
      <Stack spacing={3} sx={{ py: 3, px: 6 }}>
        <Grid container>
          <Grid xs={3}>API Key:</Grid>
          <Grid xs={6}>
            {apiKeyHidden ? (
              <Typography variant="subtitle2">****************</Typography>
            ) : (
              <Typography variant="subtitle2" sx={{ wordBreak: "break-all" }}>
                {affiliate?.api_key}
              </Typography>
            )}
          </Grid>
          <Grid
            xs={3}
            pl={5}
            sx={{ display: "flex", flexDirection: "row", gap: 0.5 }}
          >
            <Tooltip title="Copy to clipboard">
              <IconButton
                edge="end"
                onClick={() => copyToClipboard(affiliate?.api_key)}
              >
                <Iconify icon="mdi:content-copy" color="primary.main" />
              </IconButton>
            </Tooltip>
            {apiKeyHidden || false ? (
              <Tooltip title="Show">
                <IconButton
                  edge="end"
                  onClick={() => setApiKeyHidden(false)}
                  sx={{ ml: 1 }}
                >
                  <Iconify icon="majesticons:eye-line" color="primary.main" />
                </IconButton>
              </Tooltip>
            ) : (
              <Tooltip title="Hide">
                <IconButton
                  edge="end"
                  onClick={() => setApiKeyHidden(true)}
                  sx={{ ml: 1 }}
                >
                  <Iconify icon="iconamoon:eye-off" color="primary.main" />
                </IconButton>
              </Tooltip>
            )}
          </Grid>
        </Grid>
        <Grid container>
          <Grid xs={3}>User Name:</Grid>
          <Grid xs={6}>
            <Typography variant="subtitle2" sx={{ wordBreak: "break-all" }}>
              {affiliate?.user_name}
            </Typography>
          </Grid>
          <Grid xs={3} pl={5}>
            <Tooltip title="Copy to clipboard">
              <IconButton
                edge="end"
                onClick={() => copyToClipboard(affiliate?.user_name)}
              >
                <Iconify icon="mdi:content-copy" color="primary.main" />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
        <Grid container>
          <Grid xs={3}>Password:</Grid>
          <Grid xs={6}>
            {passwordHidden ? (
              <Typography variant="subtitle2">****************</Typography>
            ) : (
              <Typography variant="subtitle2" sx={{ wordBreak: "break-all" }}>
                {password}
              </Typography>
            )}
          </Grid>
          <Grid
            xs={3}
            pl={5}
            sx={{ display: "flex", flexDirection: "row", gap: 0.5 }}
          >
            <Tooltip title="Copy to clipboard">
              <IconButton edge="end" onClick={() => copyToClipboard(password)}>
                <Iconify icon="mdi:content-copy" color="primary.main" />
              </IconButton>
            </Tooltip>

            {affiliate?.aff_admin ||
              (true && (
                <Tooltip title="Edit">
                  <IconButton
                    edge="end"
                    sx={{ ml: 1 }}
                    onClick={handleOpenRefreshPasswordConfirmation}
                  >
                    <Iconify icon="uil:edit" color="primary.main" />
                  </IconButton>
                </Tooltip>
              ))}

            {passwordHidden ? (
              <Tooltip title="Show">
                <IconButton
                  edge="end"
                  onClick={() => setPasswordHidden(false)}
                  sx={{ ml: 1 }}
                >
                  <Iconify icon="majesticons:eye-line" color="primary.main" />
                </IconButton>
              </Tooltip>
            ) : (
              <Tooltip title="Hide">
                <IconButton
                  edge="end"
                  onClick={() => setPasswordHidden(true)}
                  sx={{ ml: 1 }}
                >
                  <Iconify icon="iconamoon:eye-off" color="primary.main" />
                </IconButton>
              </Tooltip>
            )}
          </Grid>
        </Grid>
        {/* <Grid container>
          <Grid xs={3}>Login link:</Grid>
          <Grid xs={6}>
            <Typography variant="subtitle2">
              {window?.location?.origin}
            </Typography>
          </Grid>
          <Grid xs={3} pl={5}>
            <Tooltip title="Copy to clipboard">
              <IconButton
                edge="end"
                onClick={() => copyToClipboard(window?.location?.origin)}
              >
                <Iconify icon="mdi:content-copy" color="primary.main" />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid> */}
        <Grid container>
          <Grid xs={3}>Active:</Grid>
          <Grid xs={6}></Grid>
          <Grid xs={3} pl={4}>
            <Switch
              disabled={!user?.acc?.acc_e_lm_aff}
              checked={isActive ?? false}
              onChange={(event) =>
                handleSwitchChange(event?.target?.checked, "active")
              }
            />
          </Grid>
        </Grid>
        <Grid container>
          <Grid xs={3}>Allow Signup:</Grid>
          <Grid xs={6}></Grid>
          <Grid xs={3} pl={4}>
            <Switch
              checked={allowSignup ?? false}
              onChange={(event) =>
                handleSwitchChange(event?.target?.checked, "allow_signup")
              }
            />
          </Grid>
        </Grid>
        <Grid container>
          <Grid xs={3}>Bypass lead validation:</Grid>
          <Grid xs={6}></Grid>
          <Grid xs={3} pl={4}>
            <Switch
              checked={isByPass ?? false}
              onChange={(event) =>
                handleSwitchChange(event?.target?.checked, "bypass")
              }
            />
          </Grid>
        </Grid>
        <Grid container>
          <Grid xs={3}>Bypass Duplication:</Grid>
          <Grid xs={6}></Grid>
          <Grid xs={3} pl={4}>
            <Switch
              checked={isDuplicateExpire ?? false}
              onChange={(event) =>
                handleSwitchChange(event?.target?.checked, "duplicate_expire")
              }
            />
          </Grid>
        </Grid>
        {true ? (
          <Grid container>
            <Grid xs={3}>Bypass Duplication After:</Grid>
            <Grid xs={6}></Grid>
            <Grid xs={3} pl={4}>
              <TextField
                InputLabelProps={{ shrink: true }}
                label="Days"
                type="number"
                value={duplicateExpireDays}
                onChange={handleChangeExpireDays}
              />
            </Grid>
          </Grid>
        ) : null}
        <Grid container>
          <Grid
            xs={9}
            sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}
          >
            <Typography variant="subtitle1" color="text.primary">
              Return 500 error on Duplicates:
            </Typography>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              sx={{ maxWidth: 580 }}
            >
              Return a base error with message "Duplicate processing error occurred" if true.
            </Typography>
          </Grid>
          <Grid xs={3} pl={4}>
            <Switch
              checked={errorDuplicate ?? false}
              onChange={(event) =>
                handleSwitchChange(event?.target?.checked, "error_duplicate")
              }
            />
          </Grid>
        </Grid>
        <Grid container>
          <Grid xs={3}>Reject Offline Leads:</Grid>
          <Grid xs={6}></Grid>
          <Grid xs={3} pl={4}>
            <Switch
              checked={preventOffline ?? false}
              onChange={(event) =>
                handleSwitchChange(event?.target?.checked, "prevent_offline")
              }
            />
          </Grid>
        </Grid>
        <Stack direction="column" gap={1}>
          <Grid container>
            <Grid
              xs={9}
              sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}
            >
              <Typography variant="subtitle1" color="text.primary">
                Reject Leads with Duplicate IPs and Suppress Status/FTD Updates:
              </Typography>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{ maxWidth: 580 }}
              >
                This feature activates only when at least one company IP is
                whitelisted in the system. It checks if incoming leads have IPs
                already existing in the system and, if so, rejects them without
                providing status or FTD updates.
              </Typography>
            </Grid>
            <Grid xs={3} pl={4}>
              <Switch
                checked={isIpValidation ?? false}
                onChange={(event) =>
                  handleSwitchChange(
                    event?.target?.checked,
                    "aff_ip_validation"
                  )
                }
              />
            </Grid>
          </Grid>
        </Stack>
        <Stack direction="column" gap={1}>
          <Grid container>
            <Grid
              xs={9}
              sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}
            >
              <Typography variant="subtitle1" color="text.primary">
                Automatically Enable FTD Custom Field on First Deposit:
              </Typography>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{ maxWidth: 580 }}
              >
                Upon the addition of the initial transaction in a client's
                profile, the 'First Time Deposit' (FTD) switch will
                automatically activate. If synchronization is enabled, the
                system will notify the affiliate of this activation, provided
                that the affiliate has not disabled FTD notifications in their
                settings.
              </Typography>
            </Grid>
            <Grid xs={3} pl={4}>
              <Switch
                checked={autoFtd ?? false}
                onChange={(event) =>
                  handleSwitchChange(event?.target?.checked, "auto_ftd")
                }
              />
            </Grid>
          </Grid>
        </Stack>
        <Stack direction="column" gap={1}>
          <Grid container>
            <Grid
              xs={9}
              sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}
            >
              <Typography variant="subtitle1" color="text.primary">
                Automatic Activation of FTD Amount on First Deposit:
              </Typography>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{ maxWidth: 580 }}
              >
                When the first transaction is recorded in a client's profile,
                the 'First Time Deposit' (FTD) amount will be automatically set.
                If synchronization is active, the system will inform the
                affiliate of this update, unless the affiliate has opted out of
                receiving FTD amount notifications in their settings.
              </Typography>
            </Grid>
            <Grid xs={3} pl={4}>
              <Switch
                checked={autoFtdAmount ?? false}
                onChange={(event) =>
                  handleSwitchChange(event?.target?.checked, "auto_ftd_amount")
                }
              />
            </Grid>
          </Grid>
        </Stack>
        <Grid container>
          <Grid xs={3}>Return login link:</Grid>
          <Grid xs={6}></Grid>
          <Grid xs={3} pl={4}>
            <Switch
              checked={isLoginLink ?? false}
              onChange={(event) =>
                handleSwitchChange(event?.target?.checked, "login_link")
              }
            />
          </Grid>
        </Grid>
      </Stack>

      <ConfirmationDialog
        open={openRefreshPasswordDialog}
        onClose={handleCloseRefreshPasswordConfirmation}
        title="Are you sure you want to change affiliate password?"
        subtitle=""
        confirmTitle="Change password"
        onConfirm={handleRefreshPassword}
      />
    </Card>
  );
};
