import toast from "react-hot-toast";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Grid from "@mui/material/Grid";
import MuiDatePicker from "src/components/customize/date-picker";
import OutlinedInput from "@mui/material/OutlinedInput";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/system";

import { clientDashboardApi } from "src/api/client-dashboard";
import { SelectMenu } from "src/components/customize/select-menu";
import { getAPIUrl } from "src/config";
import { Iconify } from 'src/components/iconify';

export const EditContractModal = ({
  open,
  onClose,
  contract,
  onGetContracts = () => { },
  customerId,
  offers = [],
}) => {
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
    if (contract) {
      Object.keys(contract)?.forEach(key => {
        setValue(key, contract?.[key]);
      });

      if (contract?.file) {
        setFilePreview(contract?.file);
      }
    }
  }, [contract]);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      });

      if (file) {
        formData.append("file", file);
      }

      formData.append("client_id", customerId);

      await clientDashboardApi.updateClientContract(contract?.id, formData);
      toast.success("ICO contract successfully updated!");
      onClose();
      setTimeout(() => {
        onGetContracts();
        reset();
      }, 1000);
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.error("error: ", error);
    }
  };

  const handleFileAttach = useCallback(() => {
    fileRef?.current?.click();
  }, []);

  const handleFileChange = useCallback(async (event) => {
    const file = event?.target?.files[0];
    const preview = URL.createObjectURL(file);
    setFile(file);
    setFilePreview(preview);
  }, []);

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <Stack alignItems="center" sx={{ p: 5 }}>
        <Typography variant="h5">Update ICO Contract</Typography>
      </Stack>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack sx={{ p: 5 }}>
          <Grid container spacing={3}>
            <Grid item xs={4}>
              <Stack spacing={1}>
                <SelectMenu
                  control={control}
                  label="Offer"
                  name="ico_offer_id"
                  list={offers}
                />
              </Stack>
            </Grid>

            <Grid item xs={4}>
              <Stack spacing={1}>
                <Typography variant="h7">Contract Size</Typography>
                <OutlinedInput
                  name="contract_size"
                  placeholder="Contract size"
                  type="number"
                  {...register("contract_size")}
                />
              </Stack>
            </Grid>

            <Grid item xs={4}>
              <Stack spacing={1}>
                <Typography variant="h7">Contract Price</Typography>
                <OutlinedInput
                  name="contract_price"
                  type="number"
                  placeholder="Contract price"
                  {...register("contract_price")}
                />
              </Stack>
            </Grid>

            <Grid item xs={4}>
              <Stack spacing={1}>
                <Typography variant="h7">Contract Start Date</Typography>
                <MuiDatePicker control={control} name="contract_start_date" />
              </Stack>
            </Grid>

            <Grid item xs={4}>
              <Stack spacing={1}>
                <Typography variant="h7">Contract End Date</Typography>
                <MuiDatePicker control={control} name="contract_end_date" />
              </Stack>
            </Grid>

            <Grid item xs={4}>
              <Stack spacing={1}>
                <Typography variant="h7">Contract Status</Typography>
                <OutlinedInput
                  name="contract_status"
                  placeholder="Contract status"
                  {...register("contract_status")}
                />
              </Stack>
            </Grid>

            <Grid item xs={4}>
              <Stack spacing={1}>
                <Typography variant="h7">Contract Address</Typography>
                <OutlinedInput
                  name="contract_address"
                  placeholder="Contract address"
                  {...register("contract_address")}
                />
              </Stack>
            </Grid>

            <Grid item xs={4}>
              <Stack spacing={1}>
                <Typography variant="h7">Contract TXID</Typography>
                <OutlinedInput
                  name="contract_txid"
                  placeholder="Contract status"
                  {...register("contract_txid")}
                />
              </Stack>
            </Grid>

            <Grid item xs={4}>
              <Stack spacing={1}>
                <Typography variant="h7">Contract Type</Typography>
                <OutlinedInput
                  name="contract_type"
                  placeholder="Contract type"
                  {...register("contract_type")}
                />
              </Stack>
            </Grid>

            <Grid item xs={4}>
              <Stack spacing={1}>
                <Typography variant="h7">Contract Token Amount</Typography>
                <OutlinedInput
                  name="contract_token_amount"
                  type="number"
                  placeholder="Contract token amount"
                  {...register("contract_token_amount")}
                />
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
