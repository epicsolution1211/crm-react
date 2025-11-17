import { useCallback, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import toast from "react-hot-toast"

import { DeleteModal } from "../../../components/customize/delete-modal";
import { customersApi } from "src/api/customers";
import { paths } from "src/paths";
import { useRouter } from "src/hooks/use-router";

export const CustomerDataManagement = (props) => {
  const { id } = props;
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCustomerDelete = useCallback(async () => {
    try {
      setIsLoading(true);
      await customersApi.deleteCustomers({ client_ids: [id] });
      toast.success("Customer successfully deleted!");
      setTimeout(router.push(paths.dashboard.customers.index), 3000);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error('error: ', error);
    }
  }, [id]);

  return (
    <>
      <Card>
        <CardHeader title="Data Management" />
        <CardContent sx={{ pt: 0 }}>
          <Button color="error"
            variant="outlined"
            disabled={isLoading}
            onClick={() => setModalOpen(true)}>
            Delete Account
          </Button>
          <Box sx={{ mt: 2 }}>
            <Typography color="text.secondary"
              variant="body2">
              Remove this customer’s chart if he requested that, if not please be
              aware that what has been deleted can never brought back
            </Typography>
          </Box>
        </CardContent>
      </Card>
      <DeleteModal
        isOpen={modalOpen}
        setIsOpen={setModalOpen}
        onDelete={handleCustomerDelete}
        title={'Delete Customer'}
        description={'Are you sure you want to delete this customer?'}
        isLoading={isLoading}
      />
    </>
  );
};
