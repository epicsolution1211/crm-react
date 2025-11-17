import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { v4 as uuid4 } from "uuid";

import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Grid from "@mui/system/Unstable_Grid/Grid";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/system";

import CustomSwitch from "src/components/customize/custom-switch";
import { Iconify } from "src/components/iconify";
import { Scrollbar } from "src/components/scrollbar";
import { SelectMenu } from "src/components/customize/select-menu";
import { clientDashboardApi } from "src/api/client-dashboard";
import { getAPIUrl } from "src/config";
import { settingsApi } from "src/api/settings";

export const CreateSavingAccount = ({
  open,
  onClose,
  onGetAccounts = () => { },
  brandId,
}) => {
  const fileRef = useRef(null);
  const {
    control,
    register,
    handleSubmit,
    reset,
  } = useForm();
  const [tickers, setTickers] = useState([]);
  const [filePreview, setFilePreview] = useState(null);
  const [file, setFile] = useState(null);
  const [options, setOptions] = useState([]);

  const getTickers = async () => {
    try {
      const res = await settingsApi.getTickers();
      setTickers(
        res?.tickers?.map((ticker) => ({
          label: ticker?.name,
          value: ticker?.id,
        }))
      );
    } catch (error) {
      console.error("error: ", error);
    }
  };

  useEffect(() => {
    getTickers();

    return () => {
      setOptions([]);
      reset();
    };
  }, []);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      formData.append("ticker_id", data?.ticker_id);
      formData.append("name", data?.name);
      formData.append("note", data?.note);
      formData.append("active", data?.active ?? false);

      if (file) {
        formData.append("file", file);
      }

      if (options?.length > 0) {
        formData.append("settings", JSON.stringify(options));
      }

      formData.append("internal_brand_id", brandId);

      await clientDashboardApi.createSavingAccount(formData);
      toast.success("Saving account successfully created!");
      onClose();
      setTimeout(() => {
        onGetAccounts();
        reset();
        setOptions([]);
      }, 1000);
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.error("error: ", error);
    }
  };

  useEffect(() => {
    reset();
  }, []);

  const handleFileAttach = useCallback(() => {
    fileRef?.current?.click();
  }, []);

  const handleFileChange = useCallback(async (event) => {
    const file = event?.target?.files[0];
    const preview = URL.createObjectURL(file);
    setFile(file);
    setFilePreview(preview);
  }, []);

  const handleOptionPeriodChange = useCallback(
    (e, id) => {
      const value = e?.target?.value;

      setOptions((prev) => {
        return prev?.map((option) => {
          if (option?.id === id) {
            return {
              ...option,
              period: value,
            };
          } else {
            return option;
          }
        });
      });
    },
    [options]
  );

  const handleOptionPercentageChange = useCallback(
    (e, id) => {
      const value = e?.target?.value;

      setOptions((prev) => {
        return prev?.map((option) => {
          if (option?.id === id) {
            return {
              ...option,
              percentage: value,
            };
          } else {
            return option;
          }
        });
      });
    },
    [options]
  );

  const handleOptionAdd = useCallback(() => {
    setOptions((prev) =>
      prev.concat([{ id: uuid4(), period: "", percentage: "" }])
    );
  }, []);

  const handleOptionDelete = useCallback((id) => {
    setOptions((prev) => prev?.filter((option) => option?.id !== id));
  }, []);

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <Stack alignItems="center" sx={{p: 5, pt: 8}}>
        <Typography variant="h5">Create Saving Account</Typography>
      </Stack>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack sx={{ px: 4, pt: 0, pb: 8 }}>
          <Scrollbar sx={{overflowY: 'auto', overflowX: 'hidden', pr: 1, height: 470 }}>
            <Grid container p={0.5} spacing={2}>
              <Grid xs={7}>
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
              <Grid 
                xs={5} 
                sx={{ 
                  display: "flex", 
                  flexDirection: 'row', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  height: 134
                }}>
                <CustomSwitch label="Active" control={control} name="active" />
              </Grid>

              <Grid xs={12}>
                <Stack spacing={1}>
                  <SelectMenu
                    control={control}
                    label="Ticker"
                    name="ticker_id"
                    list={tickers}
                    isSearch
                  />
                </Stack>
              </Grid>

              <Grid item xs={6}>
                <Stack spacing={1}>
                  <Typography variant="h7">Account name</Typography>
                  <OutlinedInput
                    name="name"
                    placeholder="Account name"
                    {...register("name")}
                  />
                </Stack>
              </Grid>

              <Grid item xs={6}>
                <Stack spacing={1}>
                  <Typography variant="h7">Note</Typography>
                  <OutlinedInput
                    name="note"
                    placeholder="Note"
                    {...register("note")}
                  />
                </Stack>
              </Grid>

              <Grid item xs={12}>
                <Stack spacing={3} mt={2}>
                  <Typography variant="h6">Options</Typography>
                  {options?.length>0 ?
                    (<Stack spacing={2}>
                      {options?.map((option) => (
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={2}
                          key={option?.id}
                        >
                          <TextField
                            placeholder="e.g. 30 Days"
                            label="Period"
                            value={option?.period}
                            onChange={(e) =>
                              handleOptionPeriodChange(e, option?.id)
                            }
                          />
                          <Typography>-</Typography>
                          <TextField
                            placeholder="e.g. 20"
                            label="Percentage"
                            value={option?.percentage}
                            type="number"
                            onChange={(e) =>
                              handleOptionPercentageChange(e, option?.id)
                            }
                          />
                          <IconButton
                          onClick={() => handleOptionDelete(option?.id)}
                          >
                            <Iconify icon="clarity:trash-line" color="primary.main"/>
                          </IconButton>
                        </Stack>
                      ))}
                    </Stack>):null}
                <Stack alignSelf="flex-start"pb={3}>
                  <Button
                    variant="contained"
                    onClick={handleOptionAdd}
                    sx={{ maxWidth: 150, minWidth: 120}}
                  >
                  Add option
                </Button>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </Scrollbar>

        <Button
          variant="contained"
            type="submit"
            sx={{
              mt: 2,
              minWidth: 120,
              alignSelf: "flex-end",
            }}
          >
            Create
          </Button>
        </Stack>
        {/* </Stack> */}
      </form>
    </Dialog>
  );
};
