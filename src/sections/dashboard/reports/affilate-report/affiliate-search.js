import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/components/iconify';
import AffiliateSearchNotFound from './affiliate-search-not-found';

// ----------------------------------------------------------------------

export const AffiliateSearch= ({ query, results, onSearch, isLoading, setSelectedAffiliate }) =>{
  const filteredResults = query
  ? results.filter((affiliate) => {
      const fullName = `${affiliate?.full_name}`.toLowerCase();
      const searchQuery = query.toLowerCase();
      return fullName.includes(searchQuery);
    })
  : results;

  const handleClick = (affilate) => {
    setSelectedAffiliate(affilate);
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
      getOptionLabel={(option) => `${option?.full_name}`}
      noOptionsText={<AffiliateSearchNotFound query={query} sx={{ bgcolor: 'unset' }} />}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      renderInput={(params) => (
        <TextField
          variant='outlined'
          sx={{ minWidth: { md: 250, xs: 1 }}}
          {...params}
          placeholder="Search Affilate..."
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
      renderOption={(props, affilate) => (
        <Box component="li" {...props} onClick={() => handleClick(affilate)} key={affilate.id}>
          <div>
            <Typography
              component="span"
              sx={{
                typography: 'body2',
              }}
            >
              {`${affilate?.full_name}`}
            </Typography>
          </div>
        </Box>
      )}
    />
  );
}
