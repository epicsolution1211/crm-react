import { useEffect, useState } from "react";

import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { format } from "date-fns";

import { Iconify } from 'src/components/iconify';
import { affiliateApi } from "src/api/lead-management/affiliate";
import { AffiliateSearch } from "./affiliate-search";

export const AffilateFilter = ({ 
    selectedAffiliate, 
    setSelectedAffiliate, 
    handleGetReports, 
    filterDate, 
    setFilterDate, 
    viewOnly, 
    setInfoTable, 
    exportExcel, 
    canExport 
  }) => {

  const [query, setQuery]= useState("");

  const handleGenerateAgentInfo = () => {
    const infoTable = [
      ['Affiliate Name', 'Issue Date', 'Due Date'] ,
      [`${selectedAffiliate?.full_name} (ID: ${selectedAffiliate?.id})`, format(filterDate?.from, "yyyy-MM-dd HH:mm"), format(filterDate?.to, "yyyy-MM-dd HH:mm")]
    ];
    setInfoTable(infoTable)
  };

  useEffect(() => {
    if(selectedAffiliate && filterDate) {
      handleGenerateAgentInfo();
    }
  }, [selectedAffiliate, filterDate])
  
  const [isAffilateLoading, setIsAffilateLoading]= useState(false);

  const [affilateList, setAffiliateList]= useState([]);

  const handleGetAffilaiteList = async () => {
    setIsAffilateLoading(true);
    try {
      const res= await affiliateApi.getAffiliates({ per_page: 1000 });
      setAffiliateList(res?.affiliates ?? []);
    } catch (error) {
      console.error('error: ', error);
    }
    setIsAffilateLoading(false);
  };

  useEffect(() => {
    handleGetAffilaiteList();
  }, []);

  useEffect(() => {
    if (!selectedAffiliate && affilateList?.length > 0) {
      setSelectedAffiliate(affilateList[0]);
    }
  }, [affilateList]);

  return (
    <Stack alignItems="center" sx={{flexDirection:{md:"row", xs:"column"}}} justifyContent='space-between' px={2} gap={2}>
      <Stack sx={{ flexDirection: {md: 'row', xs:'column' }}} width={1} alignItems="center" gap={2} justifyContent='flex-start'>
        {!viewOnly && (
          <AffiliateSearch
            query={query}
            results={affilateList}
            onSearch={(val) => setQuery(val)}
            isLoading={isAffilateLoading}
            setSelectedAffiliate={(val)=> setSelectedAffiliate(val)}
          />
        )}
        {selectedAffiliate &&
          <Stack direction='row' alignItems='center' sx={{ justifyContent: { xs: 'space-between', md: 'flex-start' }}} gap={2} width={1}>
            <Stack direction='row' alignItems='center' gap={2}>
              <Typography sx={{ whiteSpace:'nowrap', pl:1 }}>
                Affilate :
              </Typography>
              <Stack direction='row' alignItems='center' gap={2}>
                <Avatar
                  src={""}
                  sx={{
                    height: 42,
                    width: 42,
                  }}
                />
                <Stack direction='column'>
                  <Typography sx={{whiteSpace:'nowrap'}}>
                    {`${selectedAffiliate?.full_name}`}
                  </Typography>
                  <Typography sx={{whiteSpace:'nowrap'}}>
                    {`Id: ${selectedAffiliate?.id}`}
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
            <Stack sx={{ flexDirection: 'row', gap: 1, alignItems: 'center' }}>
              <Tooltip title="Reload">
                <IconButton
                  onClick={() => handleGetReports()}
                  sx={{ '&:hover': { color: 'primary.main', transform: 'rotate(180deg)', }, transition: 'transform 0.3s' }}
                >
                  <Iconify icon="ion:reload-sharp" width={24}/>
                </IconButton>
              </Tooltip>
              {selectedAffiliate &&
                <Tooltip title="Export Report">
                  <IconButton
                    disabled={!canExport}
                    onClick={() => exportExcel()}
                    sx={{ '&:hover': { color: 'primary.main' }}}
                  >
                    <Iconify icon="line-md:downloading-loop" width={24}/>
                  </IconButton>
                </Tooltip>
              }
            </Stack>
          </Stack>
        }
      </Stack>
      <Stack sx={{ flexDirection:'row', justifyContent:'flex-end', gap:2, width: 1 }}>
        <DatePicker
            format="dd/MM/yyyy"
            label="Issue Date"
            onChange={(val) => {
              setFilterDate((prev) => ({ ...prev, from: val }));
            }}
            sx={{width: {xs: 1, md:'auto'}}}
            maxDate={filterDate?.to}
            value={filterDate?.from}
            slotProps={{ textField: { size: "small" } }}
          />
          <DatePicker
            format="dd/MM/yyyy"
            label="Due Date"
            onChange={(val) => {
              setFilterDate((prev) => ({ ...prev, to: val.setHours(23, 59, 59, 999) }));
            }}
            sx={{width: {xs: 1, md:'auto'}}}
            minDate={filterDate?.from}
            value={filterDate?.to}
            slotProps={{ textField: { size: "small" } }}
          />
      </Stack>
    </Stack>
  );
};
