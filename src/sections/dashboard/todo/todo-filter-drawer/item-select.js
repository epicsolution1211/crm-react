import { useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from "src/components/iconify";

export const ItemSelect = ({
  label = "",
  selectedItems = [],
  onItemToggle = () => {},
  items = [],
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchText, setSearchText] = useState('');

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
    setSearchText('');
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSearchText('');
  };

  const filteredItems = items?.filter((item) => {
    return item.name.toLowerCase().includes(searchText.toLowerCase());
  });

  return (
    <Stack spacing={1}>
      {label && <Typography variant="subtitle2" color="text.secondary">{label}</Typography>}
      <Box>
        <Button
          fullWidth
          variant="outlined"
          onClick={handleOpenMenu}
          endIcon={<Iconify icon={anchorEl ? "eva:chevron-up-fill" : "eva:chevron-down-fill"} />}
          sx={{ 
            justifyContent: 'space-between',
            textAlign: 'left',
            pl: 1.5,
            height: 48,
            color: 'text.primary',
            fontWeight: 500,
          }}
        >
          {selectedItems?.length > 0 ? `${selectedItems.length} Selected` : `Select ${label}`}
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
          PaperProps={{
            sx: { 
              width: 330,
              maxHeight: 310,
              position: 'relative',
            },
          }}
        >
          <Box sx={{ p: 1, position: 'sticky', top: 0, backgroundColor: 'background.paper', zIndex: 1000 }}>
            <TextField
              hiddenLabel
              fullWidth
              size="small"
              placeholder={`Search ${label?.toLowerCase()}...`}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          {filteredItems?.map((item) => (
            <MenuItem
              key={item.id}
              onClick={() => onItemToggle(item)}
              selected={selectedItems.some((i) => i.id === item.id)}
              sx={{ 
                py: 0.5,
                px: 2,
                '&:hover': {
                  backgroundColor: 'action.hover'
                }
              }}
            >
              <Checkbox 
                checked={selectedItems.some((i) => i.id === item.id)}
                sx={{ 
                  p: 0.5,
                  mr: 1,
                }}
              />
              {item.color && (
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    mr: 1,
                    borderRadius: 50,
                    bgcolor: item.color,
                    border: '2px solid',
                    borderColor: item.color,
                  }}
                />
              )}
              <Typography
                variant="body2"
                sx={{
                  flexGrow: 1,
                  color: 'text.primary',
                }}
              >
                {item.name}
              </Typography>
            </MenuItem>
          ))}
          {filteredItems?.length === 0 && (
            <Box sx={{ py: 2, px: 2 }}>
              <Typography
                variant="body2"
                sx={{
                  textAlign: 'center',
                  color: 'text.secondary',
                }}
              >
                No {label?.toLowerCase()} found
              </Typography>
            </Box>
          )}
        </Menu>
        {selectedItems?.length > 0 && (
          <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: 1 }}>
            {selectedItems.map((item) => (
              <Chip
                key={item.id}
                label={item.name}
                onDelete={() => onItemToggle(item)}
                size="small"
                sx={{
                  backgroundColor: item.color,
                  color: '#fff',
                  '& .MuiChip-label': {
                    color: '#fff',
                    fontWeight: 500
                  },
                  '&:hover': {
                    opacity: 0.8
                  }
                }}
              />
            ))}
          </Stack>
        )}
      </Box>
    </Stack>
  );
}; 