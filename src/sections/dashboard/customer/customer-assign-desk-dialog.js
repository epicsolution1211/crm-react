import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useForm, useWatch } from "react-hook-form";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';

import { SelectMenu } from "src/components/customize/select-menu";
import { customersApi } from "src/api/customers";
import { useAuth } from "src/hooks/use-auth";
import { useGetCustomerDesks } from "src/api-swr/customer";

export const CustomerAssignDeskDialog = (props) => {
  const {
    open,
    onClose,
    selected,
    onGetData = () => {},
    onTicketsGet = () => {},
  } = props;
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit, reset, setValue } = useForm();
  const { user } = useAuth();
  const { deskList } = useGetCustomerDesks({}, user);

  const desk_id = useWatch({ control, name: "desk_id" });

  const handleAssignDesk = async () => {
    try {
      setIsLoading(true);
      if (desk_id) {
        const request = {
          id: selected?.[0],
          desk_id,
        };

        await customersApi.updateCustomer(request);
        toast.success("Desk successfully assigned!");
        setTimeout(() => onGetData(), 1000);
        setTimeout(() => onTicketsGet(), 1500);
      } else {
        toast.error("Desk is not selected!");
        setIsLoading(false);
      }

      setIsLoading(false);
    } catch (error) {
      console.error("error", error);
      toast.error(error?.response?.data?.message);
    }
    onClose();
    setIsLoading(false);
  };

  useEffect(() => {
    reset();
    setValue("desk_id", null);
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <Container maxWidth="sm" sx={{ p: 3 }}>
        <Stack direction="column" spacing={3}>
          <Stack py={2} direction="row" justifyContent="center">
            <Typography variant="h5">Assign desk</Typography>
          </Stack>
          <Stack>
            <form noValidate onSubmit={handleSubmit(handleAssignDesk)}>
              <Stack spacing={3}>
                <Stack spacing={2}>
                  <Stack>
                    <SelectMenu
                      control={control}
                      label="Select Desk"
                      name="desk_id"
                      list={deskList}
                      isSearch
                    />
                  </Stack>
                </Stack>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    pb: 3,
                  }}
                >
                  <Button variant="outlined" sx={{ mr: 2 }} onClick={onClose}>
                    Cancel
                  </Button>
                  <LoadingButton
                    sx={{
                      width: 90,
                    }}
                    variant="contained"
                    type="submit"
                    loading={isLoading}
                    disabled={isLoading}
                  >
                    Assign
                  </LoadingButton>
                </Box>
              </Stack>
            </form>
          </Stack>
        </Stack>
      </Container>
    </Dialog>
  );
};
