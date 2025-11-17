// MUI components
import { LoadingButton } from "@mui/lab";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

// React and hooks
import { Controller, useForm } from "react-hook-form";

// Custom components
import { QuillEditor } from "src/components/quill-editor";

// API
import { customersApi } from "src/api/customers";

// Custom hooks
import { useAuth } from "src/hooks/use-auth";
import toast from "react-hot-toast";

// Toast

export const CustomerNote = ({ customerInfo, updateCustomerInfo, customerId }) => {
  
  const { control, formState: { isSubmitting }, handleSubmit } = useForm({
    defaultValues: {
      note: customerInfo?.client?.note || ''
    }
  });

  const { user } = useAuth();

  const handleSave = handleSubmit(async (data) => {
    try {
      await customersApi.updateCustomer({ id: customerId, note: data?.note });
      toast.success("Customer note updated successfully");
      updateCustomerInfo({ ...customerInfo, client: { ...customerInfo?.client, note: data?.note } });
    } catch (error) {
      toast.error(error?.message || "Failed to update customer note");
    }
  })

  return (
      <Stack spacing={4}>
        <Card>
          <CardContent>
            <Stack
              direction="row"
              justifyContent="space-between"
              spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h5">Customer Note</Typography>
              </Stack>
            </Stack>
            <Controller
              name='note'
              control={control}
              render={({ field: { onChange, value } }) => (
                <QuillEditor
                  placeholder="Write something"
                  sx={{ height: 350, my: 3 }}
                  value={value}
                  onChange={onChange}
                  readOnly={!user?.acc?.acc_e_client_note && user?.acc?.acc_e_client_note !== undefined}
                />
              )}
            />
            <Stack direction="row" justifyContent="flex-end">
              <LoadingButton
                variant="contained"
                color="primary"
                loading={isSubmitting}
                onClick={handleSave}
              >
                Save
              </LoadingButton>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
  );
};
