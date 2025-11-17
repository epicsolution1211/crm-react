import { useState, useEffect } from 'react';
import * as yup from "yup";
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import CustomModal from 'src/components/customize/custom-modal'
import { Scrollbar } from 'src/components/scrollbar';
import { TableNoData } from 'src/components/table-empty';
import { TableSkeleton } from 'src/components/table-skeleton';
import { brandsApi } from 'src/api/lead-management/brand';
import { DeleteModal } from 'src/components/customize/delete-modal';
import { Iconify } from 'src/components/iconify';

export const keyRegExp =
  /^[a-zA-Z0-9_]+$/;

const validationSchema = yup.object({
  key: yup.string().required('Key is a required field').matches(keyRegExp, 'Key can not have space or special characters'),
  value: yup.string().required('Value is a required field')
})


export const AdditionalParams = ({ brandId }) => {
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({ resolver: yupResolver(validationSchema) });

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const [bankParams, setBankParams] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedParam, setSelectedParam] = useState(undefined);
  const [body, setBody] = useState(false);
  const [header, setHeader] = useState(false);

  const getBankParams = async () => {
    setIsLoading(true);
    try {
      const res = await brandsApi.getBrandParams({ brand_id: brandId });
      setBankParams(res?.brand_params);
    } catch (error) {
      console.error('error: ', error);
    }
    setIsLoading(false);
  };

  const onSubmit = async (data) => {
    try {
      data.brand_id = brandId;
      if (selectedParam) {
        data.header = header;
        data.body = body;
        await brandsApi.updateBrandParams(selectedParam?.id, data);
      } else {
        await brandsApi.createBrandParams(data);
      }
      setTimeout(() => {
        getBankParams()
      }, 1000);
      toast(selectedParam ? 'Brand param successfully updated!' : 'Brand param successfully created!')
    } catch (error) {
      toast(error?.response?.data?.message ?? error?.message)
      console.warn('error: ', error);
    }
    setModalOpen(false);
  }

  const handleDelete = async () => {
    try {
      await brandsApi.deleteBrandParams(selectedParam?.id, { brand_id: brandId });
      setTimeout(() => {
        getBankParams()
      }, 1000);
      toast('Brand param successfully deleted!');
      setDeleteModal(false);
    } catch (error) {
      toast(error?.response?.data?.message ?? error?.message);
    }
  }


  useEffect(() => {
    getBankParams();
  }, []);

  const defaultColumn = [
    {
      id: 'id',
      label: 'Id',
      width: 50,
    },
    {
      id: 'key',
      label: 'Key',
    },
    {
      id: 'value',
      label: 'Value',
    },
    {
      id: 'header',
      label: 'Header',
      width: 200,
      render: (row) => (
        <Checkbox checked={row?.header} />
      )
    },
    {
      id: 'body',
      label: 'body',
      width: 200,
      render: (row) => (
        <Checkbox checked={row?.body} />
      )
    },
    {
      id: 'action',
      label: 'Action',
      width: 200,
      render: (row) => (
        <Stack direction="row" gap={1}>
          <Tooltip title="Edit">
            <IconButton
              size="small"
              onClick={() => {
                setValue('key', row?.key);
                setValue('value', row?.value);
                setHeader(row?.header);
                setBody(row?.body);
                setSelectedParam(row);
                setModalOpen(true);
              }}
              sx={{ '&:hover': { color: 'primary.main' }}}
            >
              <Iconify icon="mage:edit" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              onClick={() => {
                setSelectedParam(row);
                setDeleteModal(true);
              }}
              sx={{ '&:hover': { color: 'error.main' }}}
            >
              <Iconify icon="heroicons:trash" />
            </IconButton>
          </Tooltip>
        </Stack>
      )
    },
  ];

  return (
    <>
      <Stack
        direction="row"
        pb={3}
        justifyContent="flex-end">
        <Button
          onClick={() => {
            reset()
            setModalOpen(true)
            setSelectedParam(undefined);
          }}
          variant="contained"
        >Add Params</Button>
      </Stack>
      <Scrollbar>
        <Table sx={{ minWidth: 700 }}>
          <TableHead>
            <TableRow sx={{ whiteSpace: 'nowrap' }}>
              {defaultColumn?.map((item) => (
                <TableCell key={item.id}
                  sx={{ width: item.width }}>
                  {item.headerRender ? item.headerRender() :
                    <Typography
                      sx={{ fontSize: 14, fontWeight: '600' }}
                    >{item.label}</Typography>}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ?
              <TableSkeleton
                rowCount={5}
                cellCount={6} />
              :
              (bankParams?.map((params) => (
                <TableRow key={params?.id}
                  sx={{ whiteSpace: 'nowrap' }}>
                  {defaultColumn?.map((column, index) => (
                    <TableCell key={params.id + index}>
                      {column?.render ? column?.render(params) : params[column?.id]}
                    </TableCell>
                  ))}
                </TableRow>
              )))}
          </TableBody>
        </Table>
        <Divider />
      </Scrollbar>
      {(bankParams?.length === 0 && !isLoading) && <TableNoData />}
      <CustomModal
        onClose={() => {
          setModalOpen(false);
          reset();
        }}
        open={modalOpen}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            <Typography
              id="modal-modal-title"
              align="center"
              sx={{ fontSize: 22, fontWeight: 'bold', mt: 1 }}>
              {selectedParam ? "Update Brand Params" : "Create Brand Params"}
            </Typography>
            <Stack
              sx={{ py: 2 }}
              spacing={2}
              justifyContent="center">
              <Stack
                direction='row'
                spacing={2}
                alignItems='center'>
                <TextField
                  fullWidth
                  error={!!errors?.key?.message}
                  helperText={errors?.key?.message}
                  label="Key"
                  name="key"
                  type="text"
                  {...register('key')}
                />
                <TextField
                  fullWidth
                  error={!!errors?.value?.message}
                  helperText={errors?.value?.message}
                  label="Value"
                  name="value"
                  type="text"
                  {...register('value')}
                />
              </Stack>
              {selectedParam && <Stack
                direction='row'
                spacing={4}
                justifyContent='center'>
                <Stack
                  direction='row'
                  alignItems='center'>
                  <Checkbox
                    checked={body}
                    onChange={(event) => {
                      if (header) {
                        setBody(event?.target?.checked);
                      }
                    }}
                  />
                  <Typography>
                    Body
                  </Typography>
                </Stack>
                <Stack
                  direction='row'
                  alignItems='center'>
                  <Checkbox
                    checked={header}
                    onChange={(event) => {
                      if (body) {
                        setHeader(event?.target?.checked);
                      }
                    }}
                  />
                  <Typography>
                    Header
                  </Typography>
                </Stack>
              </Stack>}
            </Stack>
            <Stack
              sx={{ gap: 2 }}
              direction="row"
              justifyContent="center">
              <Button
                variant="contained"
                type="submit"
              >
                {selectedParam ? "Update" : "Create"}
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  setModalOpen(false);
                }}>Cancel</Button>
            </Stack>
          </Stack>
        </form>
      </CustomModal>
      <DeleteModal
        isOpen={deleteModal}
        setIsOpen={() => setDeleteModal(false)}
        onDelete={() => handleDelete()}
        title={'Delete Param'}
        description={'Are you sure you want to delete this Param?'}
      />
    </>
  );
};
