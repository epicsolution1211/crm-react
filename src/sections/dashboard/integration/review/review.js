import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import OutlinedInput from "@mui/material/OutlinedInput";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import { Controller, useForm } from "react-hook-form";
import { integrationApi } from "src/api/integration";
import { toast } from "react-hot-toast";

export const Review = ({ providerId }) => {
  const { register, control, handleSubmit, setValue } = useForm();
  const [isLoading, setIsLoading] = useState(false);

  const handleGetReview = async () => {
    try {
      const res = await integrationApi.getReview(providerId);
      setValue(
        "rating",
        res?.review?.rating ? parseInt(res?.review?.rating) : 0
      );
      setValue("description", res?.review?.description ?? "");
    } catch (error) {
      console.error("error: ", error);
    }
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      await integrationApi.updateReview(providerId, data);
      setIsLoading(false);
      toast("Review successfully updated!");
    } catch (error) {
      setIsLoading(false);
      console.error("error: ", error);
    }
  };

  useEffect(() => {
    handleGetReview();
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <Card>
          <CardHeader title="Review" />
          <CardContent>
            <Controller
              name="rating"
              control={control}
              render={({ field: { value = 0, onChange } }) => (
                <Rating
                  name="half-rating"
                  onChange={(event) => onChange(event?.target?.value)}
                  value={value}
                  precision={1}
                  sx={{ px: 1 }}
                />
              )}
            />
            <Stack
              spacing={3}
              pt={2}
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <OutlinedInput
                fullWidth
                {...register("description")}
                multiline
                placeholder="Write Review"
              />
              <Button disabled={isLoading} type="submit" variant="contained">
                Send
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </form>
  );
};
