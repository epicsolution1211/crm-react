import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import toast from "react-hot-toast";

import Autocomplete from "@mui/material/Autocomplete";
import SpreadTable from "./spread-table";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import Switch from "@mui/material/Switch";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Download } from "@mui/icons-material";

import { useDebounce } from "src/hooks/use-debounce";
import { settingsApi } from "src/api/settings";
import { Iconify } from "src/components/iconify";
import { exportToExcel } from "src/utils/export-excel";
import { CircularProgressWithLabel } from "src/components/loader-with-percentage";

const trickerList = [
  { label: "Forex", value: "forex" },
  { label: "Commodities", value: "commodities" },
  { label: "Crypto", value: "crypto" },
  { label: "Stocks", value: "stocks" },
  { label: "CFD", value: "cfd" },
];

export const Spreads = ({ brandId }) => {
  const [accountTypes, setAccountTypes] = useState([]);
  const [spreadTableData, setSpreadInfoTableData] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(5);
  const [count, setCount] = useState(0);
  const [text, setText] = useState("");
  const [exportLoading, setExportLoading] = useState(false);
  const [progress, setProgress] = useState(10);

  const [currentAccountType, setCurrentAccountType] = useState();
  const [currentTricker, setCurrentTricker] = useState("forex");
  const query = useDebounce(text, 300);
  const [isEnabled, setEnabled] = useState(false);

  const mdUp = useMediaQuery((theme) => theme.breakpoints.up("md"));

  const getAccountType = async () => {
    try {
      const res = await settingsApi.getAccountType({
        internal_brand_id: brandId,
      });
      setAccountTypes(res.account_types);
      const defaultAccount = res?.account_types.find(
        (item) => item.default === true
      );
      setCurrentAccountType({
        label: defaultAccount.name,
        id: defaultAccount.id,
      });
    } catch (error) {
      console.error("error: ", error);
    }
  };

  const getSpreadInformation = async () => {
    setIsDataLoading(true);
    try {
      const res = await settingsApi.getSpreadInfo(
        currentTricker,
        currentAccountType?.id,
        isEnabled,
        query,
        page,
        perPage,
        brandId
      );
      setSpreadInfoTableData(res?.tickers);
      setCount(res?.total_count);
    } catch (error) {
      console.error("error: ", error);
    }
    setTimeout(()=> {
      setIsDataLoading(false);
    }, 1000);
  };

  useEffect(() => {
    if (currentAccountType) {
      getSpreadInformation();
    }
  }, [
    page,
    perPage,
    currentTricker,
    currentAccountType,
    isEnabled,
    query,
    brandId,
  ]);

  useEffect(() => {
    getAccountType();
  }, []);

  const handleExport = useCallback(async () => {
    const dateNow = new Date();
    const exportDate = format(dateNow, "dd.mm.yyyy");
    const excelData = await handleMakeExcelData();

    exportToExcel(excelData, `spreads-import-${exportDate}`);
  }, [currentTricker, currentAccountType, isEnabled, query, brandId]);

  const handleMakeExcelData = async () => {
    const timer = setInterval(() => {
      setProgress((prevProgress) =>
        prevProgress >= 100 ? 0 : prevProgress + 10
      );
    }, 800);

    try {
      setExportLoading(true);
      const data = [];

      const res = await settingsApi.getSpreads({
        per_page: 10000,
        market: currentTricker,
        account_type_id: currentAccountType?.id,
        internal_brand_id: brandId,
      });

      setExportLoading(false);
      clearInterval(timer);

      data.push(...res?.tickers);

      return data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
      clearInterval(timer);
      setExportLoading(false);
    }
  };

  return (
    <Stack
      sx={{
        height: "100%",
        px: { md: 1, xs: 0 },
      }}
    >
      <Stack sx={{ gap: 1, pb: 3 }}>
        <Typography variant="h6" sx={{ color: "text.primary" }}>
          Spreads
        </Typography>
        <Typography sx={{ color: "text.secondary" }}>
          List of Spreads for each plan
        </Typography>
      </Stack>
      <Stack sx={{ gap: 1, pb: 3 }}>
        <Typography variant="h6" sx={{ color: "text.primary", pb: 1 }}>
          Select Account Type
        </Typography>
        <Autocomplete
          options={accountTypes.map((item) => ({
            label: item.name,
            id: item.id,
          }))}
          value={currentAccountType?.label ?? ""}
          onChange={(event, newValue) => {
            if (newValue) {
              setCurrentAccountType(newValue);
              setPage(0);
            }
          }}
          sx={{ width: { md: 300, xs: 250 }, height: 50 }}
          renderInput={(params) => (
            <TextField {...params} label="Account Type" />
          )}
        />
      </Stack>
      <Stack sx={{ gap: 1, pb: 3 }}>
        <Typography variant="h6" sx={{ color: "text.primary" }}>
          Available Tickers
        </Typography>
        <Stack
          alignItems="center"
          direction="row"
          flexWrap="wrap"
          gap={2}
          paddingTop={1}
          paddingBottom={2}
        >
          {trickerList.map((item) => (
            <Chip
              key={item.label}
              label={item.label}
              onClick={() => {
                setCurrentTricker(item.value);
                setPage(0);
              }}
              sx={{
                borderColor: "transparent",
                borderRadius: 1.5,
                borderStyle: "solid",
                borderWidth: 2,
                ...(item.value === currentTricker && {
                  borderColor: "primary.main",
                }),
              }}
            />
          ))}
        </Stack>
        <Stack
          direction="row"
          gap={2}
          alignItems="center"
          justifyContent="space-between"
          paddingBottom={2}
        >
          <OutlinedInput
            fullWidth
            placeholder="Search"
            value={text}
            onChange={(event) => setText(event?.target?.value)}
            startAdornment={
              <InputAdornment position="start">
                <Iconify icon="lucide:search" color="text.secondary" width={24} />
              </InputAdornment>
            }
            sx={{ width: { md: 400, xs: 200 }, mr: { md: 5, xs: 0 } }}
          />
          <Stack direction="row" gap={2} alignItems="center">
            <Stack
              direction={mdUp ? "row" : "column"}
              alignItems="center"
              spacing={1}
            >
              <Typography>
                {mdUp ? "Show only enabled one" : "Enabled"}
              </Typography>
              <Switch
                size={mdUp ? "" : "small"}
                checked={isEnabled}
                onChange={(event) => {
                  setEnabled(event.target.checked);
                  setPage(0);
                }}
              />
            </Stack>

            {exportLoading ? (
              <CircularProgressWithLabel value={progress} />
            ) : (
              <Tooltip title="Export spreads">
                <IconButton onClick={handleExport}>
                  <Download />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        </Stack>
        <SpreadTable
          spreadList={spreadTableData}
          onChangePage={setPage}
          onChangePerPage={setPerPage}
          perPage={perPage}
          totalCount={count}
          currentPage={page}
          getSpreads={getSpreadInformation}
          isDataLoading={isDataLoading}
        />
      </Stack>
    </Stack>
  );
};
