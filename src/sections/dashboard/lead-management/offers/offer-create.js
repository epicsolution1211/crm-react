import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/material/Grid";
import OutlinedInput from "@mui/material/OutlinedInput";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { Controller, useForm } from "react-hook-form";

import CountryInput from "src/components/customize/country-input";
import { offersApi } from "src/api/lead-management/offers";
import { useRouter } from "src/hooks/use-router";
import { paths } from "src/paths";
import { QuillEditor } from "src/components/quill-editor";

export const OfferCreate = () => {
  const {
    control,
    register,
    handleSubmit,
  } = useForm();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      await offersApi.createOffer(data);
      toast.success("Offer successfully created!");

      setTimeout(() => {
        setIsLoading(false);
        router.push(paths.dashboard.lead.offers.index);
      }, 1500);
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
                    label="CR"
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
            <Button disabled={isLoading} type="submit" variant="contained">
              Create
            </Button>
          </Stack>
        </form>
      </CardContent>
    </Card>
  );
};
