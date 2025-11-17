import React, { useEffect, useMemo } from 'react'
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import LocalAtmOutlinedIcon from '@mui/icons-material/LocalAtmOutlined';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useForm } from 'react-hook-form'
import { set, format } from 'date-fns';

import InputWithIcon from '../../../../../components/customize/input-with-icon';
import { Scrollbar } from 'src/components/scrollbar';
import CustomSwitch from '../../../../../components/customize/custom-switch';
import InputWithTimePicker from '../../../../../components/customize/input-with-time-picker';
import { useAuth } from 'src/hooks/use-auth';

const dayList = [
  { label: 'Mon', name: 'monday' },
  { label: 'Tue', name: 'tuesday' },
  { label: 'Wed', name: 'wednesday' },
  { label: 'Thu', name: 'thursday' },
  { label: 'Fri', name: 'friday' },
  { label: 'Sat', name: 'saturday' },
  { label: 'Sun', name: 'sunday' },
];

const startTimeList = ['monday_start_time', 'tuesday_start_time', 'wednesday_start_time', 'thursday_start_time', 'friday_start_time', 'saturday_start_time', 'sunday_start_time'];
const endTimeList = ['monday_end_time', 'tuesday_end_time', 'wednesday_end_time', 'thursday_end_time', 'friday_end_time', 'saturday_end_time', 'sunday_end_time'];
const maxLeadList = ['monday_max_leads', 'tuesday_max_leads', 'wednesday_max_leads', 'thursday_max_leads', 'friday_max_leads', 'saturday_max_leads', 'sunday_max_leads'];
const maxFtdList = ['monday_max_ftd', 'tuesday_max_ftd', 'wednesday_max_ftd', 'thursday_max_ftd', 'friday_max_ftd', 'saturday_max_ftd', 'sunday_max_ftd'];

const TimeCapacityPanel = ({ activeCountry, timeCapacity, updateTimeCapacity }) => {
  const { user } = useAuth();
  const { handleSubmit, control, setValue, watch } = useForm();

  const watchField = watch();

  const enabledList = useMemo(() => {
    const enabledList = dayList?.map((item) => (watchField[item?.name]));
    return enabledList;
  }, [watchField]);

  useEffect(() => {
    const data = timeCapacity?.find((item) => (item?.id === activeCountry?.id));
    if (data) {
      dayList?.forEach((item) => {
        setValue(item.name, data[item.name] ?? false);
      });
      startTimeList?.forEach((item) => {
        setValue(item, data[item]?.split('.')[0] ?? format(set(new Date(), { hours: 0, minutes: 0, seconds: 0 }), 'yyyy-MM-dd HH:mm'));
      });
      endTimeList?.forEach((item) => {
        setValue(item, data[item]?.split('.')[0] ?? format(set(new Date(), { hours: 0, minutes: 0, seconds: 0 }), 'yyyy-MM-dd HH:mm'));
      });
      maxLeadList?.forEach((item) => {
        setValue(item, data[item] ?? 0);
      });
      maxFtdList?.forEach((item) => {
        setValue(item, data[item] ?? 0);
      });
    }
  }, [timeCapacity, activeCountry]);

  const onSubmit = (data) => {
    updateTimeCapacity(activeCountry?.id, { ...data, name: activeCountry?.name });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack sx={{ paddingX: 2 }}>
        <Typography sx={{ mb: 1 }}
          variant='h6'>{activeCountry?.name ?? 'Default'}</Typography>
        <Stack>
          <Scrollbar>
            <Table sx={{ minWidth: 700 }}>
              <TableBody>
                <TableRow >
                  <TableCell
                    sx={{ padding: 0, paddingRight: 1 }}>
                    DAY:
                  </TableCell>
                  {dayList.map((item) => (
                    <TableCell
                      key={item?.name}
                      sx={{ padding: 0 }}>
                      <CustomSwitch
                        key={item?.name}
                        name={item?.name}
                        control={control}
                        label={item?.label}
                      />
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow >
                  <TableCell
                    sx={{
                      whiteSpace: 'nowrap',
                      padding: 0,
                      paddingRight: 1
                    }}>
                    START TIME:
                  </TableCell>
                  {startTimeList.map((item, index) => (
                    <TableCell
                      key={item}
                      sx={{ padding: 0 }}>
                      <InputWithTimePicker
                        name={item}
                        disabled={!enabledList[index]}
                        control={control}
                      />
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow >
                  <TableCell
                    sx={{
                      whiteSpace: 'nowrap',
                      padding: 0,
                      paddingRight: 1
                    }}>
                    END TIME:
                  </TableCell>
                  {endTimeList.map((item, index) => (
                    <TableCell
                      key={item}
                      sx={{ padding: 0 }}>
                      <InputWithTimePicker
                        name={item}
                        disabled={!enabledList[index]}
                        control={control}
                      />
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow >
                  <TableCell
                    sx={{
                      whiteSpace: 'nowrap',
                      padding: 0,
                      paddingRight: 1
                    }}>
                    MAX LEADS:
                  </TableCell>
                  {maxLeadList.map((item, index) => (
                    <TableCell
                      key={item}
                      sx={{ padding: 0 }}>
                      <InputWithIcon
                        control={control}
                        name={item}
                        disabled={!enabledList[index]}
                        iconComponent={<EventAvailableOutlinedIcon fontSize='small' />} />
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow >
                  <TableCell
                    sx={{
                      whiteSpace: 'nowrap',
                      padding: 0,
                      paddingRight: 1
                    }}>
                    MAX FTDS:
                  </TableCell>
                  {maxFtdList.map((item, index) => (
                    <TableCell
                      key={item}
                      sx={{ padding: 0 }}>
                      <InputWithIcon
                        control={control}
                        name={item}
                        disabled={!enabledList[index]}
                        iconComponent={<LocalAtmOutlinedIcon fontSize='small' />} />
                    </TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </Scrollbar>
        </Stack>
        <Stack
          direction='row'
          justifyContent='end'
          mt={2}
          px={2}
        >
          <Button
            variant='outlined'
            size="medium"
            type='submit'
            disabled={!user?.acc?.acc_e_lm_brand}
          >
            Update
          </Button>
        </Stack>
      </Stack>
    </form>
  )
}

export default TimeCapacityPanel