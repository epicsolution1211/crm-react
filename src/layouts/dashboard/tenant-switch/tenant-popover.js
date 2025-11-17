import { useMemo, useState } from "react";
import toast from "react-hot-toast";

import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Popover from "@mui/material/Popover";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { ServerDialog } from "./server-dialog";
import { Iconify } from "src/components/iconify";
import { ConfirmDialog } from "src/components/confirm-dialog-2";
import { useAuth } from "src/hooks/use-auth";
import { useRouter } from "src/hooks/use-router";
import { paths } from "src/paths";

export const TenantPopover = ({
    anchorEl,
    onClose,
    open = false,
    switchCompany,
  }) => {
  const currentCompany = JSON.parse(localStorage.getItem("company"));
  const tenants = localStorage.getItem("tenants") ? JSON.parse(localStorage.getItem("tenants")) : [];

  const { signOut } = useAuth();
  const router = useRouter();

  const [serverModal, setServerModal] = useState(false);

  const [selectedServerCode, setSelectedServerCode] = useState(null);
  const [isOpenConfirm, setIsOpenConfirm] = useState(false);

  const groupedTenants = useMemo(() => {
    return tenants.reduce((acc, tenant) => {
      const code = tenant.server_code || "Unknown";
      if (!acc[code]) acc[code] = [];
      acc[code].push(tenant);
      return acc;
    }, {});
  }, [tenants]);

  const getAvatarUrl = (tenant) => {
    const serverUrl = tenant?.server_url;
    const cleanServerUrl = serverUrl?.endsWith('/api') ? serverUrl.slice(0, -4) : serverUrl;
    return tenant?.company?.avatar ? `${cleanServerUrl}/${tenant?.company?.avatar}` : "";
  };

  const handleDeleteTenant = () => {
    const updatedTenants = tenants.filter(tenant => tenant?.server_code !== selectedServerCode);
    localStorage.setItem("tenants", JSON.stringify(updatedTenants));

    if(selectedServerCode === currentCompany.serverCode) {
      signOut();
      router.push(paths.auth.jwt.login);
    }

    setIsOpenConfirm(false);
    toast.success(`Server removed successfully!`); 
  };

  return (
    <>
      <Popover
        anchorEl={anchorEl}
        anchorOrigin={{
          horizontal: "right",
          vertical: "bottom",
        }}
        disableScrollLock
        transformOrigin={{
          horizontal: "right",
          vertical: "top",
        }}
        keepMounted
        onClose={onClose}
        open={open}
        PaperProps={{ 
          sx: { 
            width: 262, 
            left: '8px !important',
            p: 0.5,
        }}}
      >
        {Object.entries(groupedTenants)?.map(([serverCode, groupTenants]) => (
          <div key={`server-group-${serverCode}`}>
            <Stack 
              key={`server-code-label-${serverCode}`} 
              direction="row" 
              alignItems="center" 
              justifyContent="space-between"
              py={0.5}
              px={1}
              sx={{
                borderBottom: '1px dashed',
                borderColor: 'divider',
              }}
            >
              <Typography
                variant="subtitle2"
                color="text.secondary"
                fontWeight={600}
              >
                {serverCode}
              </Typography>
              <IconButton
                size="small"
                sx={{
                  color: 'text.disabled',
                  '&:hover': {
                    color: 'white',
                    bgcolor: 'action.hover',
                  },
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedServerCode(serverCode);
                  setIsOpenConfirm(true);
                }}
              >
                <Iconify icon="iconamoon:close-fill" width={20} />
              </IconButton>
            </Stack>
            
            {groupTenants.map((tenant, tIdx) => (
              <MenuItem
                key={`tenant-menuitem-${serverCode}-${tenant?.company?.id || tIdx}`}
                onClick={() => switchCompany?.(tenant)}
                selected={tenant?.company?.id == currentCompany?.companyId && tenant?.company?.name == currentCompany?.companyName}
                sx={{ 
                  borderRadius: 1, 
                  mt: 0.5, 
                  py: 0.2,
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center' 
                }}
              >
                <Stack direction="row" alignItems="center" py={1} spacing={1}>
                  {tenant?.company?.avatar ? (
                    <Avatar
                      src={getAvatarUrl(tenant)}
                      sx={{ width: 25, height: 25 }} 
                    />
                  ) : (
                    <Stack sx={{ minWidth: 25 }} />
                  )}
                  <Typography>{tenant?.company?.name}</Typography>
                </Stack>
              </MenuItem>
            ))}
          </div>
        ))}
        <Divider sx={{ my: 0.5 }} />
        <Stack
          direction="row"
          alignItems="center"
          sx={{
            px: 2,
            py: 1,
            gap: 1.5,
            borderRadius: 1,
            cursor: 'pointer',
            transition: 'background 0.2s',
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          }}
          onClick={() => {
            setServerModal(true);
          }}
        >
          <Iconify icon="formkit:add" width={18} />
          <Typography
            variant="body2"
            color="text.primary"
            sx={{ fontWeight: 500 }}
          >
            Add Server
          </Typography>
        </Stack>
      </Popover>

      {serverModal &&(
        <ServerDialog 
          open={serverModal} 
          onClose={() => setServerModal(false)} 
        />
      )}
      
      {isOpenConfirm && (
        <ConfirmDialog
          open={isOpenConfirm}
          onClose={() => setIsOpenConfirm(false)} 
          title="Leave Server"
          confirmLabel="Leave"
          description={`Are you sure you want to remove this Server (${selectedServerCode}) ?`}
          confirmAction={handleDeleteTenant}
        />
      )}
    </>
  );
};
