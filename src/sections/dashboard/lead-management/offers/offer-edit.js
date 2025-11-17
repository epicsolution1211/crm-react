import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/material/Grid";
import OutlinedInput from "@mui/material/OutlinedInput";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Controller, useForm } from "react-hook-form";
import CountryInput from "src/components/customize/country-input";
import { offersApi } from "src/api/lead-management/offers";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { QuillEditor } from "src/components/quill-editor";
import { useAuth } from "src/hooks/use-auth";

export const OfferEdit = ({ offerId }) => {
  const {
    control,
    register,
    handleSubmit,
    setValue,
  } = useForm();

  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const getOfferData = async () => {
    try {
      const res = await offersApi.getOffer(offerId);

      if (res.offer) {
        setValue("name", res?.offer?.name ?? "");
        setValue("country", res?.offer?.country?.toUpperCase() ?? "");
        setValue("cr", res?.offer?.cr ?? "");
        setValue("apv", res?.offer?.apv ?? "");
        setValue("cpi", res?.offer?.cpi ?? "");
        setValue("crg", res?.offer?.crg ?? "");
        setValue("min", res?.offer?.min ?? "");
        setValue("note", res?.offer?.note ?? "");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    getOfferData();
  }, []);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      await offersApi.updateOffer(offerId, data);
      setIsLoading(false);
      toast.success("Offer successfully updated!");
    } catch (error) {
      setIsLoading(false);
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <Card sx={{ mt: 4 }}>
      <CardHeader title="Details" />

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={4}>
            <Grid item xs={6}>
              <Stack spacing={3}>
                <Stack alignItems="start" spacing={1}>
                  <Typography>Offer Name</Typography>
                  <OutlinedInput
                    placeholder="Offer Name"
                    sx={{ width: "100%" }}
                    {...register("name")}
                  />
                </Stack>

                <Stack alignItems="start" spacing={1}>
                  <Typography>Country</Typography>
                  <CountryInput
                    control={control}
                    label="Country*"
                    name="country"
                    sx={{ width: "100%" }}
                    // defaultCountry={defaultCountry}
                  />
                </Stack>

                <Stack alignItems="start" spacing={1}>
                  <Typography>CR%</Typography>
                  <OutlinedInput
                    {...register("cr")}
                    sx={{ width: "100%" }}
                    placeholder="CR"
                  />
                </Stack>

                <Stack alignItems="start" spacing={1}>
                  <Typography>Average Player Value</Typography>
                  <OutlinedInput
                    {...register("apv")}
                    sx={{ width: "100%" }}
                    placeholder="Average Player Value"
                  />
                </Stack>
              </Stack>
            </Grid>

            <Grid item xs={6}>
              <Stack spacing={3}>
                <Stack alignItems="start" spacing={1}>
                  <Typography>CPL</Typography>
                  <OutlinedInput
                    {...register("cpi")}
                    sx={{ width: "100%" }}
                    placeholder="CPL"
                  />
                </Stack>

                <Stack alignItems="start" spacing={1}>
                  <Typography>CRG%</Typography>
                  <OutlinedInput
                    {...register("crg")}
                    sx={{ width: "100%" }}
                    placeholder="CRG%"
                  />
                </Stack>

                <Stack alignItems="start" spacing={1}>
                  <Typography>Min Order</Typography>
                  <OutlinedInput
                    {...register("min")}
                    sx={{ width: "100%" }}
                    placeholder="Min Order"
                  />
                </Stack>
              </Stack>
            </Grid>

            <Grid item xs={12}>
              <Typography>Note</Typography>
              <Controller
                name="note"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <QuillEditor
                    placeholder="Write something"
                    sx={{ height: 350, my: 3 }}
                    value={value}
                    onChange={onChange}
                  />
                )}
              />
            </Grid>
          </Grid>

          <Stack alignItems="flex-end" sx={{ mt: 2 }}>
            <Button disabled={isLoading || !user?.acc?.acc_e_lm_offer} type="submit" variant="contained">
              Update
            </Button>
          </Stack>
        </form>
      </CardContent>
    </Card>
  );
};
