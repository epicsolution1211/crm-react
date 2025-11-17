import { forwardRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import InputAdornment from '@mui/material/InputAdornment';
import List from '@mui/material/List';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import OutlinedInput from '@mui/material/OutlinedInput';
import Typography from '@mui/material/Typography';

import { Tip } from 'src/components/tip';
import { getAPIUrl } from 'src/config';
import { Iconify } from 'src/components/iconify';

export const ChatSidebarSearch = forwardRef((props, ref) => {
  const {
    isFocused,
    onChange,
    onClickAway = () => { },
    onFocus,
    onSelect,
    query = '',
    results = [],
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
          placeholder="Search conversations"
          startAdornment={(
            <InputAdornment position="start">
              <Iconify icon="lucide:search" color="text.secondary" width={24} />
            </InputAdornment>
          )}
          value={query}
        />
        {showTip && (
          <Box sx={{ py: 2 }}>
            <Tip message="Enter a conversation name" />
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
                    Conversations
                  </Typography>
                  <List>
                    {results.map((conversation) => (
                      <ListItemButton
                        key={conversation?.id}
                        onClick={() => handleSelect(conversation?.id)}
                      >
                        <ListItemAvatar>
                          <Avatar
                            src={conversation?.avatar ? conversation?.avatar?.includes('http') ? conversation?.avatar : `${getAPIUrl()}/${conversation?.avatar}` : ""}
                            sx={{
                              height: 32,
                              width: 32
                            }}
                          />
                        </ListItemAvatar>
                        <ListItemText
                          primary={conversation?.name}
                          primaryTypographyProps={{
                            noWrap: true,
                            variant: 'subtitle2'
                          }}
                        />
                      </ListItemButton>
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

ChatSidebarSearch.propTypes = {
  isFocused: PropTypes.bool,
  onChange: PropTypes.func,
  onClickAway: PropTypes.func,
  onFocus: PropTypes.func,
  onSelect: PropTypes.func,
  query: PropTypes.string,
  results: PropTypes.array
};
