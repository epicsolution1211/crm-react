import { useCallback, useMemo } from 'react';
import { format } from 'date-fns';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import Button from '@mui/material/Button';
import { Iconify } from 'src/components/iconify';

const viewOptions = [
  {
    label: 'Month',
    value: 'dayGridMonth'
  },
  {
    label: 'Week',
    value: 'timeGridWeek'
  },
  {
    label: 'Day',
    value: 'timeGridDay'
  },
  {
    label: 'Agenda',
    value: 'listWeek'
  }
];

export const CalendarToolbar = (props) => {
  const {
    date,
    onDateNext,
    onDatePrev,
    onViewChange,
    view,
    ...other
  } = props;
  const mdUp = useMediaQuery((theme) => theme.breakpoints.up('md'));

  const handleViewChange = useCallback((event) => {
    onViewChange?.(event.target.value);
  }, [onViewChange]);

  const dateMonth = format(date, 'MMMM');
  const dateDay = format(date, 'y');

  // On mobile allow only timeGridDay and agenda views

  const availableViewOptions = useMemo(() => {
    return mdUp
      ? viewOptions
      : viewOptions.filter((option) => ['timeGridDay', 'listWeek'].includes(option.value));
  }, [mdUp]);

  return (
    <Stack
      alignItems="center"
      flexWrap="wrap"
      justifyContent="space-between"
      flexDirection={{
        xs: 'column',
        md: 'row'
      }}
      spacing={3}
      sx={{ px: 3 }}
      {...other}>
      <Stack
        alignItems="center"
        direction="row"
        spacing={1}
      >
        <Typography variant="h5">
          {dateMonth}
        </Typography>
        <Typography
          sx={{ fontWeight: 400 }}
          variant="h5"
        >
          {dateDay}
        </Typography>
      </Stack>
      <Stack
        alignItems="center"
        direction="row"
        spacing={2}
      >
        <IconButton onClick={onDatePrev} color='primary'>
          <Iconify icon="mi:chevron-left" width={24} />
        </IconButton>
        <IconButton onClick={onDateNext} color='primary'>
          <Iconify icon="mi:chevron-right" width={24} />
        </IconButton>
        <TextField
          label="View"
          name="view"
          onChange={handleViewChange}
          select
          SelectProps={{ native: true }}
          size="small"
          sx={{
            minWidth: 120,
            order: {
              xs: -1,
              md: 0
            }
          }}
          value={view}
        >
          {availableViewOptions.map((option) => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </TextField>
        <Button
          startIcon={(
            <Iconify icon="line-md:plus" width={16} />
          )}
          sx={{
            width: {
              xs: '100%',
              md: 'auto'
            }
          }}
          variant="contained"
        >
          Add Event
        </Button>
      </Stack>
    </Stack>
  );
};
