import { useState, useEffect, useRef, useCallback } from "react";
import { read, utils } from "xlsx";

import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import toast from "react-hot-toast";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import { Iconify } from 'src/components/iconify';
import { getAssetPath } from "src/utils/asset-path";

export const FileStep = ({ onNext, setFile, headerList = [] }) => {
  const [headers, setHeaders] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const fileRef = useRef(null);

  const handleFileAttach = useCallback(() => {
    fileRef?.current?.click();
  }, []);

  const onHandleContinue = (data) => {
    onNext({ headers, data });
  };

  const handleUpload = (event) => {
    const file = event.target.files[0];
    setIsLoading(true);
    if (
      file?.name?.split(".")[1] !== "xlsx" &&
      file?.name?.split(".")[1] !== "csv"
    ) {
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
  };

  const handleDownload = async () => {
    const response = await fetch(getAssetPath("/assets/others/download.xlsx"));
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
    setHeaders(headerList);
  }, [headerList]);

  return (
    <Stack>
      <Stack spacing={3}>
        <Stack direction="row" alignItems="center" gap={2}>
          <Typography>File:</Typography>
          <Button variant="contained" onClick={handleFileAttach}>
            Choose File
          </Button>
          <input
            ref={fileRef}
            onChange={(event) => handleUpload(event)}
            type="file"
            hidden
          />
        </Stack>
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
          <Stack direction="row">
            <Button onClick={handleDownload}>Download Template</Button>
          </Stack>
        )}
      </Stack>
      <Stack alignItems="center" direction="row" sx={{ mt: 3 }} spacing={2}>
        <Button
          endIcon={<Iconify icon="octicon:arrow-right-16" width={22} />}
          variant="contained"
          disabled={!headers?.length}
          onClick={() => onHandleContinue()}
        >
          Continue
        </Button>
      </Stack>
    </Stack>
  );
};
