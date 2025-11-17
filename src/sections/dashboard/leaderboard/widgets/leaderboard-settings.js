import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

import Stack from "@mui/material/Stack";
import Dialog from "@mui/material/Dialog";
import Select from "@mui/material/Select";
import Switch from "@mui/material/Switch";
import MenuItem from "@mui/material/MenuItem";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import OutlinedInput from "@mui/material/OutlinedInput";

import { userApi } from "src/api/user";
import { Iconify } from "src/components/iconify";
import { useAuth } from "src/hooks/use-auth";
import { useDebounce } from "src/hooks/use-debounce";

export const LeaderboardSettings = ({ open, onClose, soundEnabled, file, totalGoal, includeFtd, onIncludeFtdChange, includeFtdEvents, onIncludeFtdEventsChange, reportBasedOn, onReportBasedOnChange }) => {
  const [playSound, setPlaySound] = useState(false);
  const [depositGoal, setDepositGoal] = useState();
  const [isReady, setIsReady] = useState(false); 

  const { refreshUser } = useAuth();

  const fileInputRef = useRef();
  const depositGoalDebounced = useDebounce(depositGoal, 400);
  const ready = useDebounce(isReady, 3000);

  const handleGoalUpdate = async () => {
    try {
      const accountId = localStorage.getItem("account_id");
      await userApi.updateUser(accountId, {
        leader_goal: depositGoalDebounced,
      });
      setTimeout(() => {
        refreshUser();
      }, 1500);
      toast.success("Deposit goal successfully updated!");
    } catch (error) {
      console.error("error: ", error);
      toast.error("Something went wrong!");
    }
  }

  const handlePlaySoundUpdate = async (e) => {
    try {
      const value = e?.target?.checked;
      setPlaySound(value);
      const accountId = localStorage.getItem("account_id");
      await userApi.updateUser(accountId, {
        leader_sound_enable: value,
      });
      setTimeout(() => {
        refreshUser();
      }, 1500);
      toast.success("Play sound on every event updated!");
    } catch (error) {
      console.error("error: ", error);
      toast.error("Something went wrong!");
    }
  };

  const handleIncludeFtdUpdate = (e) => {
    const value = e?.target?.checked;
    onIncludeFtdChange(value);
  };

  const handleIncludeFtdEventsUpdate = (e) => {
    const value = e?.target?.checked;
    onIncludeFtdEventsChange(value);
  };

  const handleReportBasedOnUpdate = (event) => {
    const value = event?.target?.value;
    onReportBasedOnChange(value === "approval");
  };

  const handleSoundUpload = async (event) => {
      const accountId = localStorage.getItem("account_id");
      const sound = event?.target?.files[0];

      const formData = new FormData();
      formData.append("leader_sound", sound);
      formData.append("account_id", accountId);
      await userApi.updateUser?.(accountId, formData);
      setTimeout(() => {
        refreshUser();
      }, 1500);
      toast.success("Event sound successfully updated!");
    };

  const handleAttach = () => {
    fileInputRef.current?.click();
  };
  
  useEffect(() => {
    setPlaySound(soundEnabled ?? false);
    totalGoal && setDepositGoal(totalGoal);
    setIsReady(true);
  }, [soundEnabled, file, totalGoal]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <Container maxWidth="xxl" sx={{ px: 3 }}>
        <Stack mt={2} py={3} direction="row" justifyContent="center">
          <Typography variant="h5">Leaderboard Settings</Typography>
        </Stack>

        <Stack sx={{ spacing: 3, px: { xs: 0, sm: 2 }, pt: 2, pb: 4 }} gap={3}>
          <Stack
            alignItems="center"
            justifyContent="space-between"
            gap={2}
            sx={{ flexDirection: { xs: "column", sm: "row" } }}
          >
            <Typography variant="h6" color='text.secondary'>Play a sound on every event:</Typography>
            <Switch checked={playSound} onChange={handlePlaySoundUpdate} />
          </Stack>

          <Stack
            alignItems="center"
            justifyContent="space-between"
            gap={2}
            sx={{ flexDirection: { xs: "column", sm: "row" } }}
          >
            <Typography variant="h6" color='text.secondary'>Include first deposit:</Typography>
            <Switch checked={includeFtd} onChange={handleIncludeFtdUpdate} />
          </Stack>

          <Stack
            alignItems="center"
            justifyContent="space-between"
            gap={2}
            sx={{ flexDirection: { xs: "column", sm: "row" } }}
          >
            <Typography variant="h6" color='text.secondary'>Include FTD events:</Typography>
            <Switch checked={includeFtdEvents} onChange={handleIncludeFtdEventsUpdate} />
          </Stack>

          <Stack
            alignItems="center"
            justifyContent="space-between"
            gap={2}
            sx={{ flexDirection: { xs: "column", sm: "row" } }}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography variant="h6" color='text.secondary'>Sound file:</Typography>
              <Typography variant="subtitle1">Sound 1</Typography>
            </Stack>

            <Typography
              variant="subtitle1"
              fontWeight={600}
              sx={{ cursor: "pointer" }}
              onClick={handleAttach}
              color="primary"
            >
              Upload sound
            </Typography>
          </Stack>

          <Stack
            alignItems="center"
            justifyContent="space-between"
            gap={2}
            sx={{ flexDirection: { xs: "column", sm: "row" } }}
          >
            <Typography variant="h6" color='text.secondary'>Report type:</Typography>
            <Select value="retention" sx={{ maxWidth: 150, width: 1 }}>
              <MenuItem value="retention">Retention</MenuItem>
            </Select>
          </Stack>

          <Stack
            alignItems="center"
            justifyContent="space-between"
            gap={2}
            sx={{ flexDirection: { xs: "column", sm: "row" } }}
          >
            <Typography variant="h6" color='text.secondary'>Report based on:</Typography>
            <Select value={reportBasedOn ? "approval" : "creation"} onChange={handleReportBasedOnUpdate} sx={{ maxWidth: 150, width: 1 }}>
              <MenuItem value="approval">Approval time</MenuItem>
              <MenuItem value="creation">Creation time</MenuItem>
            </Select>
          </Stack>

          <Stack
            alignItems="center"
            justifyContent="space-between"
            gap={2}
            sx={{ flexDirection: { xs: "column", sm: "row" } }}
          >
            <Typography variant="h6" color='text.secondary'>Deposit goal (USD):</Typography>
            <Stack direction="row" alignItems="center" spacing={1}>
              {ready && depositGoalDebounced !== totalGoal ? (
                <IconButton onClick={handleGoalUpdate}>
                  <Iconify icon="material-symbols:check" />
                </IconButton>
              ) : null}
              <OutlinedInput
                value={depositGoal}
                onChange={(e) => setDepositGoal(e?.target?.value)}
                placeholder="USD..."
                sx={{ maxWidth: 150 }}
              />
            </Stack>
          </Stack>
        </Stack>
      </Container>

      <input
        hidden
        ref={fileInputRef}
        onChange={handleSoundUpload}
        type="file"
      />
    </Dialog>
  );
};
