import { useEffect, useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-hot-toast";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Input from "@mui/material/Input";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Tooltip from "@mui/material/Tooltip";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import DialogTitle from "@mui/material/DialogTitle";
import LoadingButton from "@mui/lab/LoadingButton";
import DialogContent from "@mui/material/DialogContent";
import TablePagination from "@mui/material/TablePagination";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from "@mui/material/useMediaQuery";

import { Iconify } from "src/components/iconify";
import { Scrollbar } from "src/components/scrollbar";
import { useDebounce } from "src/hooks/use-debounce";
import { TableNoData } from "src/components/table-empty";
import { ConfirmDialog } from "src/components/confirm-dialog-2";
import { complianceApi } from "src/api/compliance";

const validationSchema = yup.object({
  name: yup.string().required("Name is required"),
  description: yup.string().required("Description is required"),
});

const ComplianceLabelFormDialog = ({ open, onClose, label, mutate }) => {
  const theme = useTheme();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm({ resolver: yupResolver(validationSchema)});

  const onSubmit = async (data) => {
    try {
      if (label) {
        await complianceApi.updateComplianceAiLabel(label?.id, data);
        toast.success("AI label successfully updated!");
      } else {
        await complianceApi.createComplianceAiLabel(data)
        toast.success("AI label successfully created!");
      }
      setTimeout(async () => {
        await mutate();
      }, 500);
    } catch (error) {
      toast.error(error?.response?.data?.message ??  error?.message ??  "Failed to save label");
    } finally {
      handleClose();
    }
  };

  const handleClose = () => {
    reset({
      name: '',
      color: theme.palette.primary.main,
      description: ''
    });
    onClose();
  };

  useEffect(() => {
    if (label && open) {
      setValue('name', label?.name);
      setValue('color', label?.color);
      setValue('description', label?.description);
    }
  }, [label, open]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
    >
      <DialogTitle sx={{ mt: 0.5 }}>{label ? "Edit AI Label" : "Create AI Label"}</DialogTitle>
      <DialogContent sx={{ width: { xs: '100%', md: 450 } }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            <Stack sx={{ py: 1 }} direction="row" gap={2} justifyContent="center">
              <TextField
                fullWidth
                autoFocus
                error={!!errors?.name?.message}
                helperText={errors?.name?.message}
                label="Name"
                name="name"
                type="text"
                {...register("name")}
                InputLabelProps={{
                  shrink: true,
                }}
                size="small"
              />
              <TextField
                fullWidth
                label="Label color"
                name="color"
                type="color"
                {...register("color")}
                InputLabelProps={{ shrink: true }}
                size="small"
              />
            </Stack>
            <TextField
              fullWidth
              error={!!errors?.description?.message}
              helperText={errors?.description?.message}
              label="Description"
              name="description"
              type="text" 
              multiline
              minRows={2}
              {...register("description")}
              size="small"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <Stack direction="row" spacing={1.5} sx={{ mt: 2, justifyContent: 'flex-end' }}>
              <LoadingButton loading={isSubmitting} variant="contained" type="submit" size="small">
                {label ? 'Update' : 'Create'}
              </LoadingButton>
              <Button variant="outlined" onClick={handleClose} size="small">
                Cancel
              </Button>
            </Stack>
          </Stack>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export const ComplianceAiLabelsDialog = ({ open, onClose, getLabelList }) => {
  const mdUp = useMediaQuery((theme) => theme.breakpoints.up('md'));

  const [selectedLabel, setSelectedLabel] = useState(null);
  const [openLabelFormDialog, setOpenLabelFormDialog] = useState(false);
  const [openDeleteLabelDialog, setOpenDeleteLabelDialog] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [query, setQuery] = useState();
  const q = useDebounce(query, 300);

  const [labels, setLabels] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadLabels = async () => {
    try {
      setIsLoading(true);
      const res = await complianceApi.getComplianceAiLabels();
      setLabels(res?.labels ?? []);
      await getLabelList();
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      loadLabels();
    }
  }, [open]);

  const filtered = labels.filter(l => !q || l?.name?.toLowerCase()?.includes(q.toLowerCase()));
  const paged = filtered.slice(currentPage * perPage, (currentPage * perPage) + perPage);

  const basicColumns = [
    {
      id: 'label',
      header: 'Label',
      render: (label) => (
        <Stack direction="row" alignItems="center" spacing={1}>
          <Chip
            label={label.name}
            size="small"
            sx={{
              backgroundColor: label.color,
              color: '#fff',
              '& .MuiChip-label': {
                color: '#fff',
                fontWeight: 500
              }
            }}
          />
        </Stack>
      )
    },
    {
      id: 'description',
      header: 'Description',
      render: (label) => (
        <Typography 
          variant="body2" 
          color={label.description ? 'text.primary' : 'text.secondary'}
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            width: { xs: 110, md: 250 },
            maxWidth: { xs: 110, md: 250 },
          }}
        >
          {label.description || 'No description'}
        </Typography>
      )
    },
    {
      id: 'actions',
      header: 'Actions',
      render: (label, { handleManageLabel }) => (
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <Tooltip title="Edit">
            <IconButton
              sx={{ color: 'primary.main', '&:hover': { backgroundColor: 'action.hover' }}}
              onClick={() => handleManageLabel(label)}
              size="small"
            >
              <Iconify icon="mage:edit" width={22}/>
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              sx={{ color: 'error.dark', '&:hover': { backgroundColor: 'action.hover' }}}
              onClick={() => handleManageLabel(label, 'delete')}
              size="small"
            >
              <Iconify icon="heroicons:trash" width={22}/>
            </IconButton>
          </Tooltip>
        </Stack>
      )
    }
  ];

  const handleDeleteLabel = async () => {
    try {
      setIsDeleteLoading(true);
      await complianceApi.deleteComplianceAiLabel(selectedLabel?.id);
      setTimeout(async () => {
        await loadLabels();
      }, 500);
      toast.success("AI label successfully deleted!");
    } catch (error) {
      toast.error(error?.response?.data?.message ??  error?.message ??  "Failed to delete label");
    } finally {
      setOpenDeleteLabelDialog(false);
      setSelectedLabel(null);
      setTimeout(() => {
        setIsDeleteLoading(false);
      }, 500);
    }
  };

  const handleManageLabel = (label, target ='edit') => {
    setSelectedLabel(label);
    if (target === 'edit') {
      setOpenLabelFormDialog(true);
    } else if (target === 'delete') {
      setOpenDeleteLabelDialog(true);
    }
  };

  const handleCloseLabelDialog = () => {
    onClose();
    setCurrentPage(0);
    setQuery('');
  };

  return (
    <>
      <Dialog 
        open={open} 
        onClose={handleCloseLabelDialog} 
        fullWidth
        fullScreen={!mdUp}
        maxWidth="sm"
      >
        <Stack sx={{ position: 'relative', px: { xs: 0, md: 2 } }}>
          <IconButton 
            onClick={handleCloseLabelDialog} 
            sx={{ 
              display: { xs: 'flex', md: 'none' },
              position: 'absolute',
              right: 10,
              top: 10,
              color: 'text.primary'
            }}>
            <Iconify icon="mingcute:close-line" width={20} height={20} />
          </IconButton>
          <Stack
            sx={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: { xs: 'start', md: 'space-between' },
              gap: 1.5,
              pt: 3,
              pb: 1,
              px: { xs: 2, md: 1 }
            }}
          >
            <Typography variant="h5">AI Labels</Typography>
            <Button
              onClick={()=>{
                setSelectedLabel(null);
                setOpenLabelFormDialog(true);
              }}
              startIcon={
                <Iconify icon="lucide:plus" width={18} />
              }
              variant="contained"
              size="small"
              sx={{ display: { xs: 'none', md: 'flex' } }}
            >
              Add Label
            </Button>
            <IconButton
              onClick={()=>{
                setSelectedLabel(null);
                setOpenLabelFormDialog(true);
              }}
              sx={{
                p: 0,
                color: 'inherit',
                bgcolor: 'primary.main',
                borderRadius: 1,
                '&:hover': {
                  color: 'inherit',
                  bgcolor: 'primary.main',
                },
                display: { xs: 'flex', md: 'none' }
              }}
            >
              <Iconify icon="lucide:plus" width={24} sx={{ p: 0.1 }}/>
            </IconButton>
          </Stack>
          <Card>
            <Stack
              alignItems="center"
              direction="row"
              spacing={2}
              sx={{ px: 2, py: 1 }}
            >
              <Iconify icon="lucide:search" width={20} />
              <Box sx={{ flexGrow: 1 }}>
                <Input
                  value={query}
                  onChange={(event) => setQuery(event?.target?.value)}
                  disableUnderline
                  fullWidth
                  placeholder="Enter a keyword"
                />
              </Box>
            </Stack>
          </Card>
          <Scrollbar sx={{ maxHeight: { xs: 'calc(100vh - 155px)', md: 'calc(100vh - 360px)'} }}>
            <Table fullWidth sx={{ position: 'relative' }}>
              <TableHead sx={{ position: 'sticky', top: 0, backgroundColor: 'background.paper' }}>
                <TableRow>
                  {basicColumns.map((column) => (
                    <TableCell key={column.id} sx={{ whiteSpace: 'nowrap', width: column.width }}>
                      {column.header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {paged?.map((label) => (
                  <TableRow key={label.id}>
                    {basicColumns.map((column) => (
                      <TableCell key={column.id}>
                        {column.render(label, { handleManageLabel })}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {paged?.length === 0 && !isLoading && (
              <TableNoData isSmall label="No labels found"/>
            )}
          </Scrollbar>
          <TablePagination
            component="div"
            count={filtered?.length || 0}
            labelRowsPerPage="Per page"
            onPageChange={(event, newPage) => setCurrentPage(newPage)}
            onRowsPerPageChange={(event) => {
              setPerPage(parseInt(event.target.value, 10));
              setCurrentPage(0);
            }}
            page={currentPage}
            rowsPerPage={perPage}
            rowsPerPageOptions={[5, 10]}
            sx={{ 
              position: { xs: 'fixed', md: 'relative' }, 
              bottom: 0, 
              backgroundColor: 'background.paper',
              display: 'flex',
              justifyContent: { xs: 'center', md: 'flex-end' },
              width: 1,
              borderTop: '1px solid',
              borderColor: 'divider',
            }}
          />
        </Stack>
      </Dialog>

      <ComplianceLabelFormDialog
        open={openLabelFormDialog}
        onClose={() => {
          setOpenLabelFormDialog(false);
          setSelectedLabel(null);
        }}
        label={selectedLabel}
        mutate={loadLabels}
      />

      <ConfirmDialog
        open={openDeleteLabelDialog}
        onClose={() => {
          setOpenDeleteLabelDialog(false);
          setSelectedLabel(null);
        }} 
        title="Delete AI Label"
        description="Are you sure want to delete this label? This action cannot be undone."
        confirmAction={handleDeleteLabel}
        isLoading={isDeleteLoading}
      />
    </>
  );
};


