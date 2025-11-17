import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Dialog from "@mui/material/Dialog";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";
import { conversationApi } from "src/api/conversation";

const periodsList = [
  { label: "1 day", value: 24 },
  { label: "2 days", value: 48 },
  { label: "3 days", value: 72 },
  { label: "4 days", value: 96 },
  { label: "5 days", value: 120 },
  { label: "6 days", value: 144 },
  { label: "1 week", value: 168 },
  { label: "2 weeks", value: 336 },
  { label: "3 weeks", value: 504 },
  { label: "1 month", value: 672 },
  { label: "2 months", value: 1344 },
  { label: "3 months", value: 2016 },
  { label: "4 months", value: 2688 },
  { label: "5 months", value: 3360 },
  { label: "6 months", value: 4032 },
  { label: "11 months", value: 7392 },
];

export const ChatAutoDeleteModal = ({ open, onClose, conversation }) => {
  const { control, handleSubmit, setValue } = useForm();
  const initialValueSet = useRef(false);

  useEffect(() => {
    if (conversation?.conversation && !initialValueSet.current) {
      setValue("period", conversation?.conversation?.auto_delete);
      initialValueSet.current = true;
    }
  }, [conversation, setValue]);

  const onSubmit = async (data) => {
    try {
      await conversationApi.updateConversation(conversation?.conversation?.id, {
        auto_delete: data?.period,
      });
      toast.success("Auto delete period successfully updated!");
      onClose();
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.error("error: ", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <Container maxWidth="sm">
        <Stack px={5} py={5}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={4}>
              <Stack spacing={2}>
                <Typography variant="h5">Auto-delete messages</Typography>

                <Typography variant="h7">
                  Automatically delete new messages sent in this chat after a
                  certain period of time.
                </Typography>
              </Stack>

              <Controller
                name="period"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Select a period</InputLabel>
                    <Select
                      {...field}
                      label="Select a period"
                    >
                      {periodsList.map((period) => (
                        <MenuItem key={period.value} value={period.value}>
                          {period.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />

              <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={2}>
                <Button variant="outlined" onClick={onClose}>
                  Cancel
                </Button>
                <Button variant="contained" type="submit">
                  Save
                </Button>
              </Stack>
            </Stack>
          </form>
        </Stack>
      </Container>
    </Dialog>
  );
};
