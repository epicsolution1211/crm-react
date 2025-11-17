import { useState, useEffect } from 'react';
import * as yup from 'yup';
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
import toast from 'react-hot-toast';
import Typography from "@mui/material/Typography";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Scrollbar } from 'src/components/scrollbar';
import { TableSkeleton } from 'src/components/table-skeleton';
import CustomModal from "src/components/customize/custom-modal";
import { settingsApi } from 'src/api/settings';
import { DeleteModal } from 'src/components/customize/delete-modal';
import { useAuth } from 'src/hooks/use-auth';
import { Iconify } from '../../../components/iconify';

const validationSchema = yup.object({
  ip_address: yup.string().required('IP address is a required field')
})

const SettingsMemberIpAddress = ({ member }) => {
  const { user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({ resolver: yupResolver(validationSchema) });

  const [ipAddress, setIpAddress] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [selectedIp, setSelectedIp] = useState(undefined);

  const getIpAddress = async () => {
    try {
      const res = await settingsApi.getIpAddress(member?.id);
      setIpAddress(res?.ips);
    } catch (error) {
      console.error('error: ', error);
    }
  }

  const handleGetIpAddress = async () => {
    try {
      setIsLoading(true);
      getIpAddress();
    } catch (error) {
      console.error('error: ', error);
    }
    setIsLoading(false);
  }

  const onSubmit = async (data) => {
    try {
      if (selectedIp) {
        await settingsApi.updateIpAddress(selectedIp, { ...data, account_id: member?.id });
      } else {
        await settingsApi.createIpAddress({ ...data, account_id: member?.id });
      }
      getIpAddress();
      toast.success(selectedIp ? 'Ip address successfully updated!' : 'Ip address successfully created!');
    } catch (error) {
      toast.error(error?.response?.data?.message ?? error?.message)
    }
    setModalOpen(false);
    setSelectedIp(undefined);
  }



  const handleDeleteIpAddress = async () => {
    try {
      await settingsApi.deleteIpAddress(selectedIp, { account_id: member?.id });
      getIpAddress();
      toast('Ip address successfully deleted!');
    } catch (error) {
      console.error('error: ', error);
    }
    setSelectedIp(undefined);
    setDeleteModalOpen(false);
  }

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
      id: "action",
      label: "Action",
      enabled: true,
      width: 100,
      render: (row) => (
        <Stack
          direction='row'
          alignItems="center"
          gap={1}>
          <Tooltip title="Edit">
            <IconButton
              onClick={() => {
                setSelectedIp(row?.id);
                setModalOpen(true);
                setValue('ip_address', row?.ip_address);
              }}
              size="small"
              sx={{ '&:hover': { color: 'primary.main' }}}
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
              size="small"
              sx={{ '&:hover': { color: 'error.main' }}}
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
  }, [member]);

  return (
    <>
      <Card
        sx={{
          '&.MuiCard-root': {
            boxShadow: 'none',
          }
        }}
      >
        <CardHeader title="Account IP Address" />
        <CardContent sx={{ pt: 0 }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="end"
            sx={{ pb: 3 }}>
            {user?.acc?.acc_e_add_ip === undefined ||
              user?.acc?.acc_e_add_ip ? (
              <Button
                variant="contained"
                onClick={() => {
                  setModalOpen(true);
                  reset();
                  setSelectedIp(undefined);
                }}>
                Add New IP
              </Button>
            ) : null
            }
          </Stack>
          <Scrollbar>
            <Table>
              <TableHead>
                <TableRow sx={{ whiteSpace: "nowrap" }}>
                  {defaultColumn
                    ?.filter((item) => item.enabled)
                    ?.map((item) => (
                      <TableCell
                        key={item.id}
                        sx={{ width: item.width }}>
                        <Typography sx={{ fontSize: 14, fontWeight: "600" }}>
                          {item.label}
                        </Typography>
                      </TableCell>
                    ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableSkeleton rowCount={5}
                    cellCount={4} />
                ) : (
                  ipAddress?.map((brand) => (
                    <TableRow
                      key={brand?.id}
                      sx={{ whiteSpace: "nowrap" }}>
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
          </Scrollbar>
        </CardContent>
      </Card>
      <CustomModal
        onClose={() => setModalOpen(false)}
        open={modalOpen}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            <Typography
              id="modal-modal-title"
              align="center"
              sx={{ fontSize: 22, fontWeight: 'bold' }}>
              {selectedIp ? "Update IP address?" : "Create IP address?"}
            </Typography>
            <Stack
              sx={{ py: 3 }}
              direction="row"
              justifyContent="center">
              <TextField
                fullWidth
                {...register('ip_address')}
                error={!!errors?.ip_address?.message}
                helperText={errors?.ip_address?.message}
                autoFocus
                label="IP Address"
                type="text"
              />
            </Stack>
            <Stack
              sx={{ gap: 2 }}
              direction="row"
              justifyContent="center">
              <Button
                type='submit'
                variant="contained"
              >{selectedIp ? "Update" : "Create"}</Button>
              <Button
                type='button'
                variant="outlined"
                onClick={() => setModalOpen(false)}>Cancel</Button>
            </Stack>
          </Stack>
        </form>
      </CustomModal>
      <DeleteModal
        isOpen={deleteModalOpen}
        setIsOpen={setDeleteModalOpen}
        onDelete={() => handleDeleteIpAddress()}
        title={'Delete IP Address'}
        description={'Are you sure you want to delete this IP address?'}
      />
    </>
  );
};

export default SettingsMemberIpAddress;

