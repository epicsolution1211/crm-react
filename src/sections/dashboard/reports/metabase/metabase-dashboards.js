import React, { useState } from 'react';
import toast from 'react-hot-toast';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import Grid from "@mui/system/Unstable_Grid/Grid";
import LoadingButton from '@mui/lab/LoadingButton';

import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from "src/components/confirm-dialog-2";
import { CreateDashboardDialog } from './components/create-dashboard-dialog';
import { DashboardCard } from './components/dashboard-card';
import { DashboardSkeleton } from './components/dashboard-skeleton';
import { EditDashboardDialog } from './components/edit-dashboard-dialog';
import { ViewDashboardDialog } from './components/view-dashboard-dialog';
import { reportsApi } from 'src/api/reports';

// Main Component
export const MetabaseDashboards = ({
  searchQuery,
  setSearchQuery,
  filteredDashboards,
  isLoading,
  isValidating,
  mutate,
}) => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedDashboard, setSelectedDashboard] = useState(null);

  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const handleCreateDashboard = async (data) => {
    try {
      await reportsApi.createMetabaseDashboard(data);
      toast.success('Dashboard created successfully!');
      mutate(); // Refresh the data
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to create dashboard');
      console.error('Error creating dashboard:', err);
      throw err;
    }
  };

  const handleUpdateDashboard = async (data) => {
    try {
      await reportsApi.updateMetabaseDashboard(selectedDashboard.id, data);
      toast.success('Dashboard updated successfully!');
      mutate(); // Refresh the data
    } catch (err) {
      toast.error('Failed to update dashboard');
      console.error('Error updating dashboard:', err);
      throw err;
    }
  };

  const handleDeleteDashboard = async () => {
    setIsDeleteLoading(true);
    try {
      await reportsApi.deleteMetabaseDashboard(selectedDashboard.id);
      toast.success('Dashboard deleted successfully!');
      setTimeout(() => {
        mutate(); // Refresh the data
      }, 500);
    } catch (err) {
      toast.error('Failed to delete dashboard');
      console.error('Error deleting dashboard:', err);
    } finally {
      setDeleteDialogOpen(false);
      setSelectedDashboard(null);
      setIsDeleteLoading(false);
    }
  };

  const handleEdit = (dashboard) => {
    setSelectedDashboard(dashboard);
    setEditDialogOpen(true);
  };

  const handleDelete = (dashboard) => {
    setSelectedDashboard(dashboard);
    setDeleteDialogOpen(true);
  };

  const handleView = (dashboard) => {
    setSelectedDashboard(dashboard);
    setViewDialogOpen(true);
  };

  const handleCreateNew = () => {
    setCreateDialogOpen(true);
  };

  const handleRefresh = () => {
    mutate();
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  return (
    <Container maxWidth="xxl">
      <Stack spacing={3}>
        <Box display="flex" alignItems="center" justifyContent="space-between" gap={2}>
          <Stack direction="row" alignItems="center" gap={2} width={1}>
            <OutlinedInput
              fullWidth
              sx={{ width: 1 }}
              placeholder="Search dashboards by title, description, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              startAdornment={
                <InputAdornment position="start">
                  <Iconify icon="uil:search" width={24} color="action"/>
                </InputAdornment>
              }
              endAdornment={
                searchQuery && (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={handleClearSearch}
                      edge="end"
                    >
                      <Iconify icon="iconamoon:close-duotone" width={24} />
                    </IconButton>
                  </InputAdornment>
                )
              }
            />
          </Stack>
          <Box display="flex" gap={2}>
            <LoadingButton
              loading={isValidating && !isLoading}
              disabled={isLoading}
              variant="outlined"
              startIcon={<Iconify icon="solar:refresh-line-duotone" width={24} />}
              onClick={handleRefresh}
              sx={{ whiteSpace: 'nowrap', height: 50 }}
            >
              Refresh
            </LoadingButton>
            <Button 
              variant="contained"
              disabled={isLoading}
              startIcon={<Iconify icon="majesticons:plus-line" width={24} />}
              onClick={handleCreateNew}
              sx={{ whiteSpace: 'nowrap', height: 50 }}
            >
              Create Dashboard
            </Button>
          </Box>
        </Box>

        {isLoading ? (
          <DashboardSkeleton count={8} />
        ) : filteredDashboards.length === 0 ? (
          <Card>
            <CardContent>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                py={6}
                textAlign="center"
              >
                <Iconify icon="picon:board" width={64} mb={2} color="text.secondary"/>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  {searchQuery ? 'No Dashboards Found' : 'No Dashboards Found'}
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                  {searchQuery 
                    ? `No dashboards match your search for "${searchQuery}". Try a different search term.`
                    : 'Get started by creating your first Metabase dashboard.'
                  }
                </Typography>
                {searchQuery ? (
                  <Button
                    variant="outlined"
                    onClick={handleClearSearch}
                    startIcon={<Iconify icon="iconamoon:close-duotone" width={24} />}
                  >
                    Clear Search
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    startIcon={<Iconify icon="si:add-duotone" width={24} />}
                    onClick={handleCreateNew}
                  >
                    Create Your First Dashboard
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {filteredDashboards?.map((dashboard) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={dashboard.id}>
                <DashboardCard
                  dashboard={dashboard}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onView={handleView}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Stack>

      <CreateDashboardDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSubmit={handleCreateDashboard}
      />

      <EditDashboardDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        dashboard={selectedDashboard}
        onSubmit={handleUpdateDashboard}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setSelectedDashboard(null);
        }} 
        title="Delete Dashboard"
        description="Are you sure want to delete this dashboard? This action cannot be undone."
        confirmAction={handleDeleteDashboard} 
        isLoading={isDeleteLoading}
      />

      <ViewDashboardDialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        dashboard={selectedDashboard}
      />
    </Container>
  );
};