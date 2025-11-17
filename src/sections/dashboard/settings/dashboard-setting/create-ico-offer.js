import { useCallback, useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import { format } from "date-fns";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Dialog from "@mui/material/Dialog";
import FormHelperText from "@mui/material/FormHelperText";
import Grid from "@mui/material/Grid";
import MuiDatePicker from "src/components/customize/date-picker";
import OutlinedInput from "@mui/material/OutlinedInput";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/system";

import { clientDashboardApi } from "src/api/client-dashboard";
import { Scrollbar } from "src/components/scrollbar";
import { getAPIUrl } from "src/config";
import { Iconify } from 'src/components/iconify';

const CreateIcoSchema = Yup.object({
  token_name: Yup.string().required("Token name is required!"),
  token_symbol: Yup.string().required("Token symbol is required!"),
  presale_start_date: Yup.string().required("Presale start date is required!"),
  presale_end_date: Yup.string().required("Presale end date is required!"),
});

export const CreateIcoOffer = ({ open, onClose, onGetOffers = () => { }, brandId }) => {
  const fileRef = useRef(null);
  const {
    control,
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    resolver: yupResolver(CreateIcoSchema)
  });

  const [filePreview, setFilePreview] = useState(null);
  const [file, setFile] = useState(null);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      });

      if (file) {
        formData.append("file", file);
      }

      formData.append("internal_brand_id", brandId);

      await clientDashboardApi.createIcoOffer(formData);
      toast.success("ICO offer successfully created!");
      onClose();
      setTimeout(() => {
        onGetOffers();
        reset();
      }, 1000);
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.error("error: ", error);
    }
  };

  useEffect(() => {
    reset({
      presale_start_date: format(new Date(), 'yyyy-MM-dd'),
      presale_end_date: format(new Date(), 'yyyy-MM-dd'),
      listing_on: format(new Date(), 'yyyy-MM-dd')
    });
  }, []);

  const handleFileAttach = useCallback(() => {
    fileRef?.current?.click();
  }, []);

  const handleFileChange = useCallback(
    async (event) => {
      const file = event?.target?.files[0];
      const preview = URL.createObjectURL(file)
      setFile(file);
      setFilePreview(preview);
    },
    []
  );

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <Stack alignItems="center" sx={{ p: 5 }}>
        <Typography variant="h5">Create ICO Offer</Typography>
      </Stack>
      <Scrollbar sx={{ maxHeight: 700 }}>
        <Container maxWidth="sm">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack sx={{ p: 5 }}>
              <Grid container spacing={3}>
                <Grid item xs={4}>
                  <Stack spacing={1}>
                    <Typography variant="h7">Token Name</Typography>
                    <OutlinedInput
                      name="token_name"
                      placeholder="Token name"
                      error={!!errors?.token_name?.message}
                      {...register("token_name")}
                    />
                    {!!errors?.token_name?.message && <FormHelperText error>{errors?.token_name?.message}</FormHelperText>}
                  </Stack>
                </Grid>

                <Grid item xs={4}>
                  <Stack spacing={1}>
                    <Typography variant="h7">Token Symbol</Typography>
                    <OutlinedInput
                      name="token_symbol"
                      placeholder="Token symbol"
                      error={!!errors?.token_symbol?.message}
                      {...register("token_symbol")}
                    />
                    {!!errors?.token_symbol?.message && <FormHelperText error>{errors?.token_symbol?.message}</FormHelperText>}
                  </Stack>
                </Grid>

                <Grid item xs={4}>
                  <Stack spacing={1}>
                    <Typography variant="h7">Token Address</Typography>
                    <OutlinedInput
                      name="token_address"
                      placeholder="Token address"
                      {...register("token_address")}
                    />
                  </Stack>
                </Grid>

                <Grid item xs={4}>
                  <Stack spacing={1}>
                    <Typography variant="h7">Token Decimals</Typography>
                    <OutlinedInput
                      name="token_decimals"
                      placeholder="Token decimals"
                      {...register("token_decimals")}
                    />
                  </Stack>
                </Grid>

                <Grid item xs={4}>
                  <Stack spacing={1}>
                    <Typography variant="h7">Total Supply</Typography>
                    <OutlinedInput
                      name="token_total_supply"
                      placeholder="Token total supply"
                      {...register("token_total_supply")}
                    />
                  </Stack>
                </Grid>

                <Grid item xs={4}>
                  <Stack spacing={1}>
                    <Typography variant="h7">For Presale</Typography>
                    <OutlinedInput
                      name="token_for_presale"
                      placeholder="Token for presale"
                      {...register("token_for_presale")}
                    />
                  </Stack>
                </Grid>

                <Grid item xs={4}>
                  <Stack spacing={1}>
                    <Typography variant="h7">For Liquidity</Typography>
                    <OutlinedInput
                      name="token_for_liquidity"
                      placeholder="Token for liquidity"
                      {...register("token_for_liquidity")}
                    />
                  </Stack>
                </Grid>

                <Grid item xs={4}>
                  <Stack spacing={1}>
                    <Typography variant="h7">Hard Cap</Typography>
                    <OutlinedInput
                      name="hard_cap"
                      placeholder="Hard cap"
                      {...register("hard_cap")}
                    />
                  </Stack>
                </Grid>

                <Grid item xs={4}>
                  <Stack spacing={1}>
                    <Typography variant="h7">Listing Price</Typography>
                    <OutlinedInput
                      name="listing_price"
                      type="number"
                      placeholder="Listing price"
                      inputProps={{
                        step: 0.0000000000001
                      }}
                      {...register("listing_price")}
                    />
                  </Stack>
                </Grid>

                <Grid item xs={4}>
                  <Stack spacing={1}>
                    <Typography variant="h7">Presale Price</Typography>
                    <OutlinedInput
                      name="presale_price"
                      placeholder="Presale price"
                      {...register("presale_price")}
                    />
                  </Stack>
                </Grid>

                <Grid item xs={4}>
                  <Stack spacing={1}>
                    <Typography variant="h7">Presale Start Date</Typography>
                    <MuiDatePicker control={control} name="presale_start_date" />
                    {!!errors?.presale_start_date?.message && <FormHelperText error>{errors?.presale_start_date?.message}</FormHelperText>}
                  </Stack>
                </Grid>

                <Grid item xs={4}>
                  <Stack spacing={1}>
                    <Typography variant="h7">Presale End Date</Typography>
                    <MuiDatePicker control={control} name="presale_end_date" />
                    {!!errors?.presale_start_date?.message && <FormHelperText error>{errors?.presale_start_date?.message}</FormHelperText>}
                  </Stack>
                </Grid>

                <Grid item xs={4}>
                  <Stack spacing={1}>
                    <Typography variant="h7">Listing On</Typography>
                    <MuiDatePicker control={control} name="listing_on" />
                  </Stack>
                </Grid>

                <Grid item xs={8} >
                  <Stack alignItems="center" justifyContent="center" direction="row" spacing={2}>
                    <Box
                      sx={{
                        borderColor: "neutral.300",
                        borderRadius: "50%",
                        borderStyle: "dashed",
                        borderWidth: 1,
                        p: "4px",
                      }}
                    >
                      <Box
                        sx={{
                          borderRadius: "50%",
                          height: "100%",
                          width: "100%",
                          position: "relative",
                        }}
                      >
                        <Box
                          onClick={handleFileAttach}
                          sx={{
                            alignItems: "center",
                            backgroundColor: (theme) =>
                              alpha(theme.palette.neutral[700], 0.5),
                            borderRadius: "50%",
                            color: "common.white",
                            cursor: "pointer",
                            display: "flex",
                            height: "100%",
                            justifyContent: "center",
                            left: 0,
                            opacity: 0,
                            position: "absolute",
                            top: 0,
                            width: "100%",
                            zIndex: 1,
                            "&:hover": {
                              opacity: 1,
                            },
                          }}
                        >
                          <Stack alignItems="center" direction="row" spacing={1}>
                            <Iconify icon="famicons:camera-outline" width={24} />
                            <Typography
                              color="inherit"
                              variant="subtitle2"
                              sx={{ fontWeight: 700 }}
                            >
                              Select
                            </Typography>
                          </Stack>
                        </Box>
                        <Avatar
                          src={filePreview ? filePreview?.includes('http') ? filePreview : `${getAPIUrl()}/${filePreview}` : ""}
                          sx={{
                            height: 100,
                            width: 100,
                          }}
                        >
                          <Iconify icon="mage:file-2" width={24} />
                        </Avatar>
                      </Box>

                      <input
                        hidden
                        ref={fileRef}
                        type="file"
                        onChange={handleFileChange}
                      />
                    </Box>
                    <Typography variant="h6">Upload image</Typography>
                  </Stack>
                </Grid>
              </Grid>

              <Button
                variant="contained"
                type="submit"
                sx={{
                  alignSelf: "flex-end",
                  mt: 2,
                }}
              >
                Create
              </Button>
            </Stack>
          </form>
        </Container>
      </Scrollbar>
    </Dialog>
  );
};
