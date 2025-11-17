import { useEffect, useMemo, useState, useCallback, memo } from "react";
import toast from "react-hot-toast";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import Grid from "@mui/system/Unstable_Grid/Grid";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Switch from "@mui/material/Switch";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { Iconify } from 'src/components/iconify';
import { customerFieldsApi } from "src/api/customer-fields";
import { roleTemplateDefault } from "./role/constants";
import { settingsApi } from "src/api/settings";
import { useAuth } from "src/hooks/use-auth";
import { companyEmailsApi } from "src/api/company-emails";
import { SettingsMemberAccessAISummary } from "./settings-member-access-ai-summary";

// Simple deep clone utility
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

const getDisplayName = (item, company) => {
  if (company?.company_type === 2) {
    if (item?.view?.param === "acc_v_client_trader_settings" || item?.edit?.param === "acc_v_client_trader_settings") {
      return "Dashboard Settings";
    }
    if (item?.view?.param === "acc_e_client_trade_lock" || item?.edit?.param === "acc_e_client_trade_lock") {
      return "Lock Account";
    }
  }
  return item?.name;
};

const TreeView = memo(({ templates, onItemSelect, selectedItem, searchQuery, debouncedSearchQuery, onSearchChange, company }) => {
  const handleItemClick = useCallback((item) => {
    onItemSelect(item);
  }, [onItemSelect]);

  const handleSearchChange = useCallback((event) => {
    onSearchChange(event.target.value);
  }, [onSearchChange]);

  const handleClearSearch = useCallback(() => {
    onSearchChange("");
  }, [onSearchChange]);

  const hiddenAccesses = [
    "acc_v_client_position",
    "acc_e_client_create_position",
    "acc_e_risk_position",
    "acc_v_risk_position",
    "acc_v_export_positions",
    "acc_v_client_bets",
  ];

  const betsHiddenAccesses = [
    "acc_v_risk_bets",
    "acc_v_bets_id",
    "acc_v_bets_client_id",
    "acc_v_bets_bet_id",
    "acc_v_bets_external_brand",
    "acc_v_bets_external_user_id",
    "acc_v_bets_bet_type",
    "acc_v_bets_bet_category",
    "acc_v_bets_bet_amount",
    "acc_v_bets_win_amount",
    "acc_v_bets_potential_win",
    "acc_v_bets_currency",
    "acc_v_bets_status",
    "acc_v_bets_settlement_status",
    "acc_v_bets_total_odds",
    "acc_v_bets_selection_count",
    "acc_v_bets_account_id",
    "acc_v_bets_desk_id",
    "acc_v_bets_platform",
    "acc_v_bets_timing",
    "acc_v_bets_bet_date",
    "acc_v_bets_settlement_date",
    "acc_v_bets_real_balance_before",
    "acc_v_bets_real_balance_after",
    "acc_v_bets_bonus_balance_before",
    "acc_v_bets_bonus_balance_after",
    "acc_v_bets_sport_data",
    "acc_v_bets_competitors",
    "acc_v_bets_webhook_data",
    "acc_v_bets_description",
    "acc_v_bets_is_live",
    "acc_v_bets_is_virtual",
    "acc_v_bets_is_cash_out",
    "acc_v_bets_event_date",
    "acc_v_bets_source_system",
    "acc_v_bets_processing_status",
    "acc_v_bets_created_at",
    "acc_e_bets",
    "acc_e_delete_bets",
    "acc_e_create_bets",
  ];

  const walletHiddenAccesses = [
    "acc_v_client_wallet",
    "acc_e_client_walletl",
    "acc_v_client_refresh_wallets",
    "acc_v_risk_wallet_transactions",
    "acc_v_wallet",
    "acc_v_active_wallets",
    "acc_v_inactive_wallets",
  ];

  const shouldHideAccess = (param) => {
    const isCompanyType2 = company?.company_type === 2 && hiddenAccesses.includes(param);
    const isCompanyType1 = company?.company_type === 1 && betsHiddenAccesses.includes(param);
    const isWalletDisabled = !company?.company_wallet_system && walletHiddenAccesses.includes(param);
    return isCompanyType2 || isCompanyType1 || isWalletDisabled;
  };

  const shouldHideTemplate = (template) => {
    if (company?.company_type !== 2 && company?.company_wallet_system) return false;
    
    const hasVisibleItems = template?.items?.some(item => {
      const param = item.view ? item.view.param : item.edit ? item.edit.param : item.hide?.param;
      return !shouldHideAccess(param);
    });
    
    const hasVisibleMainPermission = (template?.view && !shouldHideAccess(template.view.param)) ||
          (template?.edit && !shouldHideAccess(template.edit.param)) ||
          (template?.hide && !shouldHideAccess(template.hide.param));
    
    return !hasVisibleItems && !hasVisibleMainPermission;
  };

  const filteredTemplates = useMemo(() => {
    return templates.filter(template => {
      if (shouldHideTemplate(template)) return false;
      
      if (!debouncedSearchQuery) return true;
      
      const query = debouncedSearchQuery.toLowerCase();
      
      if (template?.name?.toLowerCase().includes(query)) return true;
      
      return false;
    });
  }, [templates, debouncedSearchQuery, company?.company_type, company?.company_wallet_system]);

  return (
    <Paper sx={{ height: 1, minHeight: "100vh", overflow: 'auto', border: '1px dashed rgba(145, 158, 171, 0.2)' }}>
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
                    primary={getDisplayName(template, company)}
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

const DetailView = memo(({ selectedItem, shieldAccess, user, onChangeValue, onChangeShieldValue, onEnableAccess, onOpenRemoveAccessDialog, company }) => {
  const [childSearchQuery, setChildSearchQuery] = useState("");

  const hiddenAccesses = [
    "acc_v_client_position",
    "acc_e_client_create_position",
    "acc_e_risk_position",
    "acc_v_risk_position",
    "acc_v_export_positions",
  ];

  const betsHiddenAccesses = [
    "acc_v_risk_bets",
    "acc_v_bets_id",
    "acc_v_bets_client_id",
    "acc_v_bets_bet_id",
    "acc_v_bets_external_brand",
    "acc_v_bets_external_user_id",
    "acc_v_bets_bet_type",
    "acc_v_bets_bet_category",
    "acc_v_bets_bet_amount",
    "acc_v_bets_win_amount",
    "acc_v_bets_potential_win",
    "acc_v_bets_currency",
    "acc_v_bets_status",
    "acc_v_bets_settlement_status",
    "acc_v_bets_total_odds",
    "acc_v_bets_selection_count",
    "acc_v_bets_account_id",
    "acc_v_bets_desk_id",
    "acc_v_bets_platform",
    "acc_v_bets_timing",
    "acc_v_bets_bet_date",
    "acc_v_bets_settlement_date",
    "acc_v_bets_real_balance_before",
    "acc_v_bets_real_balance_after",
    "acc_v_bets_bonus_balance_before",
    "acc_v_bets_bonus_balance_after",
    "acc_v_bets_sport_data",
    "acc_v_bets_competitors",
    "acc_v_bets_webhook_data",
    "acc_v_bets_description",
    "acc_v_bets_is_live",
    "acc_v_bets_is_virtual",
    "acc_v_bets_is_cash_out",
    "acc_v_bets_event_date",
    "acc_v_bets_source_system",
    "acc_v_bets_processing_status",
    "acc_v_bets_created_at",
    "acc_e_bets",
    "acc_e_delete_bets",
    "acc_e_create_bets",
  ];

  const walletHiddenAccesses = [
    "acc_v_client_wallet",
    "acc_e_client_walletl",
    "acc_v_client_refresh_wallets",
    "acc_v_risk_wallet_transactions",
    "acc_v_wallet",
    "acc_v_active_wallets",
    "acc_v_inactive_wallets",
  ];

  const shouldHideAccess = (param) => {
    const isCompanyType2 = company?.company_type === 2 && hiddenAccesses.includes(param);
    const isCompanyType1 = company?.company_type === 1 && betsHiddenAccesses.includes(param);
    const isWalletDisabled = !company?.company_wallet_system && walletHiddenAccesses.includes(param);
    return isCompanyType2 || isCompanyType1 || isWalletDisabled;
  };

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
      <Paper sx={{ height: 1, minHeight: "100vh", display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed rgba(145, 158, 171, 0.2)' }}>
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
                : selectedItem?.hide?.param;
  const shield = shieldAccess?.[param];
  const isUnderShield = shield !== undefined && shield === true;

  return (
    <Paper sx={{ height: 1, overflow: 'auto', border: '1px dashed rgba(145, 158, 171, 0.2)' }}>
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
                  {getDisplayName(selectedItem, company)}
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
            
            {selectedItem?.view && !shouldHideAccess(selectedItem?.view?.param) && (
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

            {selectedItem?.edit && !shouldHideAccess(selectedItem?.edit?.param) && (
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
                    disabled={
                      !user?.super_admin &&
                      shieldAccess?.[selectedItem?.edit?.param] !==
                        undefined &&
                      shieldAccess?.[selectedItem?.edit?.param] === true
                    }
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

                      if (shouldHideAccess(childParam)) {
                        return null;
                      }

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
                                  primary={highlightChildText(getDisplayName(childItem, company), childSearchQuery)}
                                  primaryTypographyProps={{ 
                                    variant: 'body2',
                                    sx: {
                                      fontSize: { xs: '0.875rem', sm: 'inherit' }
                                    }
                                  }}
                                />
                                {childItem?.info && (
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
                                )}
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

const DEFAULT_OFF_ACCESS = [
  "acc_v_risk_wallet_transactions",
  "acc_e_client_bulk_invite",
  "acc_e_add_agent",
  "acc_e_add_ip",
  "acc_e_client_bulk_delete",
  "acc_v_logs",
  "acc_v_client_first_deposit",
  "acc_v_client_second_deposit",
  "acc_v_client_third_deposit",
  "acc_v_client_last_deposit",
  "acc_v_client_total_deposit",
  "acc_h_client_phone",
  "acc_h_client_email",
  "acc_h_client_pin",
  "acc_v_client_logs",
  "acc_v_all_agents_calendar",
  "acc_v_client_all",
  "acc_v_client_desk",
  "acc_e_client_desk",
  "acc_e_client_create_position",
  "acc_v_client_first_desk_name",
  "acc_v_client_second_desk_name",
  "acc_v_client_third_desk_name",
  "acc_v_client_first_assigned_agent",
  "acc_v_client_second_assigned_agent",
  "acc_v_client_third_assigned_agent",
  "acc_v_client_last_assigned_agent",
  "acc_v_client_first_call",
  "acc_v_client_second_call",
  "acc_v_client_third_call",
  "acc_v_client_frd_owner",
  "acc_e_self_delete",
  "acc_v_audit_compliance_regulation",
  "acc_v_audit_compliance",
  "acc_v_audit_agent_report",
  "acc_v_audit_client_report",
  "acc_v_audit_regulatory_report",
  "acc_v_ib_room",
  "acc_v_ai_questions",
  "acc_v_twilio_numbers",
  "acc_v_coperato_numbers",
  "acc_v_voiso_numbers",
  "acc_v_didglobal_numbers",
  "acc_v_cy_pbx_numbers",
  "acc_v_squaretalk_numbers",
  "acc_v_commpeak_numbers",
  "acc_v_mmdsmart_numbers",
  "acc_v_prime_voip_numbers",
  "acc_v_voicespin_numbers",
  "acc_v_perfect_money_numbers",
  "acc_v_nuvei_numbers",
  "acc_e_external_transaction_id",
  "acc_e_external_brand",
  "acc_e_external_user_id",
  "acc_e_payment_method",
  "acc_e_payment_method_code",
  "acc_e_processing_status",
  "acc_e_failure_reason",
  "acc_e_real_balance_before",
  "acc_e_real_balance_after",
  "acc_e_bonus_balance_before",
  "acc_e_bonus_balance_after",
  "acc_e_bonus_code",
  "acc_e_bonus_type",
  "acc_e_bonus_release_amount",
  "acc_e_bonus_cancel_reason",
  "acc_e_total_pending_withdrawals_count",
  "acc_e_total_pending_withdrawals_amount",
  "acc_e_user_net_deposits",
  "acc_e_is_first_deposit",
  "acc_e_event_date",
  "acc_e_source_system",
  "acc_e_webhook_data",
  "acc_v_client_psp_links",
  "acc_v_integration",
];

const SettingsMemberAccessEdit = ({ member, onGetMember, ...other }) => {
  const { company, user } = useAuth();

  const [roleTemplate, setRoleTemplate] = useState([]);
  const [roleTemplates, setRoleTemplates] = useState([]);
  const [shieldAccess, setShieldAccess] = useState(null);
  const [selectedRoleTemplate, setSelectedRoleTemplate] = useState(null);
  const [allowChangeTemplate, setAllowChangeTemplate] = useState(false);
  const [openRemoveAllAccessDialog, setOpenRemoveAllAccessDialog] = useState(false);
  const [openRemoveAccessDialog, setOpenRemoveAccessDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  const handleItemSelect = useCallback((item) => {
    setSelectedItem(item);
  }, []);

  const handleSearchChange = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if(!selectedItem && roleTemplate.length > 0) {
      setSelectedItem(roleTemplate[0]);
    }
  }, [roleTemplate]);

  const handleSetTemplateValues = async (initializedTemplates = []) => {
    let values;
    if (member?.acc && !allowChangeTemplate) {
      values = member?.acc;
    } else {
      values = roleTemplates?.find((r) => r?.id == selectedRoleTemplate)?.acc;
    }
    if (!values) {
      setRoleTemplate(initializedTemplates);
      setAllowChangeTemplate(false);
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
                    DEFAULT_OFF_ACCESS.includes(item?.view?.param) && possibleItemViewValue === undefined
                      ? false
                      : possibleItemViewValue === undefined ? true
                        : possibleItemViewValue,
                },
                edit: {
                  param: item?.edit?.param,
                  description: item?.edit?.description,
                  value:
                    DEFAULT_OFF_ACCESS.includes(item?.edit?.param) && possibleItemEditValue === undefined
                      ? false
                      : possibleItemEditValue === undefined ? true
                        : possibleItemEditValue,
                },
                hide: {
                  param: item?.hide?.param,
                  description: item?.hide?.description,
                  value:
                    DEFAULT_OFF_ACCESS.includes(item?.hide?.param) && possibleItemHideValue === undefined
                      ? false
                      : possibleItemHideValue === undefined ? true
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
                    DEFAULT_OFF_ACCESS.includes(item?.view?.param) && possibleItemViewValue === undefined
                      ? false
                      : possibleItemViewValue === undefined ? true
                        : possibleItemViewValue,
                },
                edit: {
                  param: item?.edit?.param,
                  description: item?.edit?.description,
                  value:
                    DEFAULT_OFF_ACCESS.includes(item?.edit?.param) && possibleItemEditValue === undefined
                      ? false
                      : possibleItemEditValue === undefined ? true
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
                  value: DEFAULT_OFF_ACCESS.includes(item?.view?.param) && _possibleItemViewValue === undefined
                    ? false
                    : _possibleItemViewValue === undefined ? true
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
                    DEFAULT_OFF_ACCESS.includes(item?.edit?.param) && _possibleItemEditValue === undefined
                      ? false
                      : _possibleItemEditValue === undefined ? true
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
                    DEFAULT_OFF_ACCESS.includes(item?.hide?.param) && _possibleItemHideValue === undefined
                      ? false
                      : _possibleItemHideValue === undefined ? true
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
            value: DEFAULT_OFF_ACCESS.includes(temp?.view?.param) && possibleViewValue === undefined
            ? false
            : possibleViewValue === undefined ? true
              : possibleViewValue,
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
            value: DEFAULT_OFF_ACCESS.includes(temp?.edit?.param) && possibleEditValue === undefined
              ? false
              : possibleEditValue === undefined ? true
                : possibleEditValue,
          },
        };
      }

      return temp;
    });

    if (allowChangeTemplate) {
      const flattenedArray = [];

      templatesWithValues?.forEach((obj) => {
        flattenedArray.push({ ...obj, items: undefined }); // Include the original item without 'items'
        if (obj.items) {
          flattenedArray.push(...obj.items); // Include the 'items' if they exist
        }
      });

      const paramsArray = flattenedArray?.map((item) => {
        return { view: item?.view, edit: item?.edit };
      });

      const params = {};

      paramsArray?.forEach((item) => {
        if (item.view) {
          params[item?.view?.param] = item?.view?.value;
        }
        if (item.edit) {
          params[item?.edit?.param] = item?.edit?.value;
        }
      });

      await settingsApi.updateMember(member?.id, {
        acc: params,
        account_id: member?.id,
      });
    }
    setRoleTemplate(templatesWithValues);
    setAllowChangeTemplate(false);
  };

  const getRoleTemplates = async () => {
    try {
      const { temp_rolls: templates } = await settingsApi.getRoles();
      setRoleTemplates(templates);

      if (member?.role_temp_id) {
        setSelectedRoleTemplate(member?.role_temp_id);
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    const initializeRoleTemplate = async () => {
      try {
        // Start with a fresh deep clone
        let templateClone = deepClone(roleTemplateDefault);
        
        // Get custom fields
        const { client_fields: clientFields } = await customerFieldsApi.getCustomerFields();
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
                  param: `acc_custom_v_${field?.value}_${field?.option?.replace(/\s+/g, "_")}`,
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

          const existingItems = templateClone?.find((t) => t?.name === "Customers")?.items || [];
          const existingNames = new Set(existingItems.map(item => item.name));
          const newItems = clientFieldsTemplate.filter(item => !existingNames.has(item.name));
          if (newItems.length > 0) {
            templateClone
              ?.find((t) => t?.name === "Customers")
              ?.items?.push(...newItems);
          }
        }

        // Get company emails
        const { emails } = await companyEmailsApi.getCompanyEmails();
        if (emails?.length) {
          const emailsTemplate = emails?.map((email) => {
            return {
              name: `Company Email ${email?.email}`,
              view: {
                param: `acc_v_company_email_${email?.id}`,
                description: `User can view Company Email ${email?.email}`,
                value: true,
              },
            };
          });

          const companyEmailsSection = templateClone?.find((t) => t?.name === "Company Emails");
          if (companyEmailsSection) {
            companyEmailsSection.items = emailsTemplate;
          }
        }

        // Get transaction type options
        if (company?.trx_settings) {
          let trxSettings;
          try {
            trxSettings = JSON.parse(company.trx_settings);
          } catch (error) {
            console.error("Error parsing trx_settings:", error);
          }

          const transactionOptions = trxSettings?.options || [];
          if (transactionOptions?.length) {
            const transactionOptionsTemplate = transactionOptions?.map((option) => {
              return {
                name: `Transaction Type Option ${option}`,
                view: {
                  param: `acc_v_transaction_type_option_${option?.replace(/\s+/g, "_")}`,
                  description: `User can view Transaction Type Option ${option}`,
                  value: true,
                },
              };
            });

            const existingTransactionItems = templateClone?.find((t) => t?.name === "Risk Management")?.items || [];
            const existingTransactionNames = new Set(existingTransactionItems.map(item => item.name));
            const newTransactionItems = transactionOptionsTemplate.filter(item => !existingTransactionNames.has(item.name));
            if (newTransactionItems.length > 0) {
              templateClone
                ?.find((t) => t?.name === "Risk Management")
                ?.items?.push(...newTransactionItems);
            }
          }
        }

        // Set the complete template with all data
        handleSetTemplateValues(templateClone);
      } catch (error) {
        console.error(error);
        toast.error(error?.response?.data?.message);
      }
    };

    initializeRoleTemplate();
  }, [selectedRoleTemplate]);

  useEffect(() => {
    getRoleTemplates();
  }, []);

  useEffect(() => {
    if (company.acc) {
      setShieldAccess(company.acc);
    }
  }, [company]);

  const handleChangeTemplate = async (e) => {
    try {
      setAllowChangeTemplate(true);
      setSelectedRoleTemplate(e?.target?.value);

      const roleTemp = roleTemplates?.find(
        (temp) => temp?.id == e?.target?.value
      );

      const request = {
        role_temp_id: e?.target?.value,
        account_id: member?.id,
      };

      if (roleTemp) {
        request["acc"] = roleTemp?.acc;
      }

      await settingsApi.updateMember(member?.id, request);
      
      // Update frontend state with new template values
      if (roleTemp?.acc) {
        // Clone the current roleTemplate to avoid direct state mutation
        const updatedRoleTemplate = roleTemplate.map(template => {
          const updatedTemplate = { ...template };
          
          // Update main template permissions
          if (template.view && roleTemp.acc[template.view.param] !== undefined) {
            updatedTemplate.view = {
              ...template.view,
              value: roleTemp.acc[template.view.param]
            };
          }
          if (template.edit && roleTemp.acc[template.edit.param] !== undefined) {
            updatedTemplate.edit = {
              ...template.edit,
              value: roleTemp.acc[template.edit.param]
            };
          }
          if (template.hide && roleTemp.acc[template.hide.param] !== undefined) {
            updatedTemplate.hide = {
              ...template.hide,
              value: roleTemp.acc[template.hide.param]
            };
          }

          // Update child items permissions if they exist
          if (template.items) {
            updatedTemplate.items = template.items.map(item => {
              const updatedItem = { ...item };
              if (item.view && roleTemp.acc[item.view.param] !== undefined) {
                updatedItem.view = {
                  ...item.view,
                  value: roleTemp.acc[item.view.param]
                };
              }
              if (item.edit && roleTemp.acc[item.edit.param] !== undefined) {
                updatedItem.edit = {
                  ...item.edit,
                  value: roleTemp.acc[item.edit.param]
                };
              }
              if (item.hide && roleTemp.acc[item.hide.param] !== undefined) {
                updatedItem.hide = {
                  ...item.hide,
                  value: roleTemp.acc[item.hide.param]
                };
              }
              return updatedItem;
            });
          }
          
          return updatedTemplate;
        });

        setRoleTemplate(updatedRoleTemplate);
        
        // Update selected item if it exists in the new template
        if (selectedItem) {
          const updatedSelectedItem = updatedRoleTemplate.find(
            template => template.name === selectedItem.name
          );
          setSelectedItem(updatedSelectedItem);
        }
      }

      onGetMember();
      toast.success("Role template successfully changed!");
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setAllowChangeTemplate(false);
    }
  };

  const handleSetDefaultTemplate = async () => {
    try {
      setAllowChangeTemplate(true);
      // Always work with a fresh deep clone
      const templateClone = deepClone(roleTemplateDefault);
      const { client_fields: clientFields } =
        await customerFieldsApi.getCustomerFields();
      if (clientFields?.length) {
        const clientFieldsTemplate = clientFields?.map((field) => ({
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
        }));

        const multiChoiceOptions = [];
        // const multiChoiceFields = clientFields
        //   ?.filter((field) => field?.field_type === "multi_choice")
        //   ?.forEach((f) => {
        //     if (f?.setting) {
        //       const setting = JSON.parse(f?.setting);

        //       setting?.forEach((s) => {
        //         multiChoiceOptions.push({
        //           name: `Custom Data Field ${f?.friendly_name} option ${s?.option}`,
        //           view: {
        //             param: `acc_custom_v_${f?.value}_${s?.option?.replace(
        //               /\s+/g,
        //               "_"
        //             )}`,
        //             value: true,
        //           },
        //         });
        //       });
        //     }
        //   });

        const existingItems = templateClone?.find((t) => t?.name === "Customers")?.items || [];
        const existingNames = new Set(existingItems.map(item => item.name));
        const newItems = clientFieldsTemplate.filter(item => !existingNames.has(item.name));
        if (newItems.length > 0) {
          templateClone
            ?.find((t) => t?.name === "Customers")
            ?.items?.push(...newItems);
        }

        const existingMultiChoiceItems = templateClone?.find((t) => t?.name === "Customers")?.items || [];
        const existingMultiChoiceNames = new Set(existingMultiChoiceItems.map(item => item.name));
        const newMultiChoiceItems = multiChoiceOptions.filter(item => !existingMultiChoiceNames.has(item.name));
        if (newMultiChoiceItems.length > 0) {
          templateClone
            ?.find((t) => t?.name === "Customers")
            ?.items?.push(...newMultiChoiceItems);
        }
      }

      // Add transaction type options from company.trx_settings
      if (company?.trx_settings) {
        let trxSettings;
        try {
          trxSettings = JSON.parse(company.trx_settings);
        } catch (error) {
          console.error("Error parsing trx_settings:", error);
        }

        const transactionOptions = trxSettings?.options || [];

        if (transactionOptions?.length) {
          const transactionOptionsTemplate = transactionOptions?.map((option) => {
            return {
              name: `Transaction Type Option ${option}`,
              view: {
                param: `acc_v_transaction_type_option_${option?.replace(/\s+/g, "_")}`,
                description: `User can view Transaction Type Option ${option}`,
                value: true,
              },
            };
          });

          // Merge transactionOptionsTemplate with existing items, avoiding duplicates
          const existingTransactionItems = templateClone?.find((t) => t?.name === "Risk Management")?.items || [];
          const existingTransactionNames = new Set(existingTransactionItems.map(item => item.name));
          
          // Only add items that don't already exist
          const newTransactionItems = transactionOptionsTemplate.filter(item => !existingTransactionNames.has(item.name));
          
          if (newTransactionItems.length > 0) {
            templateClone
              ?.find((t) => t?.name === "Risk Management")
              ?.items?.push(...newTransactionItems);
          }
        }
      }

      const values = roleTemplates?.find(
        (r) => r?.id == selectedRoleTemplate
      )?.acc;
      if (!values) {
        setRoleTemplate(templateClone);
        setAllowChangeTemplate(false);
        return;
      }

      const templatesWithValues = templateClone?.map((temp) => {
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
                    value: possibleItemViewValue,
                  },
                  edit: {
                    param: item?.edit?.param,
                    description: item?.edit?.description,
                    value: possibleItemEditValue,
                  },
                  hide: {
                    param: item?.hide?.param,
                    description: item?.hide?.description,
                    value: possibleItemHideValue
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
                    value: possibleItemViewValue,
                  },
                  edit: {
                    param: item?.edit?.param,
                    description: item?.view?.description,
                    value: possibleItemEditValue,
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
                    value: _possibleItemViewValue,
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
                    value: _possibleItemEditValue,
                  },
                };
              }

              if (item.hide) {
                const _possibleItemHideValue = values[item?.hide?.param];
                return {
                  ...item,
                  hide: {
                    param: item?.hide?.param,
                    description: item?.hide?.description,
                    value: _possibleItemHideValue,
                  },
                };
              }

              return item;
            });

            return {
              ...temp,
              view: {
                param: temp?.view?.param,
                description: temp?.hide?.description,
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

      const flattenedArray = [];

      templatesWithValues?.forEach((obj) => {
        flattenedArray.push({ ...obj, items: undefined }); // Include the original item without 'items'
        if (obj.items) {
          flattenedArray.push(...obj.items); // Include the 'items' if they exist
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

      await settingsApi.updateMember(member?.id, {
        acc: params,
        account_id: member?.id,
        role_temp_id: selectedRoleTemplate,
      });

      setRoleTemplate(templatesWithValues);
      setAllowChangeTemplate(false);
      setSelectedItem(templatesWithValues?.find(template => template?.name === selectedItem?.name));
      toast.success("Access settings successfully reset to template!");

      setTimeout(() => {
        onGetMember();
      }, 1500);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message);
    }
  };

  const handleChangeTemplateValue = async (e, name, childName = null, type) => {
    try {
      const val = e?.target?.checked;

      const updatedRoleTemplates = roleTemplate?.map((template) => {
        if (template?.name === name) {
          if (childName) {
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
                }
                return item;
              }),
            };
          }
          return {
            ...template,
            [type]: {
              ...template[type],
              value: val,
            },
          };
        }
        return template;
      });

      setRoleTemplate(updatedRoleTemplates);

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
      
      await settingsApi.updateMember(member?.id, {
        acc: params,
        account_id: member?.id,
      });

      setSelectedItem(updatedRoleTemplates?.find(template => template?.name === selectedItem?.name));
      
      setTimeout(async() => {
        await onGetMember();
      }, 1500);
      toast.success("Access setting successfully updated!");
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message);
    }
  };

  const handleChangeShieldValue = async (accName, shieldValue) => {
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
  };

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

  const handleRemoveAccess = async (item = null) => {
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

      await settingsApi.updateMember(member?.id, {
        acc: params,
        account_id: member?.id,
      });

      if(item) {
        handleCloseRemoveAccessDialog();
      } else {
        handleCloseRemoveAllAccessDialog();
      }

      toast.success(item ? getDisplayName(item, company) + ' access has been removed successfully!' : 'All access has been removed successfully!');
      
      setSelectedItem(updatedRoleTemplates.find(template => template.name === selectedItem?.name));
      
      setTimeout(async() => {
        await onGetMember();
      }, 1500);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || 'Failed to remove all access');
    }
  };

  const handleEnableAccess = async (item = null) => {
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

      await settingsApi.updateMember(member?.id, {
        acc: params,
        account_id: member?.id,
      });

      if(item) {
        handleCloseRemoveAccessDialog();
      } else {
        handleCloseRemoveAllAccessDialog();
      }

      toast.success(item ? getDisplayName(item, company) + ' access has been enabled successfully!' : 'All access has been enabled successfully!');
      
      setSelectedItem(updatedRoleTemplates.find(template => template.name === selectedItem?.name));
      
      setTimeout(async() => {
        await onGetMember();
      }, 1500);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || 'Failed to enable all access');
    }
  };

  return (
    <form {...other}>
      <Card>
        <CardHeader 
          title="Edit Member Access" 
        />
        <CardContent sx={{ pt: 0 }}>
          <SettingsMemberAccessAISummary memberId={member?.id} />
          <Stack 
            direction={{ xs: 'column', xl: 'row' }} 
            justifyContent={'space-between'} 
            alignItems={{ xs: 'flex-start', xl: 'center' }} 
            mt={2}
            sx={{ flexWrap: 'wrap', gap: 2 }}
          >
            <Stack direction={'row'} alignItems={'center'} spacing={2}>
              <Stack direction={'row'} alignItems={'center'} spacing={2}>
                <Typography sx={{whiteSpace: 'nowrap'}}>Role template:</Typography>
                <Select
                  value={selectedRoleTemplate}
                  sx={{ width: { md: 230, xs: 150 }, height: 45 }}
                  onChange={handleChangeTemplate}
                  onOpen={getRoleTemplates}
                >
                  {roleTemplates?.map((temp) => (
                    <MenuItem value={temp?.id} key={temp?.id}>
                      {temp?.name}
                    </MenuItem>
                  ))}
                </Select>
              </Stack>
              {member?.acc_edited && (
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent={"center"}
                  sx={{ mt: 3, minHeight: 40, width: 40 }}
                >
                  {/* <Typography sx={{ opacity: ".8" }}>
                    Access is edited manually
                  </Typography> */}
                  {allowChangeTemplate?
                    <CircularProgress size={24}/>
                    :
                    <Tooltip 
                      arrow
                      title="Reset"
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
                      <IconButton
                        onClick={handleSetDefaultTemplate}
                        sx={{ color:'primary.disabled', backgroundColor:'primary.alpha8', '&:hover': { color: 'primary.main' }}}
                      >
                        <Iconify icon="ic:baseline-reset-tv" width={24}/>
                      </IconButton>
                    </Tooltip>
                  }
                </Stack>
              )}
            </Stack>
            <Stack direction={'row'} alignItems={'center'} justifyContent={{xs: 'flex-start', md: 'flex-end'}} spacing={2}>
              <Button
                color="error"
                variant="contained"
                onClick={handleOpenRemoveAllAccessDialog}
                startIcon={<Iconify icon="mdi:shield-off" sx={{ width: 20 }} />}
                size="small"
                sx={{whiteSpace: 'nowrap'}}
              >
                <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                  Remove All Access
                </Box>
                <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                  Remove
                </Box>
              </Button>
              <Button
                color="primary"
                variant="contained"
                onClick={() => handleEnableAccess()}
                startIcon={<Iconify icon="mdi:shield-check" sx={{ width: 20 }} />}
                size="small"
                sx={{whiteSpace: 'nowrap'}}
              >
                <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                  Enable All Access
                </Box>
                <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                  Enable
                </Box>
              </Button>
            </Stack>
          </Stack>

          <Grid container spacing={3} sx={{ mt: {xs: 2.5, md: 1}, marginLeft: '-16px !important', marginRight: '-16px !important' }}>
            <Grid xs={12} xl={3}>
              <Box sx={{ display: { xs: 'none', md: 'none', xl: 'block' } }}>
                <TreeView
                  templates={roleTemplate}
                  onItemSelect={handleItemSelect}
                  selectedItem={selectedItem}
                  searchQuery={searchQuery}
                  debouncedSearchQuery={debouncedSearchQuery}
                  onSearchChange={handleSearchChange}
                  company={company}
                />
              </Box>
              <Box sx={{ display: { xs: 'block', md: 'block', xl: 'none' } }}>
                <Autocomplete
                  fullWidth
                  options={roleTemplate.filter(template => {
                    if (company?.company_type !== 2 && company?.company_wallet_system) return true;
                    
                    const hiddenAccesses = [
                      "acc_v_client_position",
                      "acc_e_client_create_position",
                      "acc_e_risk_position",
                      "acc_v_risk_position",
                      "acc_v_export_positions",
                    ];

                    const betsHiddenAccesses = [
                      "acc_v_risk_bets",
                      "acc_v_bets_id",
                      "acc_v_bets_client_id",
                      "acc_v_bets_bet_id",
                      "acc_v_bets_external_brand",
                      "acc_v_bets_external_user_id",
                      "acc_v_bets_bet_type",
                      "acc_v_bets_bet_category",
                      "acc_v_bets_bet_amount",
                      "acc_v_bets_win_amount",
                      "acc_v_bets_potential_win",
                      "acc_v_bets_currency",
                      "acc_v_bets_status",
                      "acc_v_bets_settlement_status",
                      "acc_v_bets_total_odds",
                      "acc_v_bets_selection_count",
                      "acc_v_bets_account_id",
                      "acc_v_bets_desk_id",
                      "acc_v_bets_platform",
                      "acc_v_bets_timing",
                      "acc_v_bets_bet_date",
                      "acc_v_bets_settlement_date",
                      "acc_v_bets_real_balance_before",
                      "acc_v_bets_real_balance_after",
                      "acc_v_bets_bonus_balance_before",
                      "acc_v_bets_bonus_balance_after",
                      "acc_v_bets_sport_data",
                      "acc_v_bets_competitors",
                      "acc_v_bets_webhook_data",
                      "acc_v_bets_description",
                      "acc_v_bets_is_live",
                      "acc_v_bets_is_virtual",
                      "acc_v_bets_is_cash_out",
                      "acc_v_bets_event_date",
                      "acc_v_bets_source_system",
                      "acc_v_bets_processing_status",
                      "acc_v_bets_created_at",
                      "acc_e_bets",
                      "acc_e_delete_bets",
                      "acc_e_create_bets",
                    ];

                    const walletHiddenAccesses = [
                      "acc_v_client_wallet",
                      "acc_e_client_walletl",
                      "acc_v_client_refresh_wallets",
                      "acc_v_risk_wallet_transactions",
                      "acc_v_wallet",
                      "acc_v_active_wallets",
                      "acc_v_inactive_wallets",
                    ];
                    
                    const shouldHideAccess = (param) => {
                      const isCompanyType2 = company?.company_type === 2 && hiddenAccesses.includes(param);
                      const isCompanyType1 = company?.company_type === 1 && betsHiddenAccesses.includes(param);
                      const isWalletDisabled = !company?.company_wallet_system && walletHiddenAccesses.includes(param);
                      return isCompanyType2 || isCompanyType1 || isWalletDisabled;
                    };
                    
                    const hasVisibleItems = template?.items?.some(item => {
                      const param = item.view ? item.view.param : item.edit ? item.edit.param : item.hide?.param;
                      return !shouldHideAccess(param);
                    });
                    
                    const hasVisibleMainPermission = (template?.view && !shouldHideAccess(template.view.param)) ||
                                                   (template?.edit && !shouldHideAccess(template.edit.param)) ||
                                                   (template?.hide && !shouldHideAccess(template.hide.param));
                    
                    return hasVisibleItems || hasVisibleMainPermission;
                  })}
                  autoHighlight
                  onChange={(event, value) => {
                    if (value) handleItemSelect(value);
                  }}
                  getOptionLabel={(option) => getDisplayName(option, company)}
                  renderOption={(props, option) => (
                    <li {...props} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Iconify icon="fluent:shield-32-filled" width={20} style={{ marginRight: 4 }} color={selectedItem?.name === option?.name ? 'primary.main' : 'text.secondary'} />
                      <span>{getDisplayName(option, company)}</span>
                    </li>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Iconify icon="mdi:account-badge-outline" width={20} style={{ marginRight: 4 }} />
                          Select Permission
                        </span>
                      }
                    />
                  )}
                />
              </Box>
            </Grid>
            
            <Grid xs={12} xl={9}>
              <DetailView
                selectedItem={selectedItem}
                shieldAccess={shieldAccess}
                user={user}
                onChangeValue={handleChangeTemplateValue}
                onChangeShieldValue={handleChangeShieldValue}
                onEnableAccess={handleEnableAccess}
                onOpenRemoveAccessDialog={handleOpenRemoveAccessDialog}
                company={company}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

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
        <DialogTitle sx={{ px: 3, pt: 3 }}>Remove {getDisplayName(selectedItem, company)} Access</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to remove {getDisplayName(selectedItem, company)} access? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleCloseRemoveAccessDialog} color="inherit">
            Cancel
          </Button>
                      <Button onClick={() => handleRemoveAccess(selectedItem)} color="error" variant="contained">
              Remove {getDisplayName(selectedItem, company)} Access
            </Button>
        </DialogActions>
      </Dialog>
    </form>
  );
};

export default SettingsMemberAccessEdit;
