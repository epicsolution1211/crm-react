import { useState, useEffect } from "react";
import * as yup from "yup";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
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

import CustomModal from "src/components/customize/custom-modal";
import { Iconify } from "src/components/iconify";
import { DeleteModal } from "src/components/customize/delete-modal";
import { TableNoData } from "src/components/table-empty";
import { TableSkeleton } from "src/components/table-skeleton";
import { settingsApi } from "src/api/settings";
import { useAuth } from "src/hooks/use-auth";

const validation = yup.object({
  ip_address: yup.string().required("Ip address is required filed!"),
});

export const AffiliateIps = ({ affiliate }) => {
  const { user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [ipAddress, setIpAddress] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [selectedIp, setSelectedIp] = useState(undefined);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validation),
  });

  const getIpAddress = async () => {
    try {
      if (affiliate && affiliate.id) {
        const res = await settingsApi.getIpAddress(affiliate?.id);
        setIpAddress(res?.ips);
      }
    } catch (error) {
      console.error("error: ", error);
    }
  };

  const handleGetIpAddress = async () => {
    try {
      setIsLoading(true);
      getIpAddress();
    } catch (error) {
      console.error("error: ", error);
    }
    setIsLoading(false);
  };

  const handleControlIpAddress = async (data) => {
    try {
      if (selectedIp) {
        await settingsApi.updateIpAddress(selectedIp, {
          ip_address: data.ip_address,
          account_id: affiliate?.id,
        });
      }
      await settingsApi.createIpAddress({
        ip_address: data.ip_address,
        account_id: affiliate?.id,
      });
      getIpAddress();
      toast(
        selectedIp
          ? "Ip address successfully updated!"
          : "Ip address successfully created!"
      );
    } catch (error) {
      toast(error?.response?.data?.message ?? error?.message);
    }
    setModalOpen(false);
    setSelectedIp(undefined);
  };

  const handleDeleteIpAddress = async () => {
    try {
      await settingsApi.deleteIpAddress(selectedIp, {
        account_id: affiliate?.id,
      });
      getIpAddress();
      toast("Ip address successfully deleted!");
    } catch (error) {
      console.error("error: ", error);
    }
    setSelectedIp(undefined);
    setDeleteModalOpen(false);
  };

  const defaultColumn = [
    {
      id: "id",
      label: "Id",
      enabled: true,
      width: { md: 200, xs: 'auto' },
    },
    {
      id: "ip_address",
      label: "IP Address",
      enabled: true,
      width: { md: 200, xs: 'auto' },
    },
    {
      id: "action",
      label: "Action",
      enabled: true,
      width: { md: 100, xs: 'auto' },
      render: (row) => (
        <Stack direction="row" alignItems="center" gap={1}>
          {user?.acc?.acc_e_lm_aff || true ? (
            <Tooltip title="Edit">
              <IconButton
                onClick={() => {
                  setSelectedIp(row?.id);
                  setValue("ip_address", row?.ip_address);
                  setModalOpen(true);
                }}
              >
                <Iconify icon="mage:edit" color="primary.main"/>
              </IconButton>
            </Tooltip>
          ) : null}
          {user?.acc?.acc_e_lm_aff || true ? (
            <Tooltip title="Delete">
              <IconButton
                  onClick={() => {
                  setSelectedIp(row?.id);
                  setDeleteModalOpen(true);
                }}
              >
                <Iconify icon="heroicons:trash" color="primary.main"/>
              </IconButton>
            </Tooltip>
          ) : null}
        </Stack>
      ),
    },
  ];

  useEffect(() => {
    if (affiliate) {
      handleGetIpAddress();
    }
  }, [affiliate]);

  return (
    <>
      <Card>
        <Stack
          direction="row"
          justifyContent="space-between"
          spacing={4}
          sx={{ pt: 4, px: 4, pb: 2 }}
        >
          <Typography variant="h5">Affiliate IP Address</Typography>
        </Stack>
        <CardContent sx={{ pt: 0 }}>
          {user?.acc?.acc_e_lm_aff ? (
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="end"
              sx={{ pb: 3 }}
            >
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
            </Stack>
          ) : null}
          <Table>
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
        <form onSubmit={handleSubmit(handleControlIpAddress)}>
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
                helperText={errors?.ip_address?.message}
                error={!!errors?.ip_address?.message}
              />
            </Stack>
            <Stack sx={{ gap: 2 }} direction="row" justifyContent="center">
              <Button variant="contained" type="submit">
                {selectedIp ? "Update" : "Create"}
              </Button>
              <Button variant="outlined" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
            </Stack>
          </Stack>
        </form>
      </CustomModal>
      <DeleteModal
        isOpen={deleteModalOpen}
        setIsOpen={setDeleteModalOpen}
        onDelete={() => handleDeleteIpAddress()}
        title={"Delete IP Address"}
        description={"Are you sure you want to delete this IP address?"}
      />
    </>
  );
};
