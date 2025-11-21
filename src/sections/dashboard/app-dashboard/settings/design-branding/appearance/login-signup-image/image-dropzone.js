import { useDropzone } from 'react-dropzone';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { useState, useEffect } from 'react';

export const ImageDropzone = ({ onDrop }) => {
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        return () => {
            if (preview) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    const handleDrop = (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file) {
            // Create preview URL for the image
            const previewUrl = URL.createObjectURL(file);
            setPreview(previewUrl);
            // Call the original onDrop handler
            onDrop(acceptedFiles);
        }
    };

    const handleRemove = (event) => {
        event.stopPropagation();
        setPreview(null);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: handleDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
        },
        maxFiles: 1,
    });

    return (
        <Box
            {...getRootProps()}
            sx={{
                p: 3,
                border: '1px dashed',
                borderColor: 'divider',
                borderRadius: 1,
                cursor: 'pointer',
                bgcolor: isDragActive ? 'action.hover' : 'background.paper',
                '&:hover': {
                    bgcolor: 'action.hover',
                },
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1,
                position: 'relative',
            }}
        >
            <input {...getInputProps()} />
            {preview ? (
                <>
                    <IconButton
                        onClick={handleRemove}
                        sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            bgcolor: 'background.paper',
                            '&:hover': {
                                bgcolor: 'action.hover',
                            },
                        }}
                        size="small"
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                    <Box
                        component="img"
                        src={preview}
                        alt="Upload preview"
                        sx={{
                            maxWidth: '100%',
                            maxHeight: 200,
                            objectFit: 'contain',
                            borderRadius: 1,
                        }}
                    />
                </>
            ) : (
                <>
                    <Typography variant="body1" color="text.secondary" align="center">
                        Drag and drop image here, or click to select
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center">
                        Supported formats: PNG, JPG, JPEG, GIF
                    </Typography>
                </>
            )}
        </Box>
    );
}; 