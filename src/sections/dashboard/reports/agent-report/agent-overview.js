import Card from "@mui/material/Card";
import Grid from '@mui/material/Unstable_Grid2';
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Skeleton from "@mui/material/Skeleton";
import { useTheme } from '@mui/material/styles';

import { Iconify } from 'src/components/iconify';
import { alpha } from '@mui/system/colorManipulator';
import { useEffect } from "react";

const getOverViewList = (companyType) => {
  const baseList = [
    {
      label:'Total FTD',
      key: 'total_ftd_amount',
      change: 'total_ftd_change'
    },
    {
      label:'Total WD',
      key: 'total_wd_amount',
      change: 'total_wd_change'
    },
  ];

  if (companyType !== 2) {
    baseList.push(
      {
        label:'Open Positions',
        key: 'total_open_positions',
        change: 'open_position_change'
      },
      {
        label:'Close Positions',
        key: 'total_close_positions',
        change: 'close_position_change'
      }
    );
  }

  return baseList;
};

export const AgentOverview = ({ report, isLoading, setOverViewTable, company }) => {
  const theme = useTheme();
  const overViewList = getOverViewList(company?.company_type);

  const generateTableInfo = () => {
    const labels = overViewList.map(item => item.label);
    const tableInfo = [
      labels,
      overViewList.map((item) => {
        const change = report[item?.change]? parseFloat(report[item?.change]??0):0;
        return (`${report[item?.key] ?? ""}(${change}% ${change >= 0? 'increase' : 'decrease'} vs last period)`);
      })
    ];
    setOverViewTable(tableInfo);
  }

  useEffect(() => {
    if(report) {
      generateTableInfo();
    }
  }, [report]);
  
  return (
    <Card sx={{ py: 3, px: 1}}>
    <Grid container spacing={1} px={0}>
      {isLoading?
        overViewList?.map((item, index)=> (
          <Grid
            key={index} 
            xs={12}
            sm={6}
            xl={3}
            sx={{
              borderRight: { xl: index > 2? '':'1px solid #919EAB52', xs: 0 },
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
              borderRight: { xl: index > 2 ? '':'1px solid #919EAB52', xs: 0 },
              px: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5,
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
