import { useState, useEffect } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import LoadingButton from '@mui/lab/LoadingButton';
import toast from "react-hot-toast";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { yupResolver } from "@hookform/resolvers/yup";

import CustomModal from "src/components/customize/custom-modal";
import { DeleteModal } from "src/components/customize/delete-modal";
import { TableNoData } from "src/components/table-empty";
import { TableSkeleton } from "src/components/table-skeleton";
import { settingsApi } from "src/api/settings";
import { useAuth } from "src/hooks/use-auth";
import { Iconify } from "src/components/iconify";

const validationSchema = yup.object({
  ip_address: yup.string().required("Ip address is a required field"),
});

export const SettingsPlatformIp = () => {
  const { user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [ipAddress, setIpAddress] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [selectedIp, setSelectedIp] = useState(undefined);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting, isValid },
  } = useForm({ resolver: yupResolver(validationSchema) });

  const onSubmit = async (data) => {
    try {
      if (selectedIp) {
        const res = await settingsApi.updateCompanyIpAddress(selectedIp, data);
        setIpAddress((prev) =>
          prev?.map((item) => {
            if (item?.id === res?.ip?.id) {
              return res?.ip;
            } else {
              return item;
            }
          })
        );
      } else {
        const res = await settingsApi.createCompanyIpAddress(data);
        setIpAddress((prev) => [...prev, res?.ip]);
      }
      toast.success(
        selectedIp
          ? "Ip address successfully updated!"
          : "Ip address successfully created!"
      );
    } catch (error) {
      toast.error(error?.response?.data?.message ?? error?.message);
    }
    setModalOpen(false);
    setSelectedIp(undefined);
  };

  const getIpAddress = async () => {
    try {
      const res = await settingsApi.getCompanyIpAddress();
      setIpAddress(res?.ips);
    } catch (error) {
      console.error("error: ", error);
    }
  };

  const handleGetIpAddress = async () => {
    try {
      setIsLoading(true);
      await getIpAddress();
    } catch (error) {
      console.error("error: ", error);
    }
    setIsLoading(false);
  };

  const handleDeleteIpAddress = async () => {
    setIsDeleteLoading(true);
    try {
      await settingsApi.deleteCompanyIpAddress(selectedIp);
      setIpAddress((prev) => prev?.filter((item) => item?.id !== selectedIp));
      toast.success("Ip address successfully deleted!");
    } catch (error) {
      toast.error(error?.response?.data?.message ?? error?.message);
    }
    setIsDeleteLoading(false);
    setSelectedIp(undefined);
    setDeleteModalOpen(false);
  };

  const defaultColumn = [
    {
      id: "id",
      label: "Id",
      enabled: true,
      width: 50,
    },
    {
      id: "ip_address",
      label: "IP Address",
      enabled: true,
      width: 500,
    },
    {
      id: "description",
      label: "Description",
      enabled: true,
    },
    {
      id: "action",
      label: "Action",
      enabled: true,
      width: 100,
      render: (row) => (
        <Stack direction="row" alignItems="center" gap={2}>
          <Tooltip title="Edit">
            <IconButton
              onClick={() => {
                setSelectedIp(row?.id);
                setValue("ip_address", row?.ip_address);
                setModalOpen(true);
              }}
            >
              <Iconify icon="mage:edit" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              onClick={() => {
                setSelectedIp(row?.id);
                setDeleteModalOpen(true);
              }}
            >
              <Iconify icon="heroicons:trash" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  useEffect(() => {
    handleGetIpAddress();
  }, []);

  return (
    <>
      <Card>
        <CardHeader title="Company IP Address" />
        <CardContent sx={{ pt: 0 }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="end"
            sx={{ pb: 3 }}
          >
            {user?.acc?.acc_e_add_ip === undefined ||
              user?.acc?.acc_e_add_ip ? (
              <Button
                variant="contained"
                onClick={() => {
                  setModalOpen(true);
                  setValue("ip_address", "");
                  setSelectedIp(undefined);
                }}
              >
                Add New IP
              </Button>
            ) : null}
          </Stack>
          <Table sx={{ minWidth: 700 }}>
            <TableHead>
              <TableRow sx={{ whiteSpace: "nowrap" }}>
                {defaultColumn
                  ?.filter((item) => item.enabled)
                  ?.map((item) => (
                    <TableCell key={item.id} sx={{ width: item.width }}>
                      <Typography sx={{ fontSize: 14, fontWeight: "600" }}>
                        {item.label}
                      </Typography>
                    </TableCell>
                  ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableSkeleton rowCount={5} cellCount={4} />
              ) : (
                ipAddress?.map((brand) => (
                  <TableRow key={brand?.id} sx={{ whiteSpace: "nowrap" }}>
                    {defaultColumn
                      ?.filter((item) => item.enabled)
                      ?.map((column, index) => (
                        <TableCell key={brand.id + index}>
                          {column?.render
                            ? column?.render(brand)
                            : brand[column?.id]}
                        </TableCell>
                      ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          {ipAddress?.length === 0 && !isLoading && <TableNoData isSmall />}
        </CardContent>
      </Card>
      <CustomModal onClose={() => setModalOpen(false)} open={modalOpen}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            <Typography
              id="modal-modal-title"
              align="center"
              sx={{ fontSize: 22, fontWeight: "bold" }}
            >
              {selectedIp ? "Update IP address?" : "Create IP address?"}
            </Typography>
            <Stack sx={{ py: 3 }} direction="row" justifyContent="center">
              <TextField
                {...register("ip_address")}
                fullWidth
                autoFocus
                label="IP Address"
                type="text"
              />
            </Stack>
            <Stack sx={{ py: 3 }} direction="row" justifyContent="center">
              <TextField
                {...register("description")}
                fullWidth
                multiline
                label="Description"
                type="text"
              />
            </Stack>
            <Stack sx={{ gap: 2 }} direction="row" justifyContent="center">
              <LoadingButton
                loading={isSubmitting}
                disabled={!isValid}
                type="submit"
                variant="contained"
                sx={{ width: 80 }}
              >
                {selectedIp ? "Update" : "Create"}
              </LoadingButton>
              <Button variant="outlined" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
            </Stack>
          </Stack>
        </form>
      </CustomModal>
      <DeleteModal
        isLoading={isDeleteLoading}
        isOpen={deleteModalOpen}
        setIsOpen={setDeleteModalOpen}
        onDelete={() => handleDeleteIpAddress()}
        title={"Delete IP Address"}
        description={"Are you sure you want to delete this IP address?"}
      />
    </>
  );
};
