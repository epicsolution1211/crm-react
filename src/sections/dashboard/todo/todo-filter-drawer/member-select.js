import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import ListItemText from '@mui/material/ListItemText';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from "src/components/iconify";
import { generateAvatarColors } from 'src/utils/functions';
import { getAPIUrl } from 'src/config';

export const MemberSelect = ({
  label = "",
  selectedMembers = [],
  onMemberToggle = () => {},
  members = [],
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

  const filteredMembers = members?.filter((member) => {
    const searchStr = (`${member.first_name} ${member?.last_name ? '' + member.last_name : ''}` || member.email || '').toLowerCase();
    return searchStr.includes(searchText.toLowerCase());
  });

  return (
    <Stack spacing={1}>
      {label && <Typography variant="subtitle2" color="text.secondary">{label}</Typography>}
      <Box>
        <Button
          fullWidth
          variant="outlined"
          onClick={handleOpenMenu}
          endIcon={<Iconify icon={ anchorEl ? "eva:chevron-up-fill" : "eva:chevron-down-fill"} />}
          sx={{ 
            justifyContent: 'space-between',
            textAlign: 'left',
            pl: 1.5,
            height: 48,
            color: 'text.primary',
            fontWeight: 500,
          }}
        >
          {selectedMembers?.length > 0 ? `${selectedMembers.length} Selected` : `Select ${label}`}
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
          PaperProps={{
            sx: { 
              width: 330,
              maxHeight: 330,
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
              data-member-search
            />
          </Box>
          {filteredMembers?.map((member) => {
            const { bgcolor, color } = generateAvatarColors(member.first_name + ' ' + member.last_name);
            return (
              <MenuItem 
                key={member.id}
                onClick={() => onMemberToggle(member)}
                sx={{ gap: 1 }}
                selected={selectedMembers?.some((m) => m.id === member.id)}
              >
                <Checkbox 
                  checked={selectedMembers?.some((m) => m.id === member.id)}
                  sx={{ p: 0 }} 
                />
                <Avatar
                  src={member.avatar ? `${getAPIUrl()}/${member.avatar}` : ""}
                  alt={member.first_name}
                  sx={{ width: 24, height: 24, bgcolor, color, fontSize: 12 }}
                >
                  {member.first_name ? `${member.first_name?.charAt(0)}${member.last_name ? member.last_name?.charAt(0) : ''}` : member.email?.charAt(0)}
                </Avatar>
                <ListItemText
                  primary={`${member.first_name} ${member?.last_name || ''}`}
                  secondary={member.email}
                  primaryTypographyProps={{
                    sx: {
                      fontSize: 14,
                      fontWeight: 500,
                    }
                  }}
                  secondaryTypographyProps={{
                    sx: {
                      fontSize: 12,
                      fontWeight: 400,
                    }
                  }}
                />
              </MenuItem>
            );
          })}
          {filteredMembers?.length === 0 && (
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
        {selectedMembers?.length > 0 && (
          <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: 1 }}>
            {selectedMembers?.map((member) => {
              const { bgcolor, color } = generateAvatarColors(member.first_name + ' ' + member.last_name);
              return (
                <Chip
                  key={member.id}
                  variant="outlined"
                  label={
                    (<Stack direction="row" alignItems="center" gap={1} ml={-1}>
                      <Avatar
                        src={member.avatar ? `${getAPIUrl()}/${member.avatar}` : ""}
                        alt={member.first_name}
                        sx={{ width: 24, height: 24, bgcolor, color, fontSize: 12 }}
                      >
                        {member.first_name ? `${member.first_name?.charAt(0)}${member.last_name ? member.last_name?.charAt(0) : ''}` : member.email?.charAt(0)}
                      </Avatar>
                      <Typography variant="subtitle2">{`${member.first_name} ${member?.last_name ? ' ' + member.last_name : ''}`}</Typography>
                    </Stack>)}
                  onDelete={() => onMemberToggle(member)}
                  sx={{ borderRadius: 1 }}
                />
              );
            })}
          </Stack>
        )}
      </Box>
    </Stack>
  );
}; 