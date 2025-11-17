import { useCallback, useEffect, useState, useRef, useMemo } from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { settingsApi } from 'src/api/settings';
import { useDebounce } from 'src/hooks/use-debounce';
import { useMounted } from 'src/hooks/use-mounted';
import { getAPIUrl } from 'src/config';
import { generateAvatarColors } from 'src/utils/functions';
import { useAuth } from 'src/hooks/use-auth';

export const MentionsAutocomplete = ({ 
  open, 
  anchorEl, 
  searchTerm, 
  onSelect, 
  onClose,
  existingParticipantIds = [],
  existingWatchers = [],
  isEdit = false,
  ...other 
}) => {

  const { user } = useAuth();

  const memberIds = useMemo(() => [...new Set([...existingParticipantIds, ...existingWatchers])]?.filter(id => id !== user?.id), [existingParticipantIds, existingWatchers, user?.id]);

  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const mounted = useMounted();
  const debouncedSearch = useDebounce(searchTerm, 200);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (open && menuRef.current && !menuRef.current.contains(event.target) && !anchorEl?.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, anchorEl, onClose]);

  const handleMembersGet = useCallback(async () => {
    
    if (!open || !debouncedSearch) return;

    try {
      setIsLoading(true);
      const q = debouncedSearch.replace('@', '');
      
      const response = await settingsApi.getMemberList({ account_ids: memberIds, q });
      const filteredMembers = response?.accounts?.filter(member => member?.active) || [];
      
      if (mounted()) {
        setMembers(filteredMembers);
        setSelectedIndex(0);
      }
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      if (mounted()) {
        setIsLoading(false);
      }
    }
  }, [debouncedSearch, open, memberIds, mounted]);

  useEffect(() => {
    handleMembersGet();
  }, [handleMembersGet]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [members]);

  const handleKeyDown = useCallback((event) => {
    if (!open || members.length === 0) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % members.length);
        break;
      case 'ArrowUp':
        event.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + members.length) % members.length);
        break;
      case 'Enter':
        event.preventDefault();
        if (members[selectedIndex]) {
          onSelect(members[selectedIndex]);
        }
        break;
      case 'Escape':
        event.preventDefault();
        onClose();
        break;
      default:
        break;
    }
  }, [open, members, selectedIndex, onSelect, onClose]);

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [handleKeyDown, open]);

  const handleMemberClick = useCallback((member) => {
    onSelect(member);
  }, [onSelect]);

  
  if (!open || !anchorEl) {
    return null;
  }

  const anchorRect = anchorEl.getBoundingClientRect();
  const windowHeight = window.innerHeight;
  const spaceBelow = windowHeight - anchorRect.bottom;
  const spaceAbove = anchorRect.top;
  const dropdownHeight = 240; // maxHeight of the Paper component
  const margin = 12;
  
  // Determine if the dropdown should appear above or below
  const showAbove = spaceBelow < (dropdownHeight + margin) && spaceAbove > spaceBelow;

  return (
    <Paper
      ref={menuRef}
      elevation={8}
      sx={{
        position: 'fixed',
        ...(showAbove 
          ? { bottom: windowHeight - anchorRect.top + margin }
          : { top: anchorRect.bottom + (isEdit ? -4 : margin) }
        ),
        left: anchorRect.left - 8,
        width: 280,
        maxHeight: 240,
        overflow: 'auto',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        zIndex: 1250,
        '& .MuiListItemText-root': { py: 0 }
      }}
      {...other}
    >
      {isLoading ? (
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Loading...
          </Typography>
        </Box>
      ) : members.length === 0 ? (
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            No members found
          </Typography>
        </Box>
      ) : (
        <List sx={{ p: 0, maxHeight: 300, overflow: 'auto' }}>
          {members.map((member, index) => {
            const { bgcolor, color } = generateAvatarColors(member.first_name + ' ' + member.last_name);
            return (
              <ListItem
                key={member.id}
                button
                selected={index === selectedIndex}
                onClick={() => handleMemberClick(member)}
                sx={{
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'action.hover' },
                  py: 0,
                  px: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <Avatar
                  src={member.avatar ? member.avatar?.includes('http') ? member.avatar : `${getAPIUrl()}/${member.avatar}` : ""}
                  sx={{ width: 32, height: 32, bgcolor, color }}
                >
                  {member?.first_name ? `${member?.first_name?.charAt(0)}${member?.last_name ? member?.last_name?.charAt(0) : ''}` : member?.email?.charAt(0)}
                </Avatar>
                <ListItemText
                  primary={<Typography variant="body2" fontWeight="medium">
                    {member?.first_name ? `${member?.first_name} ${member?.last_name}` : member?.email}
                  </Typography>}
                  secondary={<Typography variant="caption" color="text.secondary">
                    {member?.email}
                  </Typography>}
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
                  }} />
              </ListItem>
            );
          })}
        </List>
      )}
    </Paper>
  );
};
