import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";

import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Typography from "@mui/material/Typography";
import Grid from "@mui/system/Unstable_Grid/Grid";

import { settingsApi } from "src/api/settings";
import { useDebounce } from "src/hooks/use-debounce";
import { RolesTable } from "./roles-table";
import { AddRoleModal } from "./add-role-modal";
import { Iconify } from "src/components/iconify";

export const Roles = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [roleTemplates, setRoleTemplates] = useState([]);
  const [originTemplates, setOriginTemplates] = useState([]);
  const [search, setSearch] = useState("");
  const [addRoleOpen, setAddRoleOpen] = useState(false);
  const query = useDebounce(search, 300);

  const getRoleTemplates = async () => {
    try {
      setIsLoading(true);
      const res = await settingsApi.getRoles({ q: query?.length > 0 ? query : null, });
      setOriginTemplates(res?.temp_rolls);
      setRoleTemplates(res?.temp_rolls);
      setIsLoading(false);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  const handleRoleSearch = useCallback(
    (e) => {
      setSearch(e.target.value);
    },
    [setSearch]
  );

  // const handleGoEditRole = (id) => router.push(paths.dashboard.roles.edit.replace(":roleId", id));

  useEffect(() => {
    if(query?.length > 0 ) {
      setRoleTemplates(originTemplates?.filter((template)=> (template?.name?.toLowerCase())?.includes(query?.toLowerCase())));
    } else {
      setRoleTemplates(originTemplates);
    }
  }, [query, originTemplates]);

  useEffect(() => {
    getRoleTemplates();
  }, [])

  return (
    <Card>
      <CardHeader title={<Typography variant="h5">Role Templates</Typography>} />
      <CardContent>
        <Grid container spacing={3}>
          <Grid xs={12} md={12} sx={{ mt: 3 }}>
            <Stack spacing={3}>
            <Stack sx={{ flexDirection: { md: 'row', xs: 'column'}, gap: { md: 4, xs: 2 }}} >
                <Stack direction='row' alignItems="center" spacing={1}>
                  <Iconify icon="material-symbols:info-outline" size={13} sx={{ flex: 'none'}}/>
                  <Typography color="text.primary" fontSize={13}>
                    Create access list templates to define permissions for data and functions within the system. An access list specifies what a user can view, edit, or perform, including access to clients, reports, settings, and other system functions. When a template is edited, the changes will automatically apply to all users assigned to that template.
                  </Typography>
                </Stack>
                <Stack
                  alignItems="center"
                  justifyContent="flex-end"
                  sx={{ flexDirection: { md: 'row', xs: 'column'}, gap: 2 }}
                >
                  <Button
                    sx={{ whiteSpace: 'nowrap', width: { md: 'auto', xs: 1}}}
                    startIcon={<Iconify icon="lucide:plus" width={24} />}
                    variant="contained"
                    onClick={() => setAddRoleOpen(true)}
                  >
                    Add Role Template
                  </Button>
                </Stack>
              </Stack>
              <TextField
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify icon="lucide:search" color="text.secondary" width={24} />
                    </InputAdornment>
                  ),
                }}
                label="Search"
                onChange={handleRoleSearch}
                placeholder="Search role templates..."
                value={search}
              />
              <RolesTable
                items={roleTemplates}
                count={10}
                page={1}
                isLoading={isLoading}
                rowsPerPage={1000}
                onGetRoles={getRoleTemplates}
              />
            </Stack>
          </Grid>
        </Grid>
      </CardContent>

      <AddRoleModal
        open={addRoleOpen}
        onClose={() => setAddRoleOpen(false)}
        onGetRoles={getRoleTemplates}
      />
    </Card>
  );
};
