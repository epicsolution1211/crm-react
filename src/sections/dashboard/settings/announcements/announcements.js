import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { Fragment, useCallback, useEffect, useState } from "react";
import { Scrollbar } from "src/components/scrollbar";
import { announcementsApi } from "src/api/announcements";
import { AnnouncementsTable } from "./announcements-table";
import { AddAnnouncementDialog } from "./add-announcement-dialog";
import { PreviewAnnouncementDialog } from './preview-announcement-dialog';
import toast from "react-hot-toast";

export const Announcements = ({ brandId }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [announcements, setAnnouncements] = useState([]);
  const [count, setCount] = useState(0);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [previewAnnouncement, setPreviewAnnouncement] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchAnnouncements = useCallback(async () => {
    setLoading(true);
    try {
      const response = await announcementsApi.getAnnouncements({
        page: page + 1,
        per_page: rowsPerPage,
      });
      setAnnouncements(response?.announcements || []);
      setCount(response?.total_count || 0);
    } catch (err) {
      console.error('Error fetching announcements:', err);
      toast.error('Failed to fetch announcements');
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage]);

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  const handlePageChange = useCallback((event, newPage) => {
    setPage(newPage);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  const handleAddClick = useCallback(() => {
    setIsAddDialogOpen(true);
  }, []);

  const handleDialogClose = useCallback(() => {
    setIsAddDialogOpen(false);
  }, []);

  const handleCreateAnnouncement = useCallback(async (formData) => {
    await announcementsApi.createAnnouncement(formData);
    toast.success('Announcement created successfully');
    setTimeout(async () => {
      await fetchAnnouncements();
    }, 1000);
  }, [fetchAnnouncements]);

  const handleEditClick = useCallback(async (announcement) => {
    try {
      const response = await announcementsApi.getAnnouncement(announcement.id);
      setSelectedAnnouncement(response?.announcement);
      setIsEditDialogOpen(true);
    } catch (err) {
      console.error('Error fetching announcement details:', err);
    }
  }, []);

  const handleUpdateAnnouncement = useCallback(async (id, formData) => {
    await announcementsApi.updateAnnouncement(id, formData);
    toast.success('Announcement updated successfully');
    setIsEditDialogOpen(false);
    setSelectedAnnouncement(null);
    setTimeout(async () => {
      await fetchAnnouncements();
    }, 1000);
  }, [fetchAnnouncements]);

  const handleDeleteAnnouncement = useCallback(async (id) => {
    try {
      await announcementsApi.deleteAnnouncement(id);
      toast.success('Announcement deleted successfully');
      setTimeout(async () => {
        await fetchAnnouncements();
      }, 1000);
    } catch (err) {
      console.error('Error deleting announcement:', err);
    }
  }, [fetchAnnouncements]);

  const handleEditDialogClose = useCallback(() => {
    setIsEditDialogOpen(false);
    setSelectedAnnouncement(null);
  }, []);

  const handlePreviewClick = useCallback(async (announcement) => {
    try {
      const response = await announcementsApi.getAnnouncement(announcement.id);
      setPreviewAnnouncement(response?.announcement);
      setIsPreviewDialogOpen(true);
    } catch (err) {
      console.error('Error fetching announcement details:', err);
    }
  }, []);

  const handlePreviewDialogClose = useCallback(() => {
    setIsPreviewDialogOpen(false);
    setPreviewAnnouncement(null);
  }, []);

  return (
    <Fragment>
      <Scrollbar sx={{ height: 1, pb: 3 }}>
        <Stack sx={{ width: 1, mt: 2 }}>
          <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ mb: 2 }}>
            <Button 
              variant="contained"
              onClick={handleAddClick}
            >
              + Add
            </Button>
          </Stack>
          <Stack sx={{ pl: 2 }}>
            <AnnouncementsTable
              count={count}
              items={announcements}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              page={page}
              rowsPerPage={rowsPerPage}
              onEdit={handleEditClick}
              onDelete={handleDeleteAnnouncement}
              onPreview={handlePreviewClick}
              loading={loading}
            />
          </Stack>
        </Stack>
      </Scrollbar>
      <AddAnnouncementDialog
        open={isAddDialogOpen}
        onClose={handleDialogClose}
        onSubmit={handleCreateAnnouncement}
        brandId={brandId}
      />
      <AddAnnouncementDialog
        open={isEditDialogOpen}
        onClose={handleEditDialogClose}
        onSubmit={handleUpdateAnnouncement}
        brandId={brandId}
        announcement={selectedAnnouncement}
      />
      <PreviewAnnouncementDialog
        open={isPreviewDialogOpen}
        onClose={handlePreviewDialogClose}
        announcement={previewAnnouncement}
      />
    </Fragment>
  );
};
