import { memo } from "react";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";
import toast from "react-hot-toast";

import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from "@mui/material/Divider";
import Grid from "@mui/system/Unstable_Grid/Grid";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Link from "@mui/material/Link";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import CustomModal from "src/components/customize/custom-modal";
import { Iconify } from 'src/components/iconify';
import { customerFieldsApi } from "src/api/customer-fields";
import { haveDuplicates } from "src/utils/array-duplicates";
import { paths } from "src/paths";
import { roleTemplateDefault } from "./constants";
import { settingsApi } from "src/api/settings";
import { useAuth } from "src/hooks/use-auth";
import { RoleTemplateAISummary } from "./role-template-ai-summary";

const TreeView = memo(({ templates, onItemSelect, selectedItem, searchQuery, debouncedSearchQuery, onSearchChange }) => {
  
  const handleItemClick = useCallback((item) => {
    onItemSelect(item);
  }, [onItemSelect]);

  const handleSearchChange = useCallback((event) => {
    onSearchChange(event.target.value);
  }, [onSearchChange]);

  const handleClearSearch = useCallback(() => {
    onSearchChange("");
  }, [onSearchChange]);

  const filteredTemplates = useMemo(() => {
    return templates.filter(template => {
      if (!debouncedSearchQuery) return true;
      
      const query = debouncedSearchQuery.toLowerCase();
      
      if (template?.name?.toLowerCase().includes(query)) return true;
      
      return false;
    });
  }, [templates, debouncedSearchQuery]);

  const highlightText = useCallback((text, query) => {
    if (!query) return text;
    
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return (
      <span>
        {parts.map((part, index) => 
          part.toLowerCase() === query.toLowerCase() ? (
            <mark key={index} style={{ backgroundColor: '#ffeb3b', padding: '0 2px' }}>
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </span>
    );
  }, []);

  return (
    <Paper sx={{ height: 1, minHeight: "100vh", overflow: 'auto' }}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" mb={3} mt={2}>
          Role Permissions
        </Typography>
        
        <TextField
          fullWidth
          placeholder="Search permissions..."
          value={searchQuery}
          onChange={handleSearchChange}
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" width={20} />
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={handleClearSearch}
                  sx={{ p: 0.5 }}
                >
                  <Iconify icon="eva:close-fill" width={16} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {searchQuery && searchQuery !== debouncedSearchQuery && (
          <Typography variant="caption" color="text.secondary" sx={{ my: 1, px: 1, display: 'block' }}>
            Searching...
          </Typography>
        )}
        {debouncedSearchQuery && searchQuery === debouncedSearchQuery && (
          <Typography variant="caption" color="text.secondary" sx={{ my: 1, px: 1, display: 'block' }}>
            {filteredTemplates.length} result{filteredTemplates.length !== 1 ? 's' : ''} found
          </Typography>
        )}

        <List component="nav" dense>
          {filteredTemplates.length === 0 ? (
            <ListItem>
              <ListItemText 
                primary="No results found"
                primaryTypographyProps={{ 
                  variant: 'body2', 
                  color: 'text.secondary',
                  textAlign: 'center' 
                }}
              />
            </ListItem>
          ) : (
            filteredTemplates.map((template, index) => (
              <ListItem key={template.name + index} disablePadding>
                <ListItemButton
                  selected={selectedItem?.name === template?.name}
                  onClick={() => handleItemClick(template)}
                  sx={{
                    pl: 2,
                    '&.Mui-selected': {
                      backgroundColor: 'primary',
                      color: selectedItem?.name === template?.name ? 'primary.main' : 'text.secondary',
                    }
                  }}
                >
                  <ListItemIcon>
                    <Iconify 
                      icon={"fluent:shield-32-filled"} 
                      color={selectedItem?.name === template?.name ? 'primary.main' : 'text.secondary'}
                      width={20} 
                    />
                  </ListItemIcon>
                  <ListItemText 
                    primary={highlightText(template.name, debouncedSearchQuery)}
                    primaryTypographyProps={{ variant: 'body2', fontWeight: 'medium' }}
                  />
                </ListItemButton>
              </ListItem>
            ))
          )}
        </List>
      </Box>
    </Paper>
      );
  });
  
const DetailView = memo(({ selectedItem, shieldAccess, user, onChangeValue, onChangeShieldValue, onEnableAccess, onOpenRemoveAccessDialog }) => {
  const [childSearchQuery, setChildSearchQuery] = useState("");

  const filteredChildren = useMemo(() => {
    return selectedItem?.items?.filter(childItem => {
      if (!childSearchQuery) return true;
      
      const query = childSearchQuery.toLowerCase();
      return childItem?.name?.toLowerCase().includes(query);
    });
  }, [selectedItem?.items, childSearchQuery]);

  const highlightChildText = useCallback((text, query) => {
    if (!query) return text;
    
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return (
      <span>
        {parts.map((part, index) => 
          part.toLowerCase() === query.toLowerCase() ? (
            <mark key={index} style={{ backgroundColor: '#ffeb3b', padding: '0 2px' }}>
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </span>
    );
  }, []);

  const handleShieldChange = useCallback((param, value) => {
    onChangeShieldValue(param, value);
  }, [onChangeShieldValue]);

  useEffect(() => {
    setChildSearchQuery("");
  }, [selectedItem]);

  if (!selectedItem) {
    return (
      <Paper sx={{ height: 1, minHeight: "100vh", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ textAlign: 'center', p: 4 }}>
          <Iconify icon="tabler:click" width={64} sx={{ color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Select an item from the tree to view details
          </Typography>
        </Box>
      </Paper>
    );
  }

  const param = selectedItem?.view
                ? selectedItem?.view.param
                : selectedItem?.edit
                ? selectedItem?.edit.param
                : selectedItem?.hide.param;
  const shield = shieldAccess?.[param];
  const isUnderShield = shield !== undefined && shield === true;

  return (
    <Paper sx={{ height: 1, overflow: 'auto' }}>
      <Box sx={{ p: 3 }}>
        <Stack spacing={3}>
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            justifyContent="space-between"
            spacing={2}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="h6">
                  {selectedItem?.name}
                </Typography>
                <Tooltip
                  arrow
                  title={selectedItem?.info || "No information"}
                  placement="bottom"
                  componentsProps={{
                    tooltip: {
                      sx: {
                        bgcolor: 'primary.main',
                        '& .MuiTooltip-arrow': {
                          color: 'primary.main',
                        },
                      },
                    },
                  }}
                >
                  <Iconify icon="eva:info-outline" width={22} sx={{ cursor: 'pointer', color: '#2993f0', ml: 1 }} />
                </Tooltip>
              </Box>
            </Stack>

            <Stack 
              direction="row"
              width={{ xs: 1, sm: 'auto' }}
              spacing={2}
            >
              <Button
                fullWidth
                color="error"
                variant="outlined"
                onClick={onOpenRemoveAccessDialog}
                startIcon={<Iconify icon="mdi:shield-off" sx={{ width: 20 }} />}
                size="small"
                sx={{whiteSpace: "nowrap"}}
              >
                <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                  Remove Access
                </Box>
                <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                  Remove
                </Box>
              </Button>
              <Button 
                fullWidth
                variant="outlined" 
                onClick={() => onEnableAccess(selectedItem)}
                startIcon={<Iconify icon="mdi:shield-check" sx={{ width: 20 }} />}
                size="small"
                sx={{whiteSpace: "nowrap"}}
              >
                <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                  Enable Access
                </Box>
                <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                  Enable
                </Box>
              </Button>
            </Stack>
          </Stack>

          {selectedItem?.description && (
            <Typography variant="body2" color="text.secondary">
              {selectedItem?.description}
            </Typography>
          )}

          <Divider />

          <Stack spacing={2}>
            <Typography variant="subtitle1">Permissions</Typography>
            
            {selectedItem?.view && (
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Stack direction="row" alignItems="center" spacing={2}>
                  <IconButton
                    onClick={() => handleShieldChange(param, !isUnderShield)}
                    disabled={!user?.super_admin}
                  >
                    <Iconify icon="mdi:administrator" width={24} color={isUnderShield ? '#2993f0' : 'text.secondary'} />
                  </IconButton>
                  <Stack direction="column">
                    <Typography variant="body2" fontWeight="medium">
                      View Access
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {selectedItem?.view?.description}
                    </Typography>
                  </Stack>
                </Stack>
                <Stack direction="row" alignItems="center" gap={1}>
                  <Tooltip 
                    arrow
                    title="It hides number (data) from field completely."
                    componentsProps={{
                      tooltip: {
                        sx: {
                          bgcolor: 'primary.main',
                          '& .MuiTooltip-arrow': {
                            color: 'primary.main',
                          },
                        },
                      },
                    }}
                  >
                    <Iconify icon="fluent:eye-32-filled" width={24} sx={{ color: 'text.secondary', cursor: 'pointer' }} />
                  </Tooltip>
                  <Switch
                    disabled={
                      !user?.super_admin &&
                      shieldAccess?.[selectedItem?.view?.param] !==
                        undefined &&
                      shieldAccess?.[selectedItem?.view?.param] === true
                    }
                    checked={selectedItem?.view?.value}
                    onChange={(e) => onChangeValue(e, selectedItem?.name, null, 'view')}
                    color="primary"
                  />
                </Stack>
              </Stack>
            )}

            {selectedItem?.edit && (
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Stack direction="row" alignItems="center" spacing={2}>
                  <IconButton
                    onClick={() => handleShieldChange(param, !isUnderShield)}
                    disabled={!user?.super_admin}
                  >
                    <Iconify icon="mdi:administrator" width={24} color={isUnderShield ? '#2993f0' : 'text.secondary'} />
                  </IconButton>
                  <Stack direction="column">
                    <Typography variant="body2" fontWeight="medium">
                      Edit Access
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {selectedItem?.edit?.description}
                    </Typography>
                  </Stack>
                </Stack>
                <Stack direction="row" alignItems="center" gap={1}>
                  <Tooltip 
                    arrow
                    title="Enable/disables the edit (create and delete) option."
                    componentsProps={{
                      tooltip: {
                        sx: {
                          bgcolor: 'primary.main',
                          '& .MuiTooltip-arrow': {
                            color: 'primary.main',
                          },
                        },
                      },
                    }}
                  >
                    <Iconify icon="grommet-icons:edit" width={24} sx={{ color: 'text.secondary', cursor: 'pointer' }} />
                  </Tooltip>
                  <Switch
                    disabled={!user?.super_admin && isUnderShield}
                    checked={selectedItem?.edit?.value}
                    onChange={(e) => onChangeValue(e, selectedItem?.name, null, 'edit')}
                    color="primary"
                  />
                </Stack>
              </Stack>
            )}
          </Stack>

          {selectedItem?.items && selectedItem?.items.length > 0 && (
            <>
              <Divider />
              <Stack direction="column">

                <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
                  <Typography variant="subtitle1">Child Permissions</Typography>
                </Stack>

                {/* TODO: Add search input without auto-reset and jumpling issue */}
                {/* <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Search child permissions..."
                  value={childSearchQuery}
                  onChange={(e) => setChildSearchQuery(e.target.value)}
                  sx={{ mb: 1 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Iconify icon="eva:search-fill" width={16} />
                      </InputAdornment>
                    ),
                    endAdornment: childSearchQuery && (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => setChildSearchQuery("")}
                          sx={{ p: 0.5 }}
                        >
                          <Iconify icon="eva:close-fill" width={14} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                /> */}

                {childSearchQuery && (
                  <Typography variant="caption" color="text.secondary">
                    {filteredChildren?.length} child result{filteredChildren?.length !== 1 ? 's' : ''} found
                  </Typography>
                )}
                
                <List dense>
                  {filteredChildren?.length === 0 ? (
                    <ListItem>
                      <ListItemText 
                        primary="No child permissions found"
                        primaryTypographyProps={{ 
                          variant: 'body2', 
                          color: 'text.secondary',
                          textAlign: 'center' 
                        }}
                      />
                    </ListItem>
                  ) : (
                    filteredChildren?.map((childItem, index) => {
                      const childParam = childItem.view ? childItem.view.param : childItem.edit ? childItem.edit.param : childItem.hide?.param;
                      const childShield = shieldAccess?.[childParam];
                      const isChildUnderShield = childShield !== undefined && childShield === true;

                      const isFirstCustomData = (childItem?.key === 'custom_filed_edit' || childItem?.key === 'custom_filed_bulk_edit') && 
                        !(filteredChildren[index-1]?.key === 'custom_filed_edit' || filteredChildren[index-1]?.key === 'custom_filed_bulk_edit');

                      return (
                        <>
                          {isFirstCustomData && (
                            <Box sx={{ position: "relative" }}>
                              <Divider sx={{ my: 3 }} />
                              <Typography variant="subtitle1" sx={{ position: "absolute", backgroundColor: "background.paper", color: "text.primary", borderRadius: 1, px: 3, top: -12, left: "50%", transform: "translateX(-50%)", textAlign: 'center', whiteSpace: 'nowrap' }}>Custom Data</Typography>
                            </Box>
                          )}
                          <ListItem 
                            key={childItem.name + index}
                            sx={{
                              pl: childItem?.option ? 4 : childItem?.name?.includes("Custom Data") ? 1 : 1,
                              borderRadius: 1,
                              '&:hover': {
                                backgroundColor: 'action.hover',
                              },
                              pb: {xs: 0, sm: 0},
                              mb: {xs: 1, sm: 0}
                            }}
                          >
                            <Stack 
                              direction={{ xs: 'column', sm: 'row' }} 
                              alignItems={{ xs: 'flex-start', sm: 'center' }}
                              spacing={{ xs: 1, sm: 2 }}
                              sx={{ 
                                width: 1,
                                justifyContent: "space-between"
                              }}
                            >
                              <Stack 
                                direction="row" 
                                alignItems="center"
                                sx={{
                                  width: { xs: '100%', sm: 'auto' }
                                }}
                              >
                                <ListItemIcon>
                                  <IconButton
                                    onClick={() => handleShieldChange(childParam, !isChildUnderShield)}
                                    disabled={!user?.super_admin}
                                    sx={{
                                      p: 1
                                    }}
                                  >
                                    <Iconify icon="mdi:administrator" width={20} color={isChildUnderShield ? '#2993f0' : 'text.secondary'} />
                                  </IconButton>
                                </ListItemIcon>
                                <ListItemText 
                                  primary={highlightChildText(childItem?.name, childSearchQuery)}
                                  primaryTypographyProps={{ 
                                    variant: 'body2',
                                    sx: {
                                      fontSize: { xs: '0.875rem', sm: 'inherit' }
                                    }
                                  }}
                                />
                                <Box>

                                <Tooltip 
                                  arrow
                                  title={childItem?.info}
                                  componentsProps={{
                                    tooltip: {
                                      sx: {
                                        bgcolor: 'primary.main',
                                        '& .MuiTooltip-arrow': {
                                          color: 'primary.main',
                                        },
                                      },
                                    },
                                  }}
                                >
                                  <Iconify icon="eva:info-outline" width={{xs: 20, sm: 22}} sx={{ cursor: 'pointer', color: '#2993f0', ml: 1 }} />
                                </Tooltip>
                                </Box>
                              </Stack>

                              <Stack 
                                direction={{ xs: 'row', sm: 'row' }} 
                                alignItems="center" 
                                spacing={{ xs: 1, sm: 3 }}
                                sx={{
                                  width: { xs: '100%', sm: 'auto' },
                                  justifyContent: { xs: 'flex-end', sm: 'space-between' },
                                  mt: { xs: 0.5, sm: 0 },
                                  pb: { xs: 1.5, sm: 0 },
                                  borderBottom: {xs: '1px dashed', sm: 'none'},
                                  borderColor: {xs: 'divider', sm: 'transparent'}
                                }}
                              >
                                {childItem?.hide && (
                                  <Stack direction="row" alignItems="center" spacing={1}>
                                    <Tooltip 
                                      arrow
                                      title="It hides the number (data) from field and shows only after clicking on eye."
                                      componentsProps={{
                                        tooltip: {
                                          sx: {
                                            bgcolor: 'primary.main',
                                            '& .MuiTooltip-arrow': {
                                              color: 'primary.main',
                                            },
                                          },
                                        },
                                      }}
                                    >
                                      <Iconify icon="f7:staroflife" width={20} sx={{ color: 'text.secondary', cursor: 'pointer' }} />
                                    </Tooltip>
                                    <Tooltip 
                                      arrow
                                      title={childItem?.hide?.value ? childItem?.hide?.description : ""}
                                      componentsProps={{
                                        tooltip: {
                                          sx: {
                                            bgcolor: 'primary.main',
                                            '& .MuiTooltip-arrow': {
                                              color: 'primary.main',
                                            },
                                          },
                                        },
                                      }}
                                    >
                                      <Switch
                                        size="small"
                                        disabled={!user?.super_admin && isChildUnderShield}
                                        checked={childItem?.hide?.value}
                                        onChange={(e) => onChangeValue(e, selectedItem?.name, childItem?.name,'hide')}
                                        color="primary"
                                      />
                                    </Tooltip>
                                  </Stack>
                                )}
                                
                                {childItem?.view && (
                                  <Stack direction="row" alignItems="center" spacing={1}>
                                    <Tooltip 
                                      arrow
                                      title="It hides number (data) from field completely."
                                      componentsProps={{
                                        tooltip: {
                                          sx: {
                                            bgcolor: 'primary.main',
                                            '& .MuiTooltip-arrow': {
                                              color: 'primary.main',
                                            },
                                          },
                                        },
                                      }}
                                    >
                                      <Iconify icon="fluent:eye-32-filled" width={20} sx={{ color: 'text.secondary', cursor: 'pointer' }} />
                                    </Tooltip>
                                    <Tooltip 
                                      arrow
                                      title={childItem?.view?.value ? childItem?.view?.description : ""}
                                      componentsProps={{
                                        tooltip: {
                                          sx: {
                                            bgcolor: 'primary.main',
                                            '& .MuiTooltip-arrow': {
                                              color: 'primary.main',
                                            },
                                          },
                                        },
                                      }}
                                    >
                                      <Switch
                                        size="small"
                                        disabled={!user?.super_admin && isChildUnderShield}
                                        checked={childItem?.view?.value}
                                        onChange={(e) => onChangeValue(e, selectedItem?.name, childItem?.name, 'view')}
                                        color="primary"
                                      />
                                    </Tooltip>
                                  </Stack>
                                )}

                                {childItem?.edit && (
                                  <Stack direction="row" alignItems="center" spacing={1}>
                                    <Tooltip 
                                      arrow
                                      title="Enable/disables the edit (create and delete) option."
                                      componentsProps={{
                                        tooltip: {
                                          sx: {
                                            bgcolor: 'primary.main',
                                            '& .MuiTooltip-arrow': {
                                              color: 'primary.main',
                                            },
                                          },
                                        },
                                      }}
                                    >
                                      <Iconify icon="grommet-icons:edit" width={20} sx={{ color: 'text.secondary', cursor: 'pointer' }} />
                                    </Tooltip>
                                    <Tooltip 
                                      arrow
                                      title={childItem?.edit?.value ? childItem?.edit?.description : ""}
                                      componentsProps={{
                                        tooltip: {
                                          sx: {
                                            bgcolor: 'primary.main',
                                            '& .MuiTooltip-arrow': {
                                              color: 'primary.main',
                                            },
                                          },
                                        },
                                      }}
                                    >
                                      <Switch
                                        size="small"
                                        disabled={!user?.super_admin && isChildUnderShield}
                                        checked={childItem?.edit?.value}
                                        onChange={(e) => onChangeValue(e, selectedItem?.name, childItem?.name, 'edit')}
                                        color="primary"
                                      />
                                    </Tooltip>
                                  </Stack>
                                )}
                              </Stack>
                            </Stack>
                          </ListItem>
                        </>
                      );
                    })
                  )}
                </List>
              </Stack>
            </>
          )}
        </Stack>
      </Box>
    </Paper>
    );
  });
  
export const RoleEdit = (props) => {
  const { company, user } = useAuth();
  const [roleTemplate, setRoleTemplate] = useState([]);
  const [shieldAccess, setShieldAccess] = useState(null);
  const [isEdited, setIsEdited] = useState(false);
  const [openEditName, setOpenEditName] = useState(false);
  const [openRemoveAllAccessDialog, setOpenRemoveAllAccessDialog] = useState(false);
  const [openRemoveAccessDialog, setOpenRemoveAccessDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const history = useNavigate();
  const location = useLocation();
  const { register, handleSubmit, setValue, reset } = useForm();

  const handleDefaultSet = (initializedTemplates = []) => {
    const templateWithShield = initializedTemplates?.map((temp) => {
      if (temp.view) {
        const possibleViewShield = shieldAccess?.[temp?.view?.param];

        if (temp?.items && temp?.items?.length) {
          const itemsWithValues = temp?.items?.map((item) => {
            if (item.view && item.edit && item.hide) {
              const possibleItemViewShield = shieldAccess?.[item?.view?.param];

              return {
                ...item,
                view: {
                  param: item?.view?.param,
                  description: item?.view?.description,
                  value: possibleItemViewShield ? false : item?.view?.value,
                },
                edit: {
                  param: item?.edit?.param,
                  description: item?.edit?.description,
                  value: possibleItemViewShield ? false : item?.edit?.value,
                },
                hide: {
                  param: item?.hide?.param,
                  description: item?.hide?.description,
                  value: possibleItemViewShield ? false : item?.hide?.value,
                },
              };
            }

            if (item.view && item.edit) {
              const possibleItemViewShield = shieldAccess?.[item?.view?.param];

              return {
                ...item,
                view: {
                  param: item?.view?.param,
                  description: item?.view?.description,
                  value: possibleItemViewShield ? false : item?.view?.value,
                },
                edit: {
                  param: item?.edit?.param,
                  description: item?.edit?.description,
                  value: possibleItemViewShield ? false : item?.edit?.value,
                },
              };
            }

            if (item.view) {
              const _possibleItemViewShield = shieldAccess?.[item?.view?.param];
              return {
                ...item,
                view: {
                  param: item?.view?.param,
                  description: item?.view?.description,
                  value: _possibleItemViewShield ? false : item?.view?.value,
                },
              };
            }

            if (item.edit) {
              const _possibleItemEditShield = shieldAccess?.[item?.edit?.param];
              return {
                ...item,
                edit: {
                  param: item?.edit?.param,
                  description: item?.edit?.description,
                  value: _possibleItemEditShield ? false : item?.edit?.value,
                },
              };
            }

            if (item.hide) {
              const _possibleItemHideShield = shieldAccess?.[item?.hide?.param];
              return {
                ...item,
                edit: {
                  param: item?.hide?.param,
                  description: item?.edit?.description,
                  value: _possibleItemHideShield ? false : item?.hide?.value,
                },
              };
            }

            return item;
          });

          return {
            ...temp,
            view: {
              param: temp?.view?.param,
              description: temp?.view?.description,
              value: possibleViewShield ? false : temp?.view?.value,
            },
            items: itemsWithValues,
          };
        }

        return {
          ...temp,
          view: {
            param: temp?.view?.param,
            description: temp?.view?.description,
            value: possibleViewShield ? false : temp?.view?.value,
          },
        };
      }

      if (temp.edit) {
        const possibleEditShield = shieldAccess?.[temp?.edit?.param];

        if (temp?.items && temp?.items?.length) {
          const itemsWithValues = temp?.items?.map((item) => {
            if (item.view) {
              const possibleItemViewShield = shieldAccess?.[item?.view?.param];
              return {
                ...item,
                view: {
                  param: item?.view?.param,
                  description: item?.view?.description,
                  value: possibleItemViewShield ? false : item?.view?.value,
                },
              };
            }

            if (item.edit) {
              const possibleItemEditShield = shieldAccess?.[item?.edit?.param];
              return {
                ...item,
                edit: {
                  param: item?.edit?.param,
                  description: item?.edit?.description,
                  value: possibleItemEditShield ? false : item?.edit?.value,
                },
              };
            }

            return item;
          });

          return {
            ...temp,
            edit: {
              param: temp?.edit?.param,
              description: temp?.edit?.description,
              value: possibleEditShield ? false : temp?.edit?.value,
            },
            items: itemsWithValues,
          };
        }

        return {
          ...temp,
          edit: {
            param: temp?.edit?.param,
            description: temp?.edit?.description,
            value: possibleEditShield ? false : temp?.edit?.value,
          },
        };
      }

      return temp;
    });

    setRoleTemplate(templateWithShield);
  }

  const handleSetTemplateValues = (initializedTemplates = []) => {
    const values = props?.template?.acc;
    if (!values) {
      handleDefaultSet(initializedTemplates)
      return;
    }

    const templatesWithValues = initializedTemplates?.map((temp) => {
      if (temp.view) {
        const possibleViewValue = values[temp?.view?.param];

        if (temp?.items && temp?.items?.length) {
          const itemsWithValues = temp?.items?.map((item) => {
            if (item.view && item.edit && item.hide) {
              const possibleItemViewValue = values[item?.view?.param];
              const possibleItemEditValue = values[item?.edit?.param];
              const possibleItemHideValue = values[item?.hide?.param];

              return {
                ...item,
                view: {
                  param: item?.view?.param,
                  description: item?.view?.description,
                  value:
                    possibleItemViewValue === undefined
                      ? true
                      : possibleItemViewValue,
                },
                edit: {
                  param: item?.edit?.param,
                  description: item?.edit?.description,
                  value:
                    possibleItemEditValue === undefined
                      ? true
                      : possibleItemEditValue,
                },
                hide: {
                  param: item?.hide?.param,
                  description: item?.hide?.description,
                  value:
                    possibleItemHideValue === undefined
                      ? true
                      : possibleItemHideValue,
                },
              };
            }

            if (item.view && item.edit) {
              const possibleItemViewValue = values[item?.view?.param];
              const possibleItemEditValue = values[item?.edit?.param];

              return {
                ...item,
                view: {
                  param: item?.view?.param,
                  description: item?.view?.description,
                  value:
                    possibleItemViewValue === undefined
                      ? true
                      : possibleItemViewValue,
                },
                edit: {
                  param: item?.edit?.param,
                  description: item?.edit?.description,
                  value:
                    possibleItemEditValue === undefined
                      ? true
                      : possibleItemEditValue,
                },
              };
            }

            if (item.view) {
              const _possibleItemViewValue = values[item?.view?.param];
              return {
                ...item,
                view: {
                  param: item?.view?.param,
                  description: item?.view?.description,
                  value:
                    _possibleItemViewValue === undefined
                      ? true
                      : _possibleItemViewValue,
                },
              };
            }

            if (item.edit) {
              const _possibleItemEditValue = values[item?.edit?.param];
              return {
                ...item,
                edit: {
                  param: item?.edit?.param,
                  description: item?.edit?.description,
                  value:
                    _possibleItemEditValue === undefined
                      ? true
                      : _possibleItemEditValue,
                },
              };
            }

            if (item.hide) {
              const _possibleItemHideValue = values[item?.hide?.param];
              return {
                ...item,
                edit: {
                  param: item?.hide?.param,
                  description: item?.edit?.description,
                  value:
                    _possibleItemHideValue === undefined
                      ? true
                      : _possibleItemHideValue,
                },
              };
            }

            return item;
          });

          return {
            ...temp,
            view: {
              param: temp?.view?.param,
              description: temp?.view?.description,
              value: possibleViewValue,
            },
            items: itemsWithValues,
          };
        }

        return {
          ...temp,
          view: {
            param: temp?.view?.param,
            description: temp?.view?.description,
            value: possibleViewValue,
          },
        };
      }

      if (temp.edit) {
        const possibleEditValue = values[temp?.edit?.param];

        if (temp?.items && temp?.items?.length) {
          const itemsWithValues = temp?.items?.map((item) => {
            if (item.view) {
              const possibleItemViewValue = values[item?.view?.param];
              return {
                ...item,
                view: {
                  param: item?.view?.param,
                  description: item?.view?.description,
                  value: possibleItemViewValue,
                },
              };
            }

            if (item.edit) {
              const possibleItemEditValue = values[item?.edit?.param];
              return {
                ...item,
                edit: {
                  param: item?.edit?.param,
                  description: item?.edit?.description,
                  value: possibleItemEditValue,
                },
              };
            }

            return item;
          });

          return {
            ...temp,
            edit: {
              param: temp?.edit?.param,
              description: temp?.edit?.description,
              value: possibleEditValue,
            },
            items: itemsWithValues,
          };
        }

        return {
          ...temp,
          edit: {
            param: temp?.edit?.param,
            description: temp?.edit?.description,
            value: possibleEditValue,
          },
        };
      }

      return temp;
    });

    setRoleTemplate(templatesWithValues);
  };

  const getCustomFieldsAndSetRoleTemplate = async () => {
    try {
      const { client_fields: clientFields } =
        await customerFieldsApi.getCustomerFields();
      if (clientFields?.length) {
        const mappedArray = clientFields?.flatMap((element) => {
          if (element.setting) {
            try {
              const parsedItems = JSON.parse(element.setting);
              if (Array.isArray(parsedItems)) {
                const itemsWithAdditionalData = parsedItems.map((item) => ({
                  ...element,
                  ...item,
                }));
                return [element, ...itemsWithAdditionalData];
              }
            } catch (error) {
              console.error(`Error parsing JSON in item: ${element.name}`);
            }
          }
          return [element];
        });

        const clientFieldsTemplate = mappedArray?.map((field) => {
          if (field?.option) {
            return {
              name: `Custom Data Field ${field?.friendly_name} option ${field?.option}`,
              view: {
                param: `acc_custom_v_${field?.value}_${field?.option?.replace(
                  /\s+/g,
                  "_"
                )}`,
                description: `User can view Custom Data Field ${field?.friendly_name} option ${field?.option}`,
                value: true,
              },
              option: true,
            };
          } else {
            return {
              name: `Custom Data ${field?.friendly_name}`,
              edit: {
                param: `acc_custom_e_${field?.value}`,
                description: `User can edit Custom Data ${field?.friendly_name}`,
                value: true,
              },
              view: {
                param: `acc_custom_v_${field?.value}`,
                description: `User can view Custom Data ${field?.friendly_name}`,
                value: true,
              },
            };
          }
        });

        if (
          haveDuplicates(
            clientFieldsTemplate,
            roleTemplateDefault?.find((t) => t?.name === "Customers")?.items
          )
        ) {
        } else {
          roleTemplateDefault
            ?.find((t) => t?.name === "Customers")
            ?.items?.push(...clientFieldsTemplate);
        }

        handleSetTemplateValues(roleTemplateDefault);
      } else {
        handleSetTemplateValues(roleTemplateDefault);
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message);
    }
  };

  const handleChangeTemplateValue = useCallback(async (e, name, childName, type) => {
    setIsEdited(true);
    const val = e?.target?.checked;
    
    let updatedRoleTemplates;
    if (childName) {
      updatedRoleTemplates = roleTemplate?.map((template) => {
        if (template?.name === name) {
          return {
            ...template,
            items: template?.items?.map((item) => {
              if (item?.name === childName) {
                return {
                  ...item,
                  [type]: {
                    ...item[type],
                    value: val,
                  },
                };
              } else {
                return item;
              }
            }),
          };
        } else {
          return template;
        }
      });
      setRoleTemplate(updatedRoleTemplates);
    } else {
      updatedRoleTemplates = roleTemplate?.map((template) => {
        if (template?.name === name) {
          return {
            ...template,
            [type]: {
              ...template[type],
              value: val,
            },
          };
        } else {
          return template;
        }
      });
      setRoleTemplate(updatedRoleTemplates);
    }

    const flattenedArray = [];
    updatedRoleTemplates?.forEach((obj) => {
      flattenedArray.push({ ...obj, items: undefined });
      if (obj.items) {
        flattenedArray.push(...obj.items);
      }
    });

    const paramsArray = flattenedArray?.map((item) => {
      return { view: item?.view, edit: item?.edit, hide: item?.hide };
    });

    const params = {};

    paramsArray?.forEach((item) => {
      if (item.view) {
        params[item?.view?.param] = item?.view?.value;
      }
      if (item.edit) {
        params[item?.edit?.param] = item?.edit?.value;
      }
      if (item.hide) {
        params[item?.hide?.param] = item?.hide?.value;
      }
    });

    const requestData = {
      acc: params,
    };

    await settingsApi.updateRole(props?.template?.id, requestData);

    setSelectedItem(updatedRoleTemplates.find(template => template.name === selectedItem?.name));

    toast.success("Role template successfully updated!");
    setIsEdited(false);

  }, [roleTemplate, selectedItem]);

  const handleCreateTemplate = useCallback(async () => {
    try {
      const flattenedArray = [];

      roleTemplate?.forEach((obj) => {
        flattenedArray.push({ ...obj, items: undefined });
        if (obj.items) {
          flattenedArray.push(...obj.items);
        }
      });

      const paramsArray = flattenedArray?.map((item) => {
        return { view: item?.view, edit: item?.edit, hide: item?.hide };
      });

      const params = {};

      paramsArray?.forEach((item) => {
        if (item.view) {
          params[item?.view?.param] = item?.view?.value;
        }
        if (item.edit) {
          params[item?.edit?.param] = item?.edit?.value;
        }
        if (item.hide) {
          params[item?.hide?.param] = item?.hide?.value;
        }
      });

      const requestData = {
        acc: params,
      };

      await settingsApi.updateRole(props?.template?.id, requestData);

      toast.success("Role template successfully updated!");
      setIsEdited(false);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }, [roleTemplate, props?.template?.id]);

  const handleChangeShieldValue = useCallback(async (accName, shieldValue) => {
    try {
      const access = shieldAccess ?? {};
      access[accName] = shieldValue;

      setShieldAccess({ ...access });

      await settingsApi.updateCompany({
        id: company?.id,
        data: {
          acc: access,
        },
      });
      toast.success("Access shield successfully updated!");
    } catch (error) {
      console.error("error:", error);
      toast.error(error?.response?.data?.message);
    }
  }, [shieldAccess, company?.id]);

  const handleSettingsGo = useCallback(() => {
    if (isEdited) {
      if (window.confirm("Do you want to save changes before leave?")) {
        handleCreateTemplate();
        history(paths.dashboard.settings + "?tab=team", { state: { subTab: "roles" } });
      } else {
        history(paths.dashboard.settings + "?tab=team", { state: { subTab: "roles" } });
      }
    } else {
      history(paths.dashboard.settings + "?tab=team", { state: { subTab: "roles" } });
    }
  }, [history, isEdited, handleCreateTemplate]);

  const onSubmit = useCallback(async (data) => {
    try {
      const flattenedArray = [];

      roleTemplate?.forEach((obj) => {
        flattenedArray.push({ ...obj, items: undefined });
        if (obj.items) {
          flattenedArray.push(...obj.items);
        }
      });

      const paramsArray = flattenedArray?.map((item) => {
        return { view: item?.view, edit: item?.edit, hide: item?.hide };
      });

      const params = {};

      paramsArray?.forEach((item) => {
        if (item.view) {
          params[item?.view?.param] = item?.view?.value;
        }
        if (item.edit) {
          params[item?.edit?.param] = item?.edit?.value;
        }
        if (item.hide) {
          params[item?.hide?.param] = item?.hide?.value;
        }
      });

      const requestData = {
        acc: params,
        name: data?.name,
      };

      await settingsApi.updateRole(props?.template?.id, requestData);
      toast.success("Role successfully updated!");
      setTimeout(() => {
        props?.onGetTemplate();
      }, 1000);
      setOpenEditName(false);
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.error("error:, ", error);
    }
  }, [roleTemplate, props?.template?.id, props?.onGetTemplate]);

  const handleOpenRemoveAllAccessDialog = () => {
    setOpenRemoveAllAccessDialog(true);
  };

  const handleCloseRemoveAllAccessDialog = () => {
    setOpenRemoveAllAccessDialog(false);
  };

  const handleOpenRemoveAccessDialog = () => {
    setOpenRemoveAccessDialog(true);
  };

  const handleCloseRemoveAccessDialog = () => {
    setOpenRemoveAccessDialog(false);
  };

  const handleRemoveAccess = useCallback(async (item = null) => {
    try {
      let updatedRoleTemplates;

      if (item) {
        updatedRoleTemplates = roleTemplate.map(template => {
          if (template.name === item.name) {
            const updatedTemplate = { ...template };
            
            if (template.view) {
              updatedTemplate.view = { ...template.view, value: false };
            }
            if (template.edit) {
              updatedTemplate.edit = { ...template.edit, value: false };
            }
            if (template.hide) {
              updatedTemplate.hide = { ...template.hide, value: false };
            }

            if (template.items) {
              updatedTemplate.items = template.items.map(item => {
                const updatedItem = { ...item };
                if (item.view) {
                  updatedItem.view = { ...item.view, value: false };
                }
                if (item.edit) {
                  updatedItem.edit = { ...item.edit, value: false };
                }
                if (item.hide) {
                  updatedItem.hide = { ...item.hide, value: false };
                }
                return updatedItem;
              });
            }
            
            return updatedTemplate;
          }
          return template;
        });
      } else {
        updatedRoleTemplates = roleTemplate.map(template => {
          const updatedTemplate = { ...template };
          
          if (template.view) {
            updatedTemplate.view = { ...template.view, value: false };
          }
          if (template.edit) {
            updatedTemplate.edit = { ...template.edit, value: false };
          }
          if (template.hide) {
            updatedTemplate.hide = { ...template.hide, value: false };
          }
          
          if (template.items) {
            updatedTemplate.items = template.items.map(item => {
              const updatedItem = { ...item };
              if (item.view) {
                updatedItem.view = { ...item.view, value: false };
              }
              if (item.edit) {
                updatedItem.edit = { ...item.edit, value: false };
              }
              if (item.hide) {
                updatedItem.hide = { ...item.hide, value: false };
              }
              return updatedItem;
            });
          }
          
          return updatedTemplate;
        });
      }

      setRoleTemplate(updatedRoleTemplates);
      setIsEdited(true);

      const flattenedArray = [];
      updatedRoleTemplates.forEach((obj) => {
        flattenedArray.push({ ...obj, items: undefined });
        if (obj.items) {
          flattenedArray.push(...obj.items);
        }
      });

      const paramsArray = flattenedArray.map((item) => {
        return { view: item?.view, edit: item?.edit, hide: item?.hide };
      });

      const params = {};
      paramsArray.forEach((item) => {
        if (item.view) {
          params[item.view.param] = item.view.value;
        }
        if (item.edit) {
          params[item.edit.param] = item.edit.value;
        }
        if (item.hide) {
          params[item.hide.param] = item.hide.value;
        }
      });

      await settingsApi.updateRole(props?.template?.id, {
        acc: params,
      });

      if(item) {
        handleCloseRemoveAccessDialog();
      } else {
        handleCloseRemoveAllAccessDialog();
      }
      toast.success(item ? item?.name + ' access has been removed successfully!' : 'All access has been removed successfully!');
      
      setSelectedItem(updatedRoleTemplates.find(template => template.name === selectedItem?.name));
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || 'Failed to remove access');
    } finally {
      setIsEdited(false);
    }
  }, [roleTemplate, props?.template?.id, selectedItem]);

  const handleEnableAccess = useCallback(async (item = null) => {
    try {
      let updatedRoleTemplates;

      if (item) {
        updatedRoleTemplates = roleTemplate.map(template => {
          if (template.name === item.name) {
            const updatedTemplate = { ...template };
            
            if (template.view) {
              updatedTemplate.view = { ...template.view, value: true };
            }
            if (template.edit) {
              updatedTemplate.edit = { ...template.edit, value: true };
            }
            if (template.hide) {
              updatedTemplate.hide = { ...template.hide, value: true };
            }

            if (template.items) {
              updatedTemplate.items = template.items.map(item => {
                const updatedItem = { ...item };
                if (item.view) {
                  updatedItem.view = { ...item.view, value: true };
                }
                if (item.edit) {
                  updatedItem.edit = { ...item.edit, value: true };
                }
                if (item.hide) {
                  updatedItem.hide = { ...item.hide, value: true };
                }
                return updatedItem;
              });
            }
            
            return updatedTemplate;
          }
          return template;
        });
      } else {
        updatedRoleTemplates = roleTemplate.map(template => {
          const updatedTemplate = { ...template };
          
          if (template.view) {
            updatedTemplate.view = { ...template.view, value: true };
          }
          if (template.edit) {
            updatedTemplate.edit = { ...template.edit, value: true };
          }
          if (template.hide) {
            updatedTemplate.hide = { ...template.hide, value: true };
          }
          
          if (template.items) {
            updatedTemplate.items = template.items.map(item => {
              const updatedItem = { ...item };
              if (item.view) {
                updatedItem.view = { ...item.view, value: true };
              }
              if (item.edit) {
                updatedItem.edit = { ...item.edit, value: true };
              }
              if (item.hide) {
                updatedItem.hide = { ...item.hide, value: true };
              }
              return updatedItem;
            });
          }
          
          return updatedTemplate;
        });
      }

      setRoleTemplate(updatedRoleTemplates);
      setIsEdited(true);

      const flattenedArray = [];
      updatedRoleTemplates.forEach((obj) => {
        flattenedArray.push({ ...obj, items: undefined });
        if (obj.items) {
          flattenedArray.push(...obj.items);
        }
      });

      const paramsArray = flattenedArray.map((item) => {
        return { view: item?.view, edit: item?.edit, hide: item?.hide };
      });

      const params = {};
      paramsArray.forEach((item) => {
        if (item.view) {
          params[item.view.param] = item.view.value;
        }
        if (item.edit) {
          params[item.edit.param] = item.edit.value;
        }
        if (item.hide) {
          params[item.hide.param] = item.hide.value;
        }
      });

      await settingsApi.updateRole(props?.template?.id, {
        acc: params,
      });

      toast.success(item ? item?.name + ' access has been enabled successfully!' : 'All access has been enabled successfully!');
      
      setSelectedItem(updatedRoleTemplates.find(template => template.name === selectedItem?.name));
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || 'Failed to enable access');
    } finally {
      setIsEdited(false);
    }
  }, [roleTemplate, props?.template?.id, selectedItem]);

  const handleItemSelect = (selectedData) => {
    setSelectedItem(selectedData);
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (props?.template?.id) {
      getCustomFieldsAndSetRoleTemplate();
      setValue("name", props?.template?.name);
    }
  }, [props?.template]);

  useEffect(() => {
    if (company.acc) {
      setShieldAccess(company.acc);
    }
  }, [company]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "Do you want to save changes before leave?";
      return "Do you want to save changes before leave?";
    };

    const handleBackButton = (event) => {
      event.preventDefault();
      if (window.confirm("Do you want to save changes before leave?")) {
        handleCreateTemplate();
      }
    };

    if (isEdited) {
      window.addEventListener("beforeunload", handleBeforeUnload);
      window.onpopstate = handleBackButton;
    } else {
      window.onpopstate = null;
    }

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [history, isEdited, location]);

  useEffect(() => {
    if(!selectedItem) {
      setSelectedItem(roleTemplate[0]);
    }
  }, [roleTemplate])

  return (
    <Container maxWidth="xl">
      <Link
        color="text.primary"
        sx={{
          alignItems: "center",
          display: "inline-flex",
          cursor: "pointer",
        }}
        underline="hover"
        onClick={handleSettingsGo}
      >
        <Iconify icon="octicon:arrow-left-16" width={24} sx={{ mr: 1 }} />
        <Typography variant="subtitle1">To settings</Typography>
      </Link>
      
      <Stack spacing={3} pt={2}>
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          justifyContent="space-between"
          spacing={2}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="h3" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
              {props?.template?.name}
            </Typography>
            <IconButton 
              onClick={() => setOpenEditName(true)}
              sx={{ '&:hover': { color: 'primary.main' }}}
            >
              <Iconify icon="uil:edit" />
            </IconButton>
          </Stack>
          
          <Stack 
            direction="row"
            width={{ xs: 1, sm: 'auto' }}
            spacing={2}
          >
            <Button
              fullWidth
              color="error"
              variant="contained"
              onClick={handleOpenRemoveAllAccessDialog}
              startIcon={<Iconify icon="mdi:shield-off" sx={{ width: 20 }} />}
              size="small"
              sx={{whiteSpace: "nowrap"}}
            >
              Remove all access
            </Button>
            <Button 
              fullWidth
              variant="contained" 
              onClick={() => handleEnableAccess(null)}
              startIcon={<Iconify icon="mdi:shield-check" sx={{ width: 20 }} />}
              size="small"
              sx={{whiteSpace: "nowrap"}}
            >
              Enable all access
            </Button>
          </Stack>
        </Stack>

        <Stack gap={2}>
          <RoleTemplateAISummary roleId={props?.template?.id} />

          {props?.isLoading ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "400px",
              }}
            >
              <CircularProgress
                size={70}
                sx={{ alignSelf: "center", justifySelf: "center" }}
              />
            </Box>
          ) : (
            <Grid container spacing={3} sx={{ marginLeft: '-16px !important', marginRight: '-16px !important' }}>
              <Grid xs={12} md={3}>
                <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                  <TreeView
                    templates={roleTemplate}
                    onItemSelect={handleItemSelect}
                    selectedItem={selectedItem}
                    searchQuery={searchQuery}
                    debouncedSearchQuery={debouncedSearchQuery}
                    onSearchChange={handleSearchChange}
                  />
                </Box>
                <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                  <Autocomplete
                    fullWidth
                    options={roleTemplate}
                    autoHighlight
                    onChange={(event, value) => {
                      if (value) handleItemSelect(value);
                    }}
                    getOptionLabel={(option) => option.name}
                    renderOption={(props, option) => (
                      <li {...props} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Iconify icon="fluent:shield-32-filled" width={20} style={{ marginRight: 4 }} color={selectedItem?.name === option?.name ? 'primary.contrastText' : 'text.secondary'} />
                        <span>{option.name}</span>
                      </li>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={
                          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Iconify icon="mdi:account-badge-outline" width={20} style={{ marginRight: 4 }} />
                            Role
                          </span>
                        }
                      />
                    )}
                  />
                </Box>
              </Grid>
              <Grid xs={12} md={9}>
                <DetailView
                  selectedItem={selectedItem}
                  shieldAccess={shieldAccess}
                  user={user}
                  onChangeValue={handleChangeTemplateValue}
                  onChangeShieldValue={handleChangeShieldValue}
                  onEnableAccess={handleEnableAccess}
                  onOpenRemoveAccessDialog={handleOpenRemoveAccessDialog}
                />
              </Grid>
            </Grid>
          )}
        </Stack>
      </Stack>

      <CustomModal
        onClose={() => {
          setOpenEditName(false);
          reset();
        }}
        open={openEditName}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            <Typography
              id="modal-modal-title"
              align="center"
              sx={{ fontSize: 22, fontWeight: "bold", mt: 1 }}
            >
              Update Role Name
            </Typography>
            <Stack direction="column">
              <Stack sx={{ py: 2 }} spacing={1} justifyContent="center">
                <Typography>Name</Typography>
                <TextField
                  fullWidth
                  autoFocus
                  label="Name"
                  InputLabelProps={{ shrink: true }}
                  name="name"
                  type="text"
                  {...register("name")}
                />
              </Stack>
            </Stack>
            <Stack sx={{ gap: 2 }} direction="row" justifyContent="center">
              <Button variant="contained" type="submit">
                Update
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  setOpenEditName(false);
                }}
              >
                Cancel
              </Button>
            </Stack>
          </Stack>
        </form>
      </CustomModal>

      <Dialog
        open={openRemoveAllAccessDialog}
        onClose={handleCloseRemoveAllAccessDialog}
      >
        <DialogTitle sx={{ px: 3, pt: 3 }}>Remove All Access</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to remove all access for this role template? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleCloseRemoveAllAccessDialog} color="inherit">
            Cancel
          </Button>
          <Button onClick={() => handleRemoveAccess(null)} color="error" variant="contained">
            Remove All Access
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openRemoveAccessDialog}
        onClose={handleCloseRemoveAccessDialog}
      >
        <DialogTitle sx={{ px: 3, pt: 3 }}>Remove {selectedItem?.name} Access</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to remove {selectedItem?.name} access? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleCloseRemoveAccessDialog} color="inherit">
            Cancel
          </Button>
          <Button onClick={() => handleRemoveAccess(selectedItem)} color="error" variant="contained">
            Remove {selectedItem?.name} Access
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
