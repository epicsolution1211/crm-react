import { useCallback, useState, useRef } from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';

import { getAPIUrl } from "src/config";
import { MentionsAutocomplete } from './mentions-autocomplete';
import { generateAvatarColors } from 'src/utils/functions';

export const TaskCommentAdd = ({ user, onAdd, disabled = false, participants = [], watchers = [] }) => {
  const [message, setMessage] = useState('');
  const [mentionsOpen, setMentionsOpen] = useState(false);
  const [mentionsSearchTerm, setMentionsSearchTerm] = useState('');
  const [mentionsAnchorEl, setMentionsAnchorEl] = useState(null);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [selectedMentions, setSelectedMentions] = useState([]);
  const inputRef = useRef(null);

  const handleMessageChange = useCallback((event) => {
    const newValue = event.target.value;
    setMessage(newValue);
    
    const cursorPos = event.target.selectionStart;
    setCursorPosition(cursorPos);
    
    const textBeforeCursor = newValue.substring(0, cursorPos);
    const lastAtSymbol = textBeforeCursor.lastIndexOf('@');
    
    // Update selected mentions based on current text
    const currentMentions = selectedMentions.filter(mention => {
      const displayName = mention.first_name ? `${mention.first_name} ${mention.last_name}` : mention.email;
      return newValue.includes(`@${displayName}`);
    });
    setSelectedMentions(currentMentions);
    
    if (lastAtSymbol !== -1 && lastAtSymbol < cursorPos) {
      const searchTerm = textBeforeCursor.substring(lastAtSymbol);
      const hasSpaceAfterAt = /\s/.test(searchTerm);
      
      if (!hasSpaceAfterAt && searchTerm.length >= 1) {
        setMentionsSearchTerm(searchTerm);
        setMentionsAnchorEl(event.target);
        setMentionsOpen(true);
      } else {
        setMentionsOpen(false);
      }
    } else {
      setMentionsOpen(false);
    }
  }, [participants, selectedMentions]);

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();

    if (!message || disabled) {
      return;
    }

    const mentionIds = selectedMentions.map(mention => mention.id);
    
    onAdd?.(message, mentionIds);
    setMessage('');
    setMentionsOpen(false);
    setSelectedMentions([]);
  }, [message, onAdd, disabled, selectedMentions]);

  const handleKeyDown = useCallback((event) => {
    if (event.key === 'Enter') {
      // If mentions dropdown is open, let it handle the enter key
      if (mentionsOpen) {
        return;
      }

      // If shift is pressed, allow line break
      if (event.shiftKey) {
        return;
      }

      // Otherwise submit the comment if there's content
      event.preventDefault();
      if (message.trim()) {
        handleSubmit(event);
      }
    }
  }, [message, mentionsOpen, handleSubmit]);

  const handleMentionSelect = useCallback((member) => {
    const textBeforeCursor = message.substring(0, cursorPosition);
    const lastAtSymbol = textBeforeCursor.lastIndexOf('@');
    
    if (lastAtSymbol !== -1) {
      const displayName = member.first_name ? `${member.first_name} ${member.last_name}` : member.email;
      const newMessage = message.substring(0, lastAtSymbol) + `@${displayName} ` + message.substring(cursorPosition);
      setMessage(newMessage);
      
      setSelectedMentions(prev => {
        const existing = prev.find(m => m.id === member.id);
        if (!existing) {
          return [...prev, member];
        }
        return prev;
      });
    }
    
    setMentionsOpen(false);
    
    if (inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 0);
    }
  }, [message, cursorPosition]);

  const handleMentionsClose = useCallback(() => {
    setMentionsOpen(false);
  }, []);
  
  const { bgcolor, color } = generateAvatarColors(user?.first_name + ' ' + user?.last_name);

  return (
    <Stack
      alignItems="flex-start"
      direction="row"
      gap={1.5}
    >
      <Avatar src={user?.avatar ? `${getAPIUrl()}/${user?.avatar}` : ""}
        sx={{ width: 36, height: 36, color: color, bgcolor: bgcolor }}
      >
        {user?.first_name ? `${user?.first_name?.charAt(0)}${user?.last_name ? user?.last_name?.charAt(0) : ''}` : user?.email?.charAt(0)}
      </Avatar>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ flexGrow: 1 }}
      >
        <OutlinedInput
          ref={inputRef}
          fullWidth
          multiline
          onChange={handleMessageChange}
          onKeyDown={handleKeyDown}
          placeholder="Write a comment... Use @ to mention someone"
          rows={3}
          size="small"
          value={message}
          disabled={disabled}
          sx={{ p: 1 }}
        />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            mt: 1.5
          }}
        >
          <Button
            size="small"
            type="submit"
            variant="contained"
            disabled={disabled || !message.trim()}
          >
            Comment
          </Button>
        </Box>
      </Box>
      
      <MentionsAutocomplete
        open={mentionsOpen}
        anchorEl={mentionsAnchorEl}
        searchTerm={mentionsSearchTerm}
        onSelect={handleMentionSelect}
        onClose={handleMentionsClose}
        existingParticipantIds={participants.map(p => p.id)}
        existingWatchers={watchers.map(w => w.id)}
      />
    </Stack>
  );
};
