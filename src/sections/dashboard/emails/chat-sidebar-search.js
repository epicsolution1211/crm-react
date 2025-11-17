import { forwardRef, useCallback } from 'react';

import Box from '@mui/material/Box';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import InputAdornment from '@mui/material/InputAdornment';
import List from '@mui/material/List';
import OutlinedInput from '@mui/material/OutlinedInput';
import Typography from '@mui/material/Typography';

import { Tip } from 'src/components/tip';
import { Iconify } from 'src/components/iconify';
import { ChatThreadItem } from './chat-thread-item';

export const ChatSidebarSearch = forwardRef((props, ref) => {
  const {
    isFocused,
    onChange,
    onClickAway = () => { },
    onFocus,
    onSelect,
    query = '',
    results = [],
    conversationId,
    ...other
  } = props;

  const handleSelect = useCallback((result) => {
    onSelect?.(result);
  }, [onSelect]);

  const showTip = isFocused && !query;
  const showResults = isFocused && query;
  const hasResults = results.length > 0;

  return (
    <ClickAwayListener onClickAway={onClickAway}>
      <Box
        ref={ref}
        sx={{ p: 2, pt: 1 }}
        {...other}>
        <OutlinedInput
          fullWidth
          onChange={onChange}
          onFocus={onFocus}
          placeholder="Search email chats"
          startAdornment={(
            <InputAdornment position="start">
              <Iconify icon="lucide:search" color="text.secondary" width={24} />
            </InputAdornment>
          )}
          value={query}
        />
        {showTip && (
          <Box sx={{ py: 2 }}>
            <Tip message="Enter a email chat name" />
          </Box>
        )}
        {showResults && (
          <>
            {hasResults
              ? (
                <Box sx={{ py: 2 }}>
                  <Typography
                    color="text.secondary"
                    variant="subtitle2"
                  >
                    Support Chats
                  </Typography>
                  <List>
                    {results?.map((chat, index) => (
                      <ChatThreadItem
                        key={`${chat?.conversation?.id}-${index}`}
                        active={conversationId === chat?.conversation?.id?.toString()}
                        onSelect={() => handleSelect(chat?.conversation?.id)}
                        thread={chat}
                      />
                    ))}
                  </List>
                </Box>
              )
              : (
                <Box sx={{ py: 2 }}>
                  <Typography
                    color="text.secondary"
                    variant="body2"
                  >
                    We couldn&apos;t find any matches for &quot;{query}&quot;. Try checking
                    for typos or using complete words.
                  </Typography>
                </Box>
              )}
          </>
        )}
      </Box>
    </ClickAwayListener>
  );
});
