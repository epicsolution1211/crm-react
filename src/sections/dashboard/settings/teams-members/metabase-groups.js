import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { MetabaseGroupsTable } from "./metabase-groups-table";
import { AddMetabaseGroupModal } from "./add-metabase-group-modal";
import { EditMetabaseGroupModal } from "./edit-metabase-group-modal";
import { metabaseApi } from "src/api/metabase";
import { useDebounce } from "src/hooks/use-debounce";
import { useAuth } from 'src/hooks/use-auth';
import { Iconify } from 'src/components/iconify';

export const MetabaseGroups = () => {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groups, setGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const { user } = useAuth();

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const getMetabaseGroups = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await metabaseApi.getMetabaseGroups();
      setGroups(response?.reports || []);
      setFilteredGroups(response?.reports || []);
    } catch (error) {
      console.error("Error fetching metabase groups:", error);
      toast.error("Failed to load metabase groups");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getMetabaseGroups();
  }, [getMetabaseGroups]);

  useEffect(() => {
    if (debouncedSearchQuery) {
      const filtered = groups.filter((group) =>
        group.name?.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
      );
      setFilteredGroups(filtered);
    } else {
      setFilteredGroups(groups);
    }
  }, [debouncedSearchQuery, groups]);

  const handleOpenAddModal = useCallback(() => {
    setOpenAddModal(true);
  }, []);

  const handleCloseAddModal = useCallback(() => {
    setOpenAddModal(false);
  }, []);

  const handleOpenEditModal = useCallback((group) => {
    setSelectedGroup(group);
    setOpenEditModal(true);
  }, []);

  const handleCloseEditModal = useCallback(() => {
    setSelectedGroup(null);
    setOpenEditModal(false);
  }, []);

  const handleAddGroup = useCallback(async (groupData) => {
    try {
      await metabaseApi.createMetabaseGroup(groupData);
      toast.success("Metabase group successfully created!");
      getMetabaseGroups();
      handleCloseAddModal();
    } catch (error) {
      console.error("Error creating metabase group:", error);
      toast.error(error?.response?.data?.message || "Failed to create metabase group");
    }
  }, [getMetabaseGroups, handleCloseAddModal, user?.metabase_account_id]);

  const handleUpdateGroup = useCallback(async (groupData) => {
    try {
      await metabaseApi.updateMetabaseGroup(selectedGroup.id, groupData);
      toast.success("Metabase group successfully updated!");
      getMetabaseGroups();
      handleCloseEditModal();
    } catch (error) {
      console.error("Error updating metabase group:", error);
      toast.error(error?.response?.data?.message || "Failed to update metabase group");
    }
  }, [selectedGroup, getMetabaseGroups, handleCloseEditModal, user?.metabase_account_id]);

  const handleDeleteGroup = useCallback(async (groupId) => {
    setIsDeleteLoading(true);
    try {
      await metabaseApi.deleteMetabaseGroup(groupId);
      toast.success("Metabase group successfully deleted!");
      getMetabaseGroups();
    } catch (error) {
      console.error("Error deleting metabase group:", error);
      toast.error(error?.response?.data?.message || "Failed to delete metabase group");
    } finally {
      setIsDeleteLoading(false);
    }
  }, [getMetabaseGroups]);

  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  return (
    <Card>
      <CardHeader title={<Typography variant="h5">Report Groups</Typography>} />

      <CardContent>
        <Grid container spacing={3} sx={{ pl: 2.5 }}>
          <Grid xs={12} md={12} sx={{ mt: 3 }}>
            <Stack spacing={3}>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography color="text.primary" fontSize={13}>
                    Manage Metabase report groups for organizing and controlling access to reports and dashboards.
                  </Typography>
                </Stack>
                <Stack
                  alignItems="center"
                  justifyContent="flex-end"
                  direction="row"
                  spacing={2}
                >
                  <Button
                    startIcon={<Iconify icon="lucide:plus" width={24} />}
                    sx={{ whiteSpace: 'nowrap' }}
                    variant="contained"
                    onClick={handleOpenAddModal}
                  >
                    Add Report Group
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
                onChange={handleSearchChange}
                placeholder="Search report groups..."
                value={searchQuery}
              />
              <MetabaseGroupsTable
                items={filteredGroups}
                isLoading={isLoading}
                onEdit={handleOpenEditModal}
                onDelete={handleDeleteGroup}
                isDeleteLoading={isDeleteLoading}
              />
            </Stack>
          </Grid>
        </Grid>
      </CardContent>

      <AddMetabaseGroupModal
        open={openAddModal}
        onClose={handleCloseAddModal}
        onSubmit={handleAddGroup}
      />
      
      <EditMetabaseGroupModal
        open={openEditModal}
        onClose={handleCloseEditModal}
        onSubmit={handleUpdateGroup}
        group={selectedGroup}
      />
    </Card>
  );
};