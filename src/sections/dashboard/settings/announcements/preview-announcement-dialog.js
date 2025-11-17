import PropTypes from 'prop-types';
import {
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  Box,
} from '@mui/material';
import { getAPIUrl } from "src/config";

import { Close as CloseIcon } from '@mui/icons-material';
export const PreviewAnnouncementDialog = (props) => {
  const { open, onClose, announcement } = props;

  if (!announcement) {
    return null;
  }

  const settings = announcement.settings ? JSON.parse(announcement.settings) : null;
  
  const imageUrl = announcement?.image;
  const finalImageUrl = imageUrl 
    ? imageUrl.includes('http') 
      ? imageUrl 
      : `${getAPIUrl()}${imageUrl}`
    : null;
  
  const isFullscreenImage = settings?.fullscreen_image !== false;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          background: 'transparent',
          boxShadow: 'none',
          overflow: 'visible'
        }
      }}
    >
      <DialogContent
        sx={{
          p: 0,
          overflow: 'visible',
          borderRadius: 3,
          position: 'relative',
          bgcolor: '#0A1929'
        }}
      >
        <Box
          sx={{
            height: '100%',
            width: '100%',
            minHeight: 360,
            position: 'relative',
            borderRadius: 3,
            overflow: 'hidden',
            backgroundColor: '#0A1929',
            ...(isFullscreenImage && {
              backgroundImage: finalImageUrl ? `url(${finalImageUrl})` : 'none',
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
            })
          }}
        >
          {!isFullscreenImage && finalImageUrl && (
            <Box
              sx={{
                width: '100%',
                height: 200,
                backgroundImage: `url(${finalImageUrl})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
              }}
            />
          )}

          <IconButton
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 16,
              top: 16,
              color: 'white',
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.2)'
              },
              zIndex: 50
            }}
          >
            <CloseIcon />
          </IconButton>

          <Box
            sx={{
              position: isFullscreenImage ? 'absolute' : 'relative',
              bottom: 0,
              left: 0,
              right: 0,
              p: 3,
              pt: isFullscreenImage ? 6 : 3,
              background: isFullscreenImage 
                ? 'linear-gradient(to top, rgba(10, 25, 41, 0.95), rgba(10, 25, 41, 0))'
                : 'transparent',
              color: 'white',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <Typography 
              variant="h5" 
              sx={{ 
                fontSize: '1.25rem',
                fontWeight: 600,
                mb: 1,
                maxWidth: '90%',
                margin: '0 auto 8px'
              }}
            >
              {announcement.title}
            </Typography>
            <div
              dangerouslySetInnerHTML={{ __html: announcement.description }}
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                maxWidth: '90%',
                margin: '0 auto 16px',
                fontSize: '0.875rem',
                lineHeight: 1.5
              }}
            />
            {settings?.link && (
              <Box
                component="button"
                onClick={() => window.open(settings.link, '_blank')}
                sx={{
                  mt: 2,
                  py: 1.5,
                  px: 4,
                  border: 'none',
                  borderRadius: 1.5,
                  backgroundColor: settings.link_color || '#2196f3',
                  color: 'white',
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'opacity 0.2s',
                  width: '80%',
                  maxWidth: 280,
                  '&:hover': {
                    opacity: 0.9
                  }
                }}
              >
                {settings.link_text || 'Learn More'}
              </Box>
            )}
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

PreviewAnnouncementDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  announcement: PropTypes.object
}; 