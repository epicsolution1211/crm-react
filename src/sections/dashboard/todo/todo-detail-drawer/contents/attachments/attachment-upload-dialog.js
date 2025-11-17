import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { Iconify } from 'src/components/iconify';
import { bytesToSize } from 'src/utils/bytes-to-size';

export const AttachmentUploadDialog = ({ open, onClose, onUpload, isLoading = false }) => {
  const [files, setFiles] = useState([]);

  const getFileIcon = (file) => {
    const extension = file.name.split('.').pop().toLowerCase();
    
    if (file.type?.startsWith('image/')) {
      return 'solar:image-linear';
    }
    
    switch (extension) {
      case 'png':
        return 'solar:file-text-linear';
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

  const onDrop = useCallback((acceptedFiles) => {
    const newFiles = acceptedFiles.map(file => {
      const fileObj = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name || 'Unknown file',
        size: file.size || 0,
        type: file.type,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
        file: file // Store the original File object
      };
      return fileObj;
    });
    
    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp', '.webp'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-powerpoint': ['.ppt'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'text/plain': ['.txt'],
      'application/zip': ['.zip'],
      'application/x-rar-compressed': ['.rar'],
      'video/*': ['.mp4', '.avi', '.mov', '.wmv'],
      'audio/*': ['.mp3', '.wav', '.aac']
    },
    maxSize: 50 * 1024 * 1024, // 50MB
    multiple: true
  });

  const handleRemoveFile = (fileId) => {
    setFiles(prev => {
      const fileToRemove = prev.find(f => f.id === fileId);
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter(f => f.id !== fileId);
    });
  };

  const handleRemoveAll = useCallback(() => {
    files.forEach(file => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    });
    setFiles([]);
  }, [files]);

  const handleUpload = useCallback(async () => {
    if (files.length > 0) {
      const fileObjects = files.map(f => f.file).filter(Boolean);
      await onUpload(fileObjects);
      handleRemoveAll();
      onClose();
    }
  }, [files, onUpload, handleRemoveAll, onClose]);

  const handleClose = useCallback(() => {
    handleRemoveAll();
    onClose();
  }, [handleRemoveAll, onClose]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      sx={{
        zIndex: 999999
      }}
    >
      <DialogTitle>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">Upload Attachments</Typography>
          <IconButton
            onClick={handleClose}
            sx={{
              color: 'text.primary',
              '&:hover': {
                backgroundColor: 'action.hover',
              }
            }}
          >
            <Iconify icon="mingcute:close-line" width={20} height={20} />
          </IconButton>
        </Stack>
      </DialogTitle>
      
      <DialogContent>
        <Stack spacing={2}>
          <Box
            {...getRootProps()}
            sx={{
              border: '2px dashed',
              borderColor: isDragActive ? 'primary.main' : 'divider',
              borderRadius: 1,
              p: 3,
              textAlign: 'center',
              cursor: 'pointer',
              backgroundColor: isDragActive ? 'primary.light' : 'background.paper',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                borderColor: 'primary.main',
                backgroundColor: 'action.hover'
              }
            }}
          >
            <input {...getInputProps()} />
            <Stack spacing={2} alignItems="center">
              <Avatar
                sx={{
                  width: 64,
                  height: 64,
                  backgroundColor: isDragActive ? 'primary.main' : 'grey.100'
                }}
              >
                <Iconify 
                  icon="solar:upload-linear" 
                  width={32}
                  color={isDragActive ? 'white' : 'grey.600'}
                />
              </Avatar>
              <Box>
                <Typography variant="h6" gutterBottom>
                  {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  or click to select files
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  Max file size: 50MB • Supported formats: Images, PDF, Office docs, Archives, Media
                </Typography>
              </Box>
            </Stack>
          </Box>

          {files.length > 0 && (
            <Stack direction="column" gap={1}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="subtitle2">
                  {files.length} file{files.length !== 1 ? 's' : ''} selected
                </Typography>
                <Button
                  size="small"
                  onClick={handleRemoveAll}
                  color="error"
                  startIcon={<Iconify icon="solar:trash-bin-trash-linear" />}
                >
                  Remove All
                </Button>
              </Stack>
              
              <List sx={{ maxHeight: 300, overflow: 'auto' }}>
                {files.map((file) => (
                  <ListItem
                    key={file.id}
                    sx={{
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 1,
                      mb: 1,
                      '&:last-child': { mb: 0 }
                    }}
                  >
                    <ListItemIcon>
                      {file.preview && false ? (
                        <Avatar
                          src={file.preview}
                          variant="rounded"
                          sx={{ width: 40, height: 40 }}
                        />
                      ) : (
                        <Avatar
                          variant="rounded"
                          sx={{ 
                            width: 40, 
                            height: 40,
                            backgroundColor: 'primary.light'
                          }}
                        >
                          <Iconify 
                            icon={getFileIcon(file)} 
                            width={20}
                            color="primary.main"
                          />
                        </Avatar>
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={file.name || 'Unknown file'}
                      secondary={bytesToSize(file.size || 0)}
                      primaryTypographyProps={{ 
                        variant: 'subtitle2',
                        noWrap: true,
                        sx: { maxWidth: '100%' }
                      }}
                      secondaryTypographyProps={{ variant: 'caption' }}
                    />
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFile(file.id);
                      }}
                      color="error"
                      sx={{ 
                        ml: 1,
                        '&:hover': {
                          backgroundColor: 'action.hover',
                        }
                      }}
                    >
                      <Iconify icon="si:close-circle-duotone" width={16} />
                    </IconButton>
                  </ListItem>
                ))}
              </List>
            </Stack>
          )}
        </Stack>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button 
          size="small"
          onClick={handleClose} 
          disabled={isLoading}
        >
          Cancel
        </Button>
        <LoadingButton
          size="small"
          onClick={handleUpload}
          variant="contained"
          loading={isLoading}
          disabled={files.length === 0 || isLoading}
          startIcon={<Iconify icon="bx:upload" width={20} />}
        >
          Upload Files
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};
