import { useCallback, useEffect, useState } from "react";
import * as yup from "yup";
import PropTypes from "prop-types";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";

import { customersApi } from "src/api/customers";
import { useDebounce } from "src/hooks/use-debounce";
import { SelectMenu } from "src/components/customize/select-menu";
import { settingsApi } from "src/api/settings";
import { useTimezone } from "src/hooks/use-timezone";

const useGetCustomers = () => {
  const [customerList, setCustomerList] = useState([]);
  const [search, setSearch] = useState('');
  const q = useDebounce(search, 300);

  const getCustomers = async () => {
    try {
      const { clients } = await customersApi.getCustomers({ q: q?.length > 0 ? q : null, per_page: 20 });
      setCustomerList(clients);
    } catch (error) {
      throw new Error(error);
    }
  }

  useEffect(() => {
    getCustomers();
  }, [q]);

  return {
    customerList,
    search,
    setSearch,
  }
}

const validationSchema = yup.object({
  description: yup.string().required("Description is required"),
});

export const CalendarEventDialog = ({ event, onClose, handleEventsGet, open = false, date: initialDate }) => {
  const { toUTCTime, combineDate } = useTimezone();
  const [description, setDescription] = useState();
  const [date, setDate] = useState(initialDate ? initialDate : new Date());
  const [time, setTime] = useState(initialDate ? initialDate : new Date());

  useEffect(() => {
    if (initialDate) {
      setDate(initialDate);
      setTime(new Date(initialDate));
    } else {
      setDate(new Date());
      setTime(new Date());
    }
  }, [initialDate]);

  const {
    control,
    handleSubmit, 
    setValue,
    register,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    reset();
  }, [open]);

  const { customerList, search, setSearch } = useGetCustomers();

  const onSubmit = useCallback(async (data) => {
    try {
      const newTime = combineDate(date, time);
      const timeInUTC = toUTCTime(newTime);

      const params = {
        time: timeInUTC,
        description: data?.description,
        client_id: data?.client_id,
      };

      await settingsApi.createReminder(params);
      toast.success("Reminder successfully created!");
  
      setDate(new Date());
      setTime(new Date());
      setValue("client_id", null);
      setDescription(null);
      onClose();
  
      setTimeout(() => {
        handleEventsGet();
      }, 1000);
    } catch (error) {
      toast.error(error?.response?.data?.message);
      throw new Error(error);
    }
  }, [date, time, description]);
  
  return (
    <Dialog fullWidth maxWidth="sm" onClose={onClose} open={open}>
      <Box sx={{ p: 3 }}>
        <Typography align="center" gutterBottom variant="h5">
          {event ? "Edit Event" : "Add Event"}
        </Typography>
      </Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2} sx={{ p: 3 }}>
          <SelectMenu
            list={customerList?.map?.(customer => ({ label: customer?.full_name ?? customer?.email, value: customer?.id }))}
            control={control}
            name="client_id"
            label="Client"
            isApiSearch
            apiSearch={search}
            setApiSearch={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setSearch(e?.target?.value);
            }}
          />
          <TextField
            error={!!errors?.description}
            helperText={errors?.description?.message}
            fullWidth
            label="Description"
            name="description"
            {...register("description")}
          />
          <DatePicker
            format="yyyy-MM-dd"
            label="Reminder Date"
            value={date ? new Date(date) : new Date()}
            onChange={(val) => setDate(val)}
          />
          <TimePicker
            format="h:mm a"
            label="Reminder Time"
            value={time ? new Date(time) : new Date()}
            onChange={(val) => setTime(val)}
          />
        </Stack>
        <Divider />
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="space-between"
          spacing={1}
          sx={{ p: 2 }}
        >
          <Stack
            alignItems="center"
            direction="row"
            justifyContent="flex-end"
            spacing={1}
            width={1}
          >
            <Button color="inherit" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
            >
              Confirm
            </Button>
          </Stack>
        </Stack>
      </form>
    </Dialog>
  );
};

CalendarEventDialog.propTypes = {
  action: PropTypes.oneOf(["create", "update"]),
  event: PropTypes.object,
  onAddComplete: PropTypes.func,
  onClose: PropTypes.func,
  onDeleteComplete: PropTypes.func,
  onEditComplete: PropTypes.func,
  open: PropTypes.bool,
  range: PropTypes.object,
};
