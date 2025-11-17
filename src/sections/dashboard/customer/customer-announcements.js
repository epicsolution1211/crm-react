/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import Box from "@mui/material/Box";
import CardHeader from "@mui/material/CardHeader";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import { Visibility as PreviewIcon } from '@mui/icons-material';
import { format } from 'date-fns';
import { Scrollbar } from 'src/components/scrollbar';
import { announcementsApi } from 'src/api/announcements';
import { PreviewAnnouncementDialog } from 'src/sections/dashboard/settings/announcements/preview-announcement-dialog';
import { TableNoData } from 'src/components/table-empty';
import { TableSkeleton } from 'src/components/table-skeleton';

export const CustomerAnnouncements = ({ customerId, onPreview }) => {
  const [announcements, setAnnouncements] = useState([]);
  const [count, setCount] = useState(0);
  const [previewAnnouncement, setPreviewAnnouncement] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  
  const getInitialAnnouncements = useCallback(async () => {
    setLoading(true);
    try {
      const response = await announcementsApi.getClientAnnouncements({
        client_id: customerId,
        page: 1,
        per_page: 500
      });
      setAnnouncements(response.announcements || []);
      setCount(response?.total_count || 0);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  const getAnnouncements = useCallback(async () => {
    try {
      const response = await announcementsApi.getClientAnnouncements({
        client_id: customerId,
        page: 1,
        per_page: 500
      });
      setAnnouncements(response.announcements || []);
      setCount(response?.total_count || 0);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  }, [customerId]);

  useEffect(() => {
    getInitialAnnouncements();

    const interval = setInterval(() => {
      getAnnouncements();
    }, 3000);

    return () => clearInterval(interval);
  }, [getAnnouncements, getInitialAnnouncements]);

  const handlePreview = async (announcementId) => {
    setPreviewLoading(true);
    try {
      const response = await announcementsApi.getAnnouncement(announcementId);
      setPreviewAnnouncement(response?.announcement);
    } catch (error) {
      console.error('Error fetching announcement details:', error);
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleClosePreview = () => {
    setPreviewAnnouncement(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return {
          color: 'warning',
          label: 'Pending'
        };
      case 'seen':
        return {
          color: 'info',
          label: 'Seen'
        };
      case 'expired':
        return {
          color: 'error',
          label: 'Expired'
        };
      default:
        return {
          color: 'default',
          label: 'Unknown'
        };
    }
  };

  return (
    <>
      <Card sx={{ pb: 2 }}>
        <CardHeader
          title="Announcements"
        />
        <Scrollbar>
          <Box sx={{ minWidth: 800 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Expires At</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableSkeleton rowCount={10} cellCount={5} />
                ) : announcements.length === 0 ? (
                  <TableNoData />
                ) : (
                  announcements.map((announcement) => {
                    const statusConfig = getStatusColor(announcement?.status);
                    return (
                      <TableRow hover key={announcement.id}>
                        <TableCell>{announcement.id}</TableCell>
                        <TableCell>{announcement.title}</TableCell>
                        <TableCell>
                          {announcement.expired_at 
                            ? format(new Date(announcement.expired_at), 'dd/MM/yyyy')
                            : '-'}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={statusConfig.label}
                            color={statusConfig.color}
                            size="small"
                            sx={{
                              fontWeight: 600,
                              minWidth: 72
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="Preview announcement" placement="top">
                              <IconButton 
                                size="small"
                                sx={{ 
                                  color: 'text.secondary',
                                  '&:hover': {
                                    backgroundColor: 'primary.lighter',
                                    color: 'primary.main'
                                  },
                                  transition: 'all 0.2s ease-in-out'
                                }}
                                onClick={() => handlePreview(announcement.id)}
                              >
                                <PreviewIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </Box>
        </Scrollbar>
      </Card>
      
      <PreviewAnnouncementDialog
        open={Boolean(previewAnnouncement)}
        onClose={handleClosePreview}
        announcement={previewAnnouncement}
        loading={previewLoading}
      />
    </>
  );
};

CustomerAnnouncements.propTypes = {
  customerId: PropTypes.string.isRequired,
  onPreview: PropTypes.func.isRequired
}; 