import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/system/Unstable_Grid/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { DatePicker } from "@mui/x-date-pickers";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { format } from "date-fns";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";


import { paths } from "src/paths";
import { useRouter } from "src/hooks/use-router";
import { validationRuleApi } from "src/api/payment_audit/validation_rule";

export const ValidationRuleCreate = () => {
  const router = useRouter();
  const params = useParams();

  const [summary, setSummary] = useState("");
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [ai, setAi] = useState(false);
  const [code, setCode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async () => {
    try {
      setIsLoading(true);
      const request = {
        start_date: `${format(startDate, "dd-MM-yyyy")} ${format(
          startTime,
          "HH:mm:ss"
        )}`,
        end_date: `${format(endDate, "dd-MM-yyyy")} ${format(
          endTime,
          "HH:mm:ss"
        )}`,
        summary,
        name,
        code,
        ai,
        task_id: params?.taskId,
      };
      await validationRuleApi.createValidationRule(request);
      setIsLoading(false);
      setTimeout(
        () =>
          router.push(
            `${paths.dashboard.paymentAudit.validationRules.index}/${params?.taskId}?tab=rules`
          ),
        1000
      );
      toast("Validation rule successfully created!");
    } catch (error) {
      setIsLoading(false);
      toast(error?.response?.data?.message ?? error?.message);
    }
  };

  return (
    <>
      <Card>
        <CardHeader title="Details" />
        <CardContent>
          <Grid container spacing={2}>
            <Grid xs={6}>
              <Stack spacing={1}>
                <Typography variant="subtitle1">Name</Typography>
                <TextField
                  InputLabelProps={{ shrink: true }}
                  label="Name"
                  value={name}
                  onChange={(event) => setName(event?.target?.value)}
                />
              </Stack>
            </Grid>
            <Grid xs={6}></Grid>
            <Grid xs={6}>
              <Stack spacing={1}>
                <Typography variant="subtitle1">Effected from date</Typography>
                <DatePicker
                  format="yyyy-MM-dd"
                  label="Effected from date"
                  value={startDate ? new Date(startDate) : new Date()}
                  onChange={(val) => setStartDate(val)}
                />
              </Stack>
            </Grid>
            <Grid xs={6}>
              <Stack spacing={1}>
                <Typography variant="subtitle1">Effected from time</Typography>
                <TimePicker
                  format="h:mm:ss a"
                  views={["hours", "minutes", "seconds"]}
                  label="Effected from time"
                  value={startTime ? new Date(startTime) : new Date()}
                  onChange={(val) => setStartTime(val)}
                />
              </Stack>
            </Grid>
            <Grid xs={6}>
              <Stack spacing={1}>
                <Typography variant="subtitle1">Effected to date</Typography>
                <DatePicker
                  format="yyyy-MM-dd"
                  label="Effected to date"
                  value={endDate ? new Date(endDate) : new Date()}
                  onChange={(val) => setEndDate(val)}
                />
              </Stack>
            </Grid>
            <Grid xs={6}>
              <Stack spacing={1}>
                <Typography variant="subtitle1">Effected to date</Typography>
                <TimePicker
                  format="h:mm:ss a"
                  views={["hours", "minutes", "seconds"]}
                  label="Effected to date"
                  value={endTime ? new Date(endTime) : new Date()}
                  onChange={(val) => setEndTime(val)}
                />
              </Stack>
            </Grid>
            <Grid xs={12}>
              <Stack spacing={1}>
                <Typography variant="subtitle1">Rule</Typography>
                <Typography variant="subtitle2" maxWidth={850} color="#8b98a9">
                  Please describe the condition which is count as invalid or
                  suspicious record. write you r condition clear as you are
                  instructing your new employee who knows all columns and data.
                  <br /> Example condition: If the record amount is more than
                  100 and provider is SEPA and in description we have a word
                  "fake"
                </Typography>
                <Stack>
                  <TextField
                    multiline
                    label="Type your condition"
                    minRows={10}
                    sx={{ my: 3, maxWidth: "md" }}
                    value={summary}
                    onChange={(event) => setSummary(event?.target?.value)}
                  />
                </Stack>
              </Stack>
            </Grid>
          </Grid>
          <Stack direction="column" spacing={2} maxWidth="md">
            <Typography variant="subtitle1">Rule Checker</Typography>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Stack>
                <Typography variant="subtitle2">AI</Typography>
                <Typography color="#8b98a9" variant="subtitle2">
                  Our AI will review records based in your description and
                  validates it.
                </Typography>
              </Stack>
              <Switch
                checked={ai}
                onChange={(event) => setAi(event?.target?.checked)}
              />
            </Stack>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Stack>
                <Typography variant="subtitle2">Hardcoded</Typography>
                <Typography color="#8b98a9" variant="subtitle2">
                  Our developers will code validation based on your condition.
                </Typography>
              </Stack>
              <Switch
                checked={code}
                onChange={(event) => setCode(event?.target?.checked)}
              />
            </Stack>
          </Stack>
          <CardActions sx={{ justifyContent: "flex-end", mt: 2 }}>
            <Button
              disabled={isLoading}
              variant="contained"
              type="submit"
              onClick={() => handleCreate()}
            >
              Create
            </Button>
          </CardActions>
        </CardContent>
      </Card>
    </>
  );
};
