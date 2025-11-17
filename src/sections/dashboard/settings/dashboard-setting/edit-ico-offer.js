import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";

import { alpha } from "@mui/system";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import OutlinedInput from "@mui/material/OutlinedInput";
import Typography from "@mui/material/Typography";

import { Iconify } from 'src/components/iconify';
import { getAPIUrl } from "src/config";
import { clientDashboardApi } from "src/api/client-dashboard";
import MuiDatePicker from "src/components/customize/date-picker";

export const EditIcoOffer = ({ offer, open, onClose, onGetOffers = () => { } }) => {
  const fileRef = useRef(null);
  const {
    control,
    register,
    setValue,
    handleSubmit,
    reset,
  } = useForm();
  const [filePreview, setFilePreview] = useState(null);
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (offer) {
      Object.keys(offer)?.forEach(key => {
        setValue(key, offer?.[key]);
      });

      if (offer?.file) {
        setFilePreview(offer?.file);
      }
    }
  }, [offer]);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      });

      if (file) {
        formData.append("file", file);
      }

      await clientDashboardApi.updateIcoOffer(offer?.id, formData);
      toast.success("ICO offer successfully updated!");
      onClose();
      setTimeout(() => {
        onGetOffers();
        reset();
        onClose();
      }, 1000);
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.error("error: ", error);
    }
  };

  const handleFileAttach = useCallback(() => {
    fileRef?.current?.click();
  }, []);

  const handleFileChange = useCallback(
    async (event) => {
      const file = event?.target?.files[0];
      const preview = URL.createObjectURL(file)
      setFile(file);
      setFilePreview(preview);
    }, []);

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <Stack alignItems="center" sx={{ p: 5 }}>
        <Typography variant="h5">Update ICO Offer</Typography>
      </Stack>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack sx={{ p: 5 }}>
          <Grid container spacing={3}>
            <Grid item xs={4}>
              <Stack spacing={1}>
                <Typography variant="h7">Token Name</Typography>
                <OutlinedInput
                  name="token_name"
                  placeholder="Token name"
                  {...register("token_name")}
                />
              </Stack>
            </Grid>

            <Grid item xs={4}>
              <Stack spacing={1}>
                <Typography variant="h7">Token Symbol</Typography>
                <OutlinedInput
                  name="token_symbol"
                  placeholder="Token symbol"
                  {...register("token_symbol")}
                />
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
              </Stack>
            </Grid>

            <Grid item xs={4}>
              <Stack spacing={1}>
                <Typography variant="h7">Presale End Date</Typography>
                <MuiDatePicker control={control} name="presale_end_date" />
              </Stack>
            </Grid>

            <Grid item xs={4}>
              <Stack spacing={1}>
                <Typography variant="h7">Listing On</Typography>
                <MuiDatePicker control={control} name="listing_on" />
              </Stack>
            </Grid>

            <Grid item xs={10}>
              <Stack alignItems="center" direction="row" spacing={2}>
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
            Update
          </Button>
        </Stack>
      </form>
    </Dialog>
  );
};
