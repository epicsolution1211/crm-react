import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/system/Unstable_Grid/Grid";
import Stack from "@mui/material/Stack";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";

import { recordApi } from "src/api/payment_audit/record";
import { SelectMenu } from "src/components/customize/select-menu";
import { paymentTypeApi } from "src/api/payment_audit/payment_type";

export const RecordPaymentType = ({ recordId }) => {
  const { setValue, control, handleSubmit } = useForm();

  const [isLoading, setIsLoading] = useState(false);
  const [paymentTypes, setPaymentTypes] = useState([]);

  const getRecord = async () => {
    try {
      const res = await recordApi.getRecord(recordId);
      setValue("payment_type_id", res?.record?.payment_type_id);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      await recordApi.updateRecord(recordId, data);
      setIsLoading(false);
      toast.success("Record successfully updated!");
    } catch (error) {
      setIsLoading(false);
      console.error("error: ", error);
    }
  };

  const getPaymentType = async () => {
    try {
      const res = await paymentTypeApi.getPaymentTypes();
      setPaymentTypes(
        res?.payment_types?.map((item) => ({
          value: item?.id,
          label: item?.name,
        }))
      );
    } catch (error) {
      console.error("error: ", error);
    }
  };

  useEffect(() => {
    getPaymentType();
    getRecord();
  }, [recordId]);

  return (
    <Card>
      <CardHeader title="Payment Type" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent>
          <Stack spacing={1}>
            <Grid container spacing={2}>
              <Grid xs={6}>
                <SelectMenu
                  control={control}
                  label="Payment Type"
                  name="payment_type_id"
                  list={paymentTypes}
                />
              </Grid>
            </Grid>
          </Stack>

          <CardActions sx={{ justifyContent: "flex-end", mt: 2 }}>
            <Button disabled={isLoading} variant="contained" type="submit">
              Update
            </Button>
          </CardActions>
        </CardContent>
      </form>
    </Card>
  );
};
