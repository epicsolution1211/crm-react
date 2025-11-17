import { useEffect, useState } from "react";
import * as yup from "yup";
import { HexColorPicker } from "react-colorful";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import LoadingButton from "@mui/lab/LoadingButton";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from '@mui/material/styles';

import { ConfirmDialog } from "src/components/confirm-dialog-2";
import { Iconify } from "src/components/iconify";
import { Scrollbar } from "src/components/scrollbar";
import { TableNoData } from "src/components/table-empty";
import { TableSkeleton } from 'src/components/table-skeleton';
import { todoApi } from "src/api/todo";
import { useDebounce } from "src/hooks/use-debounce";
import { useGetTodoLabels } from "src/hooks/swr/use-todo";

const validationSchema = yup.object({
  name: yup.string().required("Name is required"),
});

const TodoLabelFormDialog = ({ open, onClose, label, mutate }) => {
  const theme = useTheme();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch
  } = useForm({ resolver: yupResolver(validationSchema), defaultValues: {
    name: '',
    color: theme.palette.primary.main,
    description: ''
  } });

  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const colorValue = watch('color');

  const onSubmit = async (data) => {
    try {
      if (label) {
        await todoApi.updateTodoLabel(label?.id, data);
        toast.success("Todo label successfully updated!");
      } else {
        await todoApi.createTodoLabel(data)
        toast.success("Todo label successfully created!");
      }
      await mutate();
    } catch (error) {
      toast.error(error?.response?.data?.message ??  error?.message ??  "Failed to save label");
    } finally {
      handleClose();
    }
  };

  const handleClose = () => {
    onClose();
    setColorPickerOpen(false);
    setTimeout(() => {
      reset({
        name: '',
        color: theme.palette.primary.main,
        description: ''
      });
    }, 500);
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
      maxWidth="sm"
    >
      <DialogTitle sx={{ mt: 0.5 }}>{label ? "Edit Todo Label" : "Create Todo Label"}</DialogTitle>
      <DialogContent>
        <Stack pt={0.5} gap={2}>
          <TextField
            {...register('name')}
            label="Label Name"
            fullWidth
            error={!!errors.name}
            helperText={errors.name?.message}
            size="small"
            InputLabelProps={{
              shrink: true,
            }}
          />
          
          <Box>
            <Stack direction="row" spacing={2} alignItems="center">
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  backgroundColor: colorValue || theme.palette.primary.main,
                  border: '2px solid',
                  borderColor: 'grey.300',
                  cursor: 'pointer',
                  '&:hover': {
                    borderColor: 'grey.400'
                  }
                }}
                onClick={() => setColorPickerOpen(!colorPickerOpen)}
              />
              <TextField
                {...register('color')}
                label="Hex Color"
                size="small"
                error={!!errors.color}
                helperText={errors.color?.message}
                placeholder="e.g. #1976d2"
                sx={{ flexGrow: 1 }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Stack>
            {colorPickerOpen && (
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', '& .react-colorful': { width: '100%', height: 180 } }}>
                <HexColorPicker
                  color={colorValue || theme.palette.primary.main}
                  onChange={(color) => setValue('color', color)}
                />
              </Box>
            )}
          </Box>
          
          <TextField
            {...register('description')}
            label="Description"
            fullWidth
            multiline
            rows={3}
            InputLabelProps={{
              shrink: true,
            }}  
          />
        </Stack>
        
        <Stack direction="row" spacing={1.5} sx={{ mt: 2, justifyContent: 'flex-end' }}>
          <LoadingButton
            onClick={handleSubmit(onSubmit)}
            variant="contained"
            loading={isSubmitting}
            disabled={isSubmitting}
            size="small"
          >
            {label ? 'Update' : 'Create'}
          </LoadingButton>
          <Button
            onClick={handleClose}
            variant="outlined"
            size="small"
          >
            Cancel
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export const TodoLabelsDialog = ({ open, onClose }) => {
  const mdUp = useMediaQuery((theme) => theme.breakpoints.up('md'));

  const [selectedLabel, setSelectedLabel] = useState(null);
  const [openLabelFormDialog, setOpenLabelFormDialog] = useState(false);
  const [openDeleteLabelDialog, setOpenDeleteLabelDialog] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [query, setQuery] = useState();
  const q = useDebounce(query, 300);

  const { labels: labelData, totalCount, mutate, isLoading } = useGetTodoLabels({
    page: currentPage + 1,
    per_page: perPage,
    q: q ? q : "*"
  });

  const DEFAULT_COLUMN = [
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
      await todoApi.deleteTodoLabel(selectedLabel?.id);
      await mutate();
      toast.success("Todo label successfully deleted!");
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
      >
        <Container maxWidth="md" sx={{ position: 'relative', px: { xs: 0, md: 2 } }}>
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
            <Typography variant="h5">Task Labels</Typography>
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
                  {DEFAULT_COLUMN.map((column) => (
                    <TableCell key={column.id} sx={{ whiteSpace: 'nowrap' }}>
                      {column.header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableSkeleton rowCount={5} cellCount={3}/>
                ) : (
                  labelData?.map((label) => (
                    <TableRow key={label.id}>
                      {DEFAULT_COLUMN.map((column) => (
                        <TableCell key={column.id}>
                          {column.render(label, { handleManageLabel })}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            {labelData?.length === 0 && !isLoading && (
              <TableNoData isSmall label="No labels found"/>
            )}
          </Scrollbar>
          <TablePagination
            component="div"
            count={totalCount || 0}
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
        </Container>
      </Dialog>

      {openLabelFormDialog && (
        <TodoLabelFormDialog
          open={openLabelFormDialog}
          onClose={() => {
            setOpenLabelFormDialog(false);
            setTimeout(() => {
              setSelectedLabel(null);
            }, 500);
          }}
          label={selectedLabel}
          mutate={mutate}
        />
      )}

      {openDeleteLabelDialog && (
        <ConfirmDialog
          open={openDeleteLabelDialog}
          onClose={() => {
            setOpenDeleteLabelDialog(false);
            setSelectedLabel(null);
          }} 
          title="Delete Todo Label"
          description="Are you sure want to delete this label? This action cannot be undone."
          confirmAction={handleDeleteLabel}
          isLoading={isDeleteLoading}
        />
      )}
    </>
  );
};
