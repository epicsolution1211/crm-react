import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/components/iconify';
import AgentSearchNotFound from './agent-search-not-found';

// ----------------------------------------------------------------------

export const AgentSearch = ({ query, results, onSearch, isLoading, setSelectedAgent }) => {
  const filteredResults = query
    ? results.filter((agent) => {
        const fullName = `${agent?.first_name} ${agent?.last_name}`.toLowerCase();
        const searchQuery = query.toLowerCase();
        return fullName.includes(searchQuery);
      })
    : results;

  const handleClick = (agent) => {
    setSelectedAgent(agent);
  };

  const handleKeyUp = (event) => {
    if (query) {
      if (event.key === 'Enter') {
      }
    }
  };

  return (
    <Autocomplete
      sx={{ width: { xs: 1, md: 260 } }}
      loading={isLoading}
      autoHighlight
      popupIcon={null}
      options={filteredResults}
      onInputChange={(event, newValue) => onSearch(newValue)}
      getOptionLabel={(option) => `${option?.first_name} ${option?.last_name ?? ""}`}
      noOptionsText={<AgentSearchNotFound query={query} sx={{ bgcolor: 'unset' }} />}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      renderInput={(params) => (
        <TextField
          variant='outlined'
          sx={{ minWidth: { md: 250, xs: 1 }}}
          {...params}
          placeholder="Search Agent..."
          onKeyUp={handleKeyUp}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ ml: 1, color: 'text.disabled' }} />
              </InputAdornment>
            ),
            endAdornment : isLoading ?
              <InputAdornment position="end" sx={{ mr:-2}}>
                <Iconify
                  icon='svg-spinners:8-dots-rotate'
                  width={22}
                  sx={{ color: 'white' }}
                />
              </InputAdornment>
              : null
          }}
        />
      )}
      renderOption={(props, agent) => (
        <Box component="li" {...props} onClick={() => handleClick(agent)} key={agent.id}>
          <div>
            <Typography
              component="span"
              sx={{
                typography: 'body2',
              }}
            >
              {`${agent?.first_name} ${agent?.last_name}`}
            </Typography>
          </div>
        </Box>
      )}
    />
  );
}
