import { useDropzone } from 'react-dropzone';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { FileIcon } from 'src/components/file-icon';
import { bytesToSize } from 'src/utils/bytes-to-size';
import { Iconify } from 'src/components/iconify';

export const FileDropzone = (props) => {
  const { caption, files = [], onRemove, onRemoveAll, onUpload, ...other } = props;
  const { getRootProps, getInputProps, isDragActive } = useDropzone(other);

  const hasAnyFiles = files.length > 0;

  return (
    <div>
      <Box
        sx={{
          alignItems: 'center',
          border: 1,
          borderRadius: 1,
          borderStyle: 'dashed',
          borderColor: 'divider',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          outline: 'none',
          p: 6,
          ...(isDragActive && {
            backgroundColor: 'action.active',
            opacity: 0.5
          }),
          '&:hover': {
            backgroundColor: 'action.hover',
            cursor: 'pointer',
            opacity: 0.5
          }
        }}
        {...getRootProps()}>
        <input {...getInputProps()} />
        <Stack
          alignItems="center"
          direction="row"
          spacing={2}
        >
          <Avatar
            sx={{
              height: 64,
              width: 64
            }}
          >
            <Iconify icon="octicon:upload-16" width={26} />
          </Avatar>
          <Stack spacing={1}>
            <Typography
              sx={{
                '& span': {
                  textDecoration: 'underline'
                }
              }}
              variant="h6"
            >
              <span>Click to upload</span> or drag and drop
            </Typography>
            {caption && (
              <Typography
                color="text.secondary"
                variant="body2"
              >
                {caption}
              </Typography>
            )}
          </Stack>
        </Stack>
      </Box>
      {hasAnyFiles && (
        <Box sx={{ mt: 2 }}>
          <List>
            {files.map((file) => {
              const extension = file.name.split('.').pop();

              return (
                <ListItem
                  key={file.path}
                  sx={{
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 1,
                    '& + &': {
                      mt: 1
                    }
                  }}
                >
                  <ListItemIcon>
                    <FileIcon extension={extension} />
                  </ListItemIcon>
                  <ListItemText
                    primary={file.name}
                    primaryTypographyProps={{ variant: 'subtitle2' }}
                    secondary={bytesToSize(file.size)}
                  />
                  <Tooltip title="Remove">
                    <IconButton
                      edge="end"
                      onClick={() => onRemove?.(file)}
                    >
                      <Iconify icon="iconamoon:close" width={24} />
                    </IconButton>
                  </Tooltip>
                </ListItem>
              );
            })}
          </List>
          <Stack
            alignItems="center"
            direction="row"
            justifyContent="flex-end"
            spacing={2}
            sx={{ mt: 2 }}
          >
            <Button
              color="inherit"
              onClick={onRemoveAll}
              size="small"
              type="button"
            >
              Remove All
            </Button>
            <Button
              onClick={onUpload}
              size="small"
              type="button"
              variant="contained"
            >
              Upload
            </Button>
          </Stack>
        </Box>
      )}
    </div>
  );
};
