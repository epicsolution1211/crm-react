import { useState, useMemo, useCallback } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Popover from '@mui/material/Popover';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import { Iconify } from 'src/components/iconify';
import toast from 'react-hot-toast';
import { useTheme } from '@mui/material/styles';
import { aiSupportApi } from 'src/api/ai-support';
import { AnimationEffect } from './effect';
import { EffectButton } from './effect-button';

const customStyle = {
  '& h1, & h2, & h3': {
    margin: '10px 0px',
    color: 'text.primary',
    fontSize: 16
  },
  '& p': {
    margin: '2px 0px 2px 0px',
    color: 'text.primary',
    fontSize: 16
  },
  '& ul': {
    margin: '4px 0px',
    color: 'text.primary',
    fontSize: 16
  },
  '& ol': {
    margin: '2px 0px',
    color: 'text.primary',
    fontSize: 15
  },
  '& li': {
    color: 'text.secondary',
    fontSize: 15
  },
  '& a': {
    color: 'success.main',
    fontSize: 15,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    mt: 1,
  }
}

export const AISupport = () => {
  const theme = useTheme();
  const [query, setQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const open = Boolean(anchorEl);

  const handleGetAnswer = useCallback(async (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!query.trim()) {
      toast.error('Please enter a question');
      return;
    }

    try {
      setIsLoading(true);
      const response = await aiSupportApi.askQuestion({ question: query });
      setAiResponse(response?.data?.answer || 'No answer available');
      setAnchorEl(document.getElementById('ai-support-input'));
    } catch (error) {
      const errorMessage = error?.response?.data?.error?.message || error?.response?.data?.error;
      const parsedMessage = typeof errorMessage === 'string' 
        ? errorMessage 
        : typeof errorMessage === 'object' 
          ? errorMessage?.error?.message 
          : JSON.parse(errorMessage)?.error?.message;
      toast.error(parsedMessage);
      setAiResponse('Sorry, there was an error getting the answer.');
      setAnchorEl(document.getElementById('ai-support-input'));
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  const handleQueryChange = useCallback((e) => {
    setQuery(e.target.value);
  }, []);

  const handleClickInput = useCallback(() => {
    setAnchorEl(document.getElementById('ai-support-input'));
  }, []);
  
  const formattedResponse = useMemo(() => {
    if (!aiResponse) return '';
    return aiResponse
      .replace('</a>.', '</a>')
      .replace(/\.<\/p>/g, '</p>');
  }, [aiResponse]);

  return (
    <Box sx={{ position: 'relative' }}>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <AnimationEffect />
        <TextField
          id="ai-support-input"
          hiddenLabel
          fullWidth
          autoComplete="off"
          placeholder="What can I help you with? "
          value={query}
          onChange={handleQueryChange}
          onClick={handleClickInput}
          InputProps={{
            startAdornment: (
              <Iconify 
                icon="healthicons:artificial-intelligence" width={28}
                sx={{
                  flexShrink: 0,
                  color: query?.length >= 5 ? 'inherit' : 'transparent',
                  transition: 'color 0.3s ease'
                }}
              />
            ),
            endAdornment: (
              <Stack direction="row" spacing={1} sx={{ mr: -0.9 }}>
                <Tooltip title="Clear">
                  <IconButton 
                    onClick={(event) => {
                      event.stopPropagation();
                      setQuery('');
                      setAiResponse('');
                      setAnchorEl(null);
                    }}
                    color='primary'
                    sx={{
                      visibility: query?.length > 0 || (open && aiResponse?.length > 0) ? 'visible' : 'hidden',
                      transition: 'visibility 0.1s ease',
                      flexShrink: 0,
                    }}
                  >
                    <Iconify icon="material-symbols:close" width={22} />
                  </IconButton>
                </Tooltip>
                <EffectButton 
                  loading={isLoading}
                  isShow={query?.length >= 5}
                  disabled={isLoading || query?.length < 5} 
                  onClick={handleGetAnswer}
                />
              </Stack>
            )
          }}
          inputProps={{ 
            sx: { 
              pl: 1,
              textAlign: 'start',
              '&::placeholder': {
                textAlign: 'center',
                color: theme.palette.text.primary,
                opacity: 0.7,
                fontStyle: 'italic',
                fontWeight: 400,
              },
              border: 'none'
            } 
          }}
          sx={{
            border: 'none',
            '& div, & div *': {
              boxShadow: 'none !important',
              border: 'none !important'
            },
            minWidth: 600,
            flexGrow: 1,
            width: 1,
            height: 50,
            borderRadius: 2,
            position: 'relative',
          }}
        />
      </Box>

      { formattedResponse ?
        (<Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          PaperProps={{
            sx: { 
              width: 600,
              p: 2,
              maxHeight: 400,
              overflow: 'auto',
              left: '296px !important',
              opacity: 1,
              transform: 'none',
              transition: 'opacity 217ms cubic-bezier(0.4, 0, 0.2, 1), transform 145ms cubic-bezier(0.4, 0, 0.2, 1)',
              transformOrigin: '0px 0px', 
              border: '1px dotted rgba(145, 158, 171, 0.32)'
            }
          }}
        >
          <Stack dangerouslySetInnerHTML={{ __html: formattedResponse || '' }} sx={customStyle} />
        </Popover>
      ) : null}   
    </Box>
  );
};
