import { useEffect } from "react";
import { alpha } from '@mui/system/colorManipulator';
import Card from "@mui/material/Card";
import Grid from '@mui/material/Unstable_Grid2';
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Skeleton from "@mui/material/Skeleton";
import { useTheme } from '@mui/material/styles';

import { Iconify } from 'src/components/iconify';

const overViewList = [
  {
    label:'Total Leads',
    key: 'total_leads',
    change: 'total_leads_change'
  },
  {
    label:'Total Valid Leads',
    key: 'total_verified_leads',
    change: 'total_verified_leads_change'
  },
  {
    label:'Total Invalid Leads',
    key: 'total_invalid_leads',
    change: 'total_invalid_leads_change'
  },
  {
    label:'Total Duplicate Leads',
    key: 'total_duplicate_leads',
    change: 'total_duplicate_leads_change'
  },
  {
    label:'Total FTD',
    key: 'total_ftd_amount',
    change: 'total_ftd_amount_change'
  },
  {
    label:'Total WD',
    key: 'total_wd_amount',
    change: 'total_wd_change'
  },
  {
    label:'Total FTD Count',
    key: 'total_ftd_count',
    change: 'total_ftd_count_change'
  },
  {
    label:'Total Online Clients',
    key: 'online_client_count',
    change: 'total_online_client_change'
  },
];

export const AffiliateOverview = ({report, isLoading, setOverViewTable1, setOverViewTable2 }) => {
  const theme = useTheme();

  const generateTableInfo = () => {
    const tableInfo1 = [
      ['Total Leads', 'Total Valid Leads', 'Total Invalid Leads', 'Total Duplicate Leads'],
      overViewList.slice(0, 4).map((item) => {
        const change = report[item?.change]? parseFloat(report[item?.change]??0):0;
        return (`${report[item?.key] ?? ""}(${change}% ${change >= 0? 'increase' : 'decrease'} vs last period)`);
      })
    ];
    const tableInfo2 = [
      ['Total FTD', 'Total WD', 'Total FTD Count', 'Total Online Clients'],
      overViewList.slice(-4).map((item) => {
        const change = report[item?.change]? parseFloat(report[item?.change]??0):0;
        return (`${report[item?.key] ?? ""}(${change}% ${change >= 0? 'increase' : 'decrease'} vs last period)`);
      })
    ];
    setOverViewTable1(tableInfo1);
    setOverViewTable2(tableInfo2);
  }

  useEffect(() => {
    if(report) {
      generateTableInfo();
    }
  }, [report]);
  
  return (
    <Card sx={{ py: 3, px: 1}}>
    <Grid container spacing={2}>
      {isLoading?
        overViewList?.map((item, index)=> (
          <Grid
            key={index} 
            xs={12}
            sm={6}
            xl={3}
            sx={{
              borderRight: { xl: index==3? '' : index > 6 ? '':'1px solid #919EAB52', xs: 0 },
              px: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5,
            }}>
            <Typography variant="subtitle1" color='text.secondary'>{item?.label??""}</Typography>
            <Skeleton height='44px'/>
            <Stack direction='row' gap={1} alignItems='center'>
              <Skeleton width='30px'/>
              <Skeleton width='65px'/>
              <Skeleton width='40px'/>
            </Stack>
          </Grid>
        ))
        :report?
        overViewList?.map((item, index)=> {
          const change = report[item?.change]? parseFloat(report[item?.change]??0):0;
          return (
          <Grid 
            key={index}
            xs={12}
            sm={6}
            xl={3}
            sx={{
              borderRight: { xl: index==3? '' : index > 6 ? '':'1px solid #919EAB52', xs: 0 },
              px: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5,
              mb: index > 3 ? 0 : 3,
            }}>
            <Typography variant="subtitle1" color='text.secondary'>{item?.label??""}</Typography>
            <Typography variant="h3" color='text.primary'>{report[item?.key]??""}</Typography>
            <Stack direction='row' gap={0.5} alignItems='center'>
              <Iconify
                icon={change < 0 ? 'eva:trending-down-fill' : 'eva:trending-up-fill'}
                sx={{
                  mr: 1,
                  p: 0.5,
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  color: 'success.main',
                  bgcolor: alpha(theme.palette.success.main, 0.16),
                  ...(change < 0 && {
                    color: 'error.main',
                    bgcolor: alpha(theme.palette.error.main, 0.16),
                  }),
                }}
              />
              <Typography color={change < 0 ? "error.main":"success.main"}>{change}%</Typography>
              <Typography variant="subtitle2">{change < 0 ? "decrease" :"increase"} vs last period</Typography>
            </Stack>
          </Grid>
          )
        })
      :null}
    </Grid>
  </Card>
  );
};
