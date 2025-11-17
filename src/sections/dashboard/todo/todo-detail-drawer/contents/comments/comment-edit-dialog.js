import { useState, useEffect, useCallback, useRef } from 'react';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';

import { MentionsAutocomplete } from './mentions-autocomplete';

export const CommentEditDialog = (props) => {
  const { open, onClose, comment, onSave, isLoading = false, participants = [], watchers = [] } = props;
  const [content, setContent] = useState('');
  const [mentionsOpen, setMentionsOpen] = useState(false);
  const [mentionsSearchTerm, setMentionsSearchTerm] = useState('');
  const [mentionsAnchorEl, setMentionsAnchorEl] = useState(null);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [selectedMentions, setSelectedMentions] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    if (comment && open) {
      setContent(comment.content || comment.message || '');
      
      const existingMentions = comment.mentioned_accounts || [];
      const existingMentionIds = existingMentions.map(account => account.id);
      
      const existingParticipants = participants.filter(participant => 
        existingMentionIds.includes(participant.id)
      );
      
      setSelectedMentions(existingParticipants);
    } else {
      setContent('');
      setSelectedMentions([]);
    }
  }, [comment, open, participants]);

  const handleContentChange = useCallback((event) => {
    const newValue = event.target.value;
    setContent(newValue);
    
    const cursorPos = event.target.selectionStart;
    setCursorPosition(cursorPos);
    
    const textBeforeCursor = newValue.substring(0, cursorPos);
    const lastAtSymbol = textBeforeCursor.lastIndexOf('@');
    
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
    
    const currentMentions = selectedMentions.filter(mention => {
      const displayName = mention.first_name ? `${mention.first_name} ${mention.last_name}` : mention.email;
      return newValue.includes(`@${displayName}`);
    });
    setSelectedMentions(currentMentions);
  }, [selectedMentions]);

  const handleSave = async () => {
    if (!content.trim()) {
      return;
    }

    try {
      const mentionIds = selectedMentions.map(mention => mention.id);
      await onSave(content, mentionIds);
      onClose();
    } catch (error) {
      console.error('Failed to save comment:', error);
    }
  };

  const handleMentionSelect = useCallback((member) => {
    const textBeforeCursor = content.substring(0, cursorPosition);
    const lastAtSymbol = textBeforeCursor.lastIndexOf('@');
    
    if (lastAtSymbol !== -1) {
      const displayName = member.first_name ? `${member.first_name} ${member.last_name}` : member.email;
      const newContent = content.substring(0, lastAtSymbol) + `@${displayName} ` + content.substring(cursorPosition);
      setContent(newContent);
      
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
  }, [content, cursorPosition]);

  const handleMentionsClose = useCallback(() => {
    setMentionsOpen(false);
  }, []);

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  const handleKeyDown = (event) => {
    // Check if Enter was pressed without Shift key
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSave();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle>Edit Comment</DialogTitle>
      <DialogContent sx={{ '&.MuiDialogContent-root': { px: 2.5, pt: 0, pb: 1 } }}>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            ref={inputRef}
            fullWidth
            multiline
            rows={4}
            label="Comment"
            value={content}
            onChange={handleContentChange}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder="Write your comment... Use @ to mention someone"
          />
          
          <MentionsAutocomplete
            open={mentionsOpen}
            anchorEl={mentionsAnchorEl}
            searchTerm={mentionsSearchTerm}
            onSelect={handleMentionSelect}
            onClose={handleMentionsClose}
            existingParticipantIds={participants.map(p => p.id)}
            existingWatchers={watchers.map(w => w.id)}
            isEdit
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 2, pb: 2 }}>
        <LoadingButton
          onClick={handleSave}
          loading={isLoading}
          variant="contained"
          size="small"
        >
          Save
        </LoadingButton>
        <Button variant="outlined" onClick={handleClose} disabled={isLoading} size="small">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};
