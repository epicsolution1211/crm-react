import PropTypes from "prop-types";
import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Box from "@mui/material/Box";
import LoadingButton from "@mui/lab/LoadingButton";
import { Iconify } from 'src/components/iconify';
import CircularProgress from '@mui/material/CircularProgress';
import { metabaseApi } from 'src/api/metabase';
import toast from "react-hot-toast";

const CREATE_QUERY_OPTIONS = [
  { value: "no", label: "No query access", icon: "ic:round-close", iconColor: "#e53935" },
  { value: "query-builder", label: "Metabase GUI only", icon: "material-symbols:build-circle-outline", iconColor: "#fbc02d" },
];

function toTitleCase(str) {
  return str
    .replace(/_/g, " ")
    .replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

export const MetabaseGroupPermissionsDialog = ({ open, onClose, group, isLoading, onUpdateCreateQueries }) => {
  const tablePermissions = group?.report?.table_permissions || {};
  const [enableLoading, setEnableLoading] = useState(false);
  const [disableLoading, setDisableLoading] = useState(false);

  const handleEnableAll = async () => {
    setEnableLoading(true);
    try {
      await metabaseApi.updateMetabaseGroup(group.report.id, { enable_all: true });
      if (onUpdateCreateQueries) {
        onUpdateCreateQueries();
      }
    } catch (error) {
      console.error('Error enabling all permissions:', error);
      toast.error(error?.message ?? 'Error disabling all permissions');
    } finally {
      setEnableLoading(false);
    }
  };

  const handleDisableAll = async () => {
    setDisableLoading(true);
    try {
      await metabaseApi.updateMetabaseGroup(group.report.id, { disable_all: true });
      if (onUpdateCreateQueries) {
        onUpdateCreateQueries();
      }
    } catch (error) {
      console.error('Error disabling all permissions:', error);
      toast.error(error?.message ?? 'Error disabling all permissions');
    } finally {
      setDisableLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          p: 0,
          maxWidth: 700,
          mt: 8,
          mb: 4,
          maxHeight: '80vh',
          overflow: 'auto',
        }
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', pr: 5 }}>
        <Typography variant="h6" sx={{ flex: 1 }}>
          Group Table Permissions
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 16, top: 16 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 3, minHeight: 200 }}>
        {isLoading || !group ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Typography variant="h5" gutterBottom>
              {group?.report?.name || "Group"}
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1, mb: 3, justifyContent: 'flex-end' }}>
              <LoadingButton
                variant="contained"
                color="primary"
                onClick={handleEnableAll}
                startIcon={<Iconify icon="material-symbols:check-circle-outline" />}
                size="small"
                loading={enableLoading}
                sx={{ 
                  minWidth: 100,
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  py: 0.75,
                  px: 1.5
                }}
              >
                Enable All
              </LoadingButton>
              <LoadingButton
                variant="outlined"
                color="error"
                onClick={handleDisableAll}
                startIcon={<Iconify icon="material-symbols:block" />}
                size="small"
                loading={disableLoading}
                sx={{ 
                  minWidth: 100,
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  py: 0.75,
                  px: 1.5
                }}
              >
                Disable All
              </LoadingButton>
            </Box>

            <Box sx={{ overflowX: 'auto' }}>
              <Table sx={{ minWidth: 400 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Table Name</TableCell>
                    <TableCell>Create Queries</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(tablePermissions).map(([tableName, perms]) => (
                    <TableRow key={tableName}>
                      <TableCell>{toTitleCase(tableName)}</TableCell>
                      <TableCell>
                        <Select
                          value={perms["create-queries"] === null ? "no" : perms["create-queries"] ?? ""}
                          displayEmpty
                          sx={{ minWidth: 180 }}
                          inputProps={{ 'aria-label': `Create queries for ${toTitleCase(tableName)}` }}
                          onChange={e => {
                            const selectedValue = e.target.value;
                            if (onUpdateCreateQueries) {
                              onUpdateCreateQueries(tableName, selectedValue);
                            }
                          }}
                        >
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          {CREATE_QUERY_OPTIONS.map((option) => (
                            <MenuItem
                              key={option.value}
                              value={option.value}
                              sx={{
                                minHeight: 36,
                                py: 0.5,
                              }}
                            >
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Iconify icon={option.icon} sx={{ color: option.iconColor, mr: 1, fontSize: 18, display: 'flex', alignItems: 'center' }} />
                                <Typography variant="body2" sx={{ lineHeight: 1 }}>
                                  {option.label}
                                </Typography>
                              </Box>
                            </MenuItem>
                          ))}
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

MetabaseGroupPermissionsDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  group: PropTypes.object,
  isLoading: PropTypes.bool,
  onUpdateCreateQueries: PropTypes.func,
}; 