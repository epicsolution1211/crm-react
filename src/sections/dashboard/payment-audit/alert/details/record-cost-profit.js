import { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/system/Unstable_Grid/Grid";
import Stack from "@mui/material/Stack";
import { toast } from "react-hot-toast";
import Typography from "@mui/material/Typography";

import { recordApi } from "src/api/payment_audit/record";

export const RecordCostProfit = ({ recordId }) => {
  const [record, setRecord] = useState({});

  const getRecord = async () => {
    try {
      const res = await recordApi.getRecord(recordId);
      setRecord(res?.record);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    getRecord();
  }, [recordId]);

  return (
    <Card>
      <CardHeader title="Cost & Profit" />
      <CardContent>
        <Stack spacing={1}>
          <Grid container spacing={2}>
            <Grid xs={6}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography variant="h7" sx={{ fontWeight: 600 }}>
                  Fees (Actual):{" "}
                </Typography>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color:
                      record?.fee_actual == record?.fee_expected &&
                      record?.fee_actual !== "0.0"
                        ? "red"
                        : "",
                  }}
                >
                  {record?.fee_actual}
                </Typography>
              </Stack>
            </Grid>
            <Grid xs={6}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography variant="h7" sx={{ fontWeight: 600 }}>
                  Cost (Actual):{" "}
                </Typography>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color:
                      record?.cost_actual == record?.cost_expected &&
                      record?.cost_actual !== "0.0"
                        ? "red"
                        : "",
                  }}
                >
                  {record?.cost_actual}
                </Typography>
              </Stack>
            </Grid>
            <Grid xs={6}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography variant="h7" sx={{ fontWeight: 600 }}>
                  Fees (Expected):{" "}
                </Typography>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color:
                      record?.fee_actual == record?.fee_expected &&
                      record?.fee_expected !== "0.0"
                        ? "red"
                        : "",
                  }}
                >
                  {record?.fee_expected}
                </Typography>
              </Stack>
            </Grid>
            <Grid xs={6}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography variant="h7" sx={{ fontWeight: 600 }}>
                  Cost (Expected):{" "}
                </Typography>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color:
                      record?.cost_actual == record?.cost_expected &&
                      record?.cost_expected !== "0.0"
                        ? "red"
                        : "",
                  }}
                >
                  {record?.cost_expected}
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </Stack>
      </CardContent>
    </Card>
  );
};
