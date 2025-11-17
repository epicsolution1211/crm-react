import { useState, useEffect } from "react";
import { read, utils } from "xlsx";
import { useForm } from "react-hook-form";

import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import toast from "react-hot-toast";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

import { Iconify } from "src/components/iconify";

export const FileStep = ({ onNext, setFile, formData, headerList = [] }) => {

  const { handleSubmit, reset } = useForm();

  const [headers, setHeaders] = useState();
  const [values, setValues] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = (data) => {
    onNext({ headers, data, values });
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
      const headersData = utils.sheet_to_json(ws, { header: 1 });
      const data = utils.sheet_to_json(ws)?.map(row => {
        const trimmedRow = {};
        Object.keys(row).forEach(key => {
          trimmedRow[key.trim()] = row[key];
        });
        return trimmedRow;
      });
      const header = headersData[0]?.map((item) => item?.trim());
      setHeaders(
        [...new Set(header)]?.map((item) => ({ label: item, value: item }))
      );

      setValues(data);
      setIsLoading(false);
    };
    reader.readAsArrayBuffer(file);
    event.target.value = null;
    toast("Successfully uploaded!");
    setFile(file);
  };

  // const handleDownload = async () => {
  //   const response = await fetch("/assets/others/template.xlsx");
  //   const blob = await response.blob();
  //   const objectUrl = URL.createObjectURL(blob);
  //   const link = document.createElement("a");
  //   link.href = objectUrl;
  //   link.download = "template.xlsx";
  //   document.body.appendChild(link);
  //   link.click();
  //   link.parentNode.removeChild(link);
  // };

  useEffect(() => {
    reset(formData);
    setHeaders(headerList);
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
          {isLoading && (
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
