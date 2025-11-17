import { useState, useEffect } from "react";
import { read, utils } from "xlsx";
import { useForm } from "react-hook-form";
import { Controller } from "react-hook-form";
import toast from "react-hot-toast";

import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";

import { Iconify } from "src/components/iconify";
import CountryInput from "src/components/customize/country-input";
import CustomSwitch from "src/components/customize/custom-switch";
import { brandsApi } from "src/api/lead-management/brand";
import { getAssetPath } from "src/utils/asset-path";

export const FileStep = ({ onNext, setFile, formData, headerList = [] }) => {

  const { handleSubmit, control, reset, register } = useForm();

  const [headers, setHeaders] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [brandsList, setBrandsList] = useState([]);
  const [uploadedFile, setUploadedFile] = useState(null);

  const getBrands = async () => {
    try {
      const res = await brandsApi.getInternalBrands();
      const brandsInfo = res?.internal_brands?.map((item) => (
        { label: item?.company_name, value: item?.id }
      ));
      setBrandsList(brandsInfo);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    getBrands();
  }, []);

  const onSubmit = (data) => {
    data.reject_email = data.reject_email ? data.reject_email : false;
    data.reject_phone = data.reject_phone ? data.reject_phone : false;
    data.redo_custom_fields = data.redo_custom_fields ? data.redo_custom_fields : false;
    if (data.internal_brand_id) {
      data.internal_brand_id = parseInt(data.internal_brand_id);
    }
    onNext({ headers, data });
  };

  const handleUpload = (event) => {
    const file = event.target.files[0];
    setIsLoading(true);

    if (!file?.name?.endsWith(".xlsx") && !file?.name?.endsWith(".csv")) {
      toast("Invalid file type!");
      event.target.value = null;
      return;
    }
    if (file?.size > 105906176) {
      toast("Maximum file size is 100MB!");
      event.target.value = null;
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const buffer = e.target.result;
      const wb = read(buffer, { type: "buffer" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = utils.sheet_to_json(ws, { header: 1 });
      const header = data[0];
      setHeaders(
        [...new Set(header)]?.map((item) => ({ label: item, value: item }))
      );
      setIsLoading(false);
    };
    reader.readAsArrayBuffer(file);
    event.target.value = null;
    toast("Successfully uploaded!");
    setFile(file);
    setUploadedFile(file);
  };

  const handleDownload = async () => {
    const response = await fetch(getAssetPath("/assets/others/template.xlsx"));
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = "template.xlsx";
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  };

  useEffect(() => {
    reset(formData);
    setHeaders(headerList);
    if (!formData) {
      setUploadedFile(null);
    }
  }, [formData, headerList]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack>
        <Stack spacing={3}>
          <Stack direction="row" alignItems="center" gap={2}>
            <Typography>File:</Typography>
            <Button variant="contained" onClick={() => {}}>
              <label htmlFor="btn-upload1">Choose File</label>
              <input
                id="btn-upload1"
                onChange={(event) => handleUpload(event)}
                type="file"
                hidden
              />
            </Button>
          </Stack>
          {uploadedFile && (
            <Paper
              elevation={1}
              sx={{
                p: 2,
                border: '1px solid',
                borderColor: 'primary.main',
                borderRadius: 2,
                backgroundColor: 'primary.50',
              }}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <Iconify icon="solar:file-text-bold" color="primary" width={24} />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle2" color="primary" fontWeight="medium">
                    {uploadedFile.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </Typography>
                </Box>
                <Chip 
                  label="Uploaded" 
                  color="success" 
                  size="small" 
                  variant="outlined"
                />
              </Stack>
            </Paper>
          )}
          {isLoading ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
              }}
            >
              <CircularProgress
                size={70}
                sx={{ alignSelf: "center", justifySelf: "center" }}
              />
            </Box>
          ) : (
            <>
              {/* {company?.list_filtering ? null : (
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  gap={2}
                >
                  <Typography>Dripping:</Typography>
                  <CustomSwitch name="dripping" control={control} />
                </Stack>
              )} */}
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                gap={2}
              >
                <Typography>Reject leads without email:</Typography>
                <CustomSwitch name="reject_email" control={control} />
              </Stack>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                gap={2}
              >
                <Typography>Reject leads without phone number:</Typography>
                <CustomSwitch name="reject_phone" control={control} />
              </Stack>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                gap={2}
              >
                <Typography>Rewrite custom field data:</Typography>
                <CustomSwitch name="redo_custom_fields" control={control} />
              </Stack>
              <CountryInput
                control={control}
                label="Country"
                name="country_name"
              />
              <FormControl fullWidth>
                <Controller
                  name="internal_brand_id"
                  control={control}
                  render={({ field }) => (
                    <>
                      <InputLabel>Internal Brand</InputLabel>
                      <Select
                        {...field}
                        label="Internal Brand"
                        fullWidth
                      >
                        {brandsList.map((brand) => (
                          <MenuItem key={brand.value} value={brand.value}>
                            {brand.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </>
                  )}
                />
              </FormControl>
              <TextField label="Note" {...register("note")} />
              <Stack direction="row">
                <Button onClick={handleDownload}>DownLoad Template</Button>
              </Stack>
            </>
          )}
        </Stack>
        <Stack alignItems="center" direction="row" sx={{ mt: 3 }} spacing={2}>
          <Button
            endIcon={<Iconify icon="octicon:arrow-right-16" width={22} />}
            variant="contained"
            disabled={!headers?.length}
            type="submit"
          >
            Continue
          </Button>
        </Stack>
      </Stack>
    </form>
  );
};
