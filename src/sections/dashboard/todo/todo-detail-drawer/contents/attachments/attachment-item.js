import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { Iconify } from 'src/components/iconify';
import { bytesToSize } from 'src/utils/bytes-to-size';
import { getAPIUrl } from 'src/config';
import CircularProgress from '@mui/material/CircularProgress';

export const AttachmentItem = ({ attachment, onRemove, canRemove = false, isRemoveLoading = false }) => {
  const getFileExtension = (filename) => {
    if (!filename) return '';
    return filename.split('.').pop().toLowerCase();
  };

  const getFileIcon = (contentType, filename) => {
    const extension = getFileExtension(filename);
    
    if (contentType?.startsWith('image/')) {
      return 'solar:image-linear';
    }
    
    switch (extension) {
      case 'pdf':
        return 'solar:file-text-linear';
      case 'doc':
      case 'docx':
        return 'solar:file-text-linear';
      case 'xls':
      case 'xlsx':
        return 'solar:file-spreadsheet-linear';
      case 'ppt':
      case 'pptx':
        return 'solar:file-presentation-linear';
      case 'zip':
      case 'rar':
      case '7z':
        return 'solar:file-archive-linear';
      case 'mp4':
      case 'avi':
      case 'mov':
        return 'solar:video-linear';
      case 'mp3':
      case 'wav':
        return 'solar:music-notes-linear';
      default:
        return 'solar:file-linear';
    }
  };

  const handleDownload = () => {
    if (attachment.url) {
      const fullUrl = attachment.url.includes('http') 
        ? attachment.url 
        : `${getAPIUrl()}/${attachment.url}`;
      
      const link = document.createElement('a');
      link.href = fullUrl;
      link.download = attachment.name || 'download';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleRemove = () => {
    if (onRemove && canRemove) {
      onRemove(attachment.id);
    }
  };

  const isImage = attachment.content_type?.startsWith('image/');

  return (
    <Box
      sx={{
        position: 'relative',
        borderRadius: 1,
        border: '1px solid',
        borderColor: 'divider',
        p: 1.5,
        '&:hover': {
          borderColor: 'primary.main',
          backgroundColor: 'action.hover'
        }
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        {isImage ? (
          <Avatar
            src={attachment.url.includes('http') ? attachment.url : `${getAPIUrl()}/${attachment.url}`}
            variant="rounded"
            sx={{
              width: 48,
              height: 48,
              cursor: 'pointer'
            }}
            onClick={handleDownload}
          />
        ) : (
          <Avatar
            variant="rounded"
            sx={{
              width: 48,
              height: 48,
              backgroundColor: 'primary.light',
              cursor: 'pointer'
            }}
            onClick={handleDownload}
          >
            <Iconify 
              icon={getFileIcon(attachment.content_type, attachment.name)} 
              width={24}
              color="primary.main"
            />
          </Avatar>
        )}
        
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Typography
            variant="subtitle2"
            sx={{
              cursor: 'pointer',
              '&:hover': {
                color: 'primary.main',
              },
              transition: 'color 0.1s ease-in-out'
            }}
            onClick={handleDownload}
            noWrap
          >
            {attachment.name}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
          >
            {bytesToSize(attachment.size)}
            <span>•</span>
            {getFileExtension(attachment.name).toUpperCase()}
          </Typography>
        </Box>

        <Stack direction="row" spacing={0.5}>
          <Tooltip title="Download">
            <IconButton
              size="small"
              onClick={handleDownload}
              sx={{
                opacity: 1,
                '&:hover': {
                  backgroundColor: 'primary.light',
                  color: 'primary.main',
                  opacity: 0.7,
                  transition: 'all 0.2s ease-in-out'
                },
                transition: 'all 0.2s ease-in-out'
              }}
            >
              <Iconify icon="solar:download-linear" width={16} />
            </IconButton>
          </Tooltip>
          
          {canRemove && (
            <Tooltip title="Remove">
              <IconButton
                disabled={isRemoveLoading}
                size="small"
                onClick={handleRemove}
                color="error"
                sx={{
                  opacity: 1,
                  '&:hover': {
                    backgroundColor: 'error.light',
                    color: 'error.main',
                    opacity: 0.7,
                    transition: 'all 0.2s ease-in-out'
                  }
                }}
              >
                {isRemoveLoading ? (
                  <CircularProgress size={16} />
                ) : (
                  <Iconify icon="solar:trash-bin-trash-linear" width={16} />
                )}
              </IconButton>
            </Tooltip>
          )}
        </Stack>
      </Stack>
    </Box>
  );
};
