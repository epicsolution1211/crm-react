import { useCallback, useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';
import TablePagination from '@mui/material/TablePagination';

import { tickersApi } from 'src/api/company/tickers';
import { useDebounce } from 'src/hooks/use-debounce';
import { TableNoData } from 'src/components/table-empty';
import { FilterCategories } from '../spreads/filter-categories';
import { Iconify } from 'src/components/iconify';

export const Tickers = ({ brandId }) => {

  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [perPage, setPerPage] = useState(12);
  const [tickers, setTickers] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('forex');
  
  const debouncedSearch = useDebounce(search, 300);

  const fetchTickers = useCallback(async (params) => {
    try {
      setIsLoading(true);
      const response = await tickersApi.getTickers({
        market_type: params?.market_type,
        q: params?.search?.length > 0 ? params?.search : null,
        internal_brand_id: params?.brandId,
        page: params?.page + 1,
        per_page: params?.perPage
      });
      
      if (response?.tickers?.length > 0) {
        setTickers(response.tickers);
        setTotalCount(response.total_count);
      } else {
        const retryResponse = await tickersApi.getTickers({
          market_type: params?.market_type,
          q: params?.search?.length > 0 ? params?.search : null,
          internal_brand_id: params?.brandId,
          page: params?.page + 1,
          per_page: params?.perPage
        });
        setTickers(retryResponse?.tickers || []);
        setTotalCount(retryResponse?.total_count || 0);
      }
    } catch (error) {
      console.error('Error fetching tickers:', error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  }, []);

  useEffect(() => {
    fetchTickers({
      page,
      perPage,
      brandId,
      search: debouncedSearch,
      market_type: selectedCategory,
    });
  }, [debouncedSearch, selectedCategory, brandId, page, perPage, fetchTickers]);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handlePerPageChange = (event) => {
    setPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Stack spacing={3}>
      <Stack spacing={3} direction="row">
        <TextField
          fullWidth
          value={search}
          hiddenLabel
          InputProps={{
            startAdornment: (
              <InputAdornment sx={{ pb: 0.1, mr: 1 }} >
                <Iconify icon="lucide:search" color="text.secondary" width={24} />
              </InputAdornment>
            ),
          }}
          placeholder="Search tickers"
          onChange={(e) => setSearch(e.target.value)}
        />
      </Stack>

      <FilterCategories
        selectedCategory={selectedCategory}
        onCategoryChange={(category) => {
          setSelectedCategory(category);
          setPage(0);
        }}
      />

      {isLoading ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '400px'
          }}
        >
          <CircularProgress size={40} />
        </Box>
      ) : (
        <>
          {tickers?.length > 0 ? (
            <>
              <Grid container spacing={3}>
                {tickers.map((ticker) => (
                  <Grid item xs={12} md={4} key={ticker.id}>
                    <Card
                      sx={{
                        backgroundColor: 'background.default',
                        boxShadow: (theme) => theme.shadows[8],
                        border: '1px solid',
                        borderColor: 'divider',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        '&:hover': {
                          backgroundColor: 'background.paper',
                          boxShadow: (theme) => theme.shadows[16],
                        },
                        transition: (theme) =>
                          theme.transitions.create(['box-shadow', 'background-color'], {
                            duration: theme.transitions.duration.short
                          })
                        }}
                      >
                      <CardContent
                        sx={{
                          flex: 1,
                          display: 'flex',
                          flexDirection: 'column',
                          height: '100%'
                        }}
                      >
                        <Stack spacing={2}>
                          <Box>
                            <Typography 
                              variant="h6" 
                              sx={{ 
                                mb: 1,
                                minHeight: 28 // Ensure consistent height for title
                              }}
                            >
                              {ticker?.symbol}
                            </Typography>
                            <Typography 
                              variant="body2" 
                              color="text.secondary"
                              sx={{ 
                                minHeight: 40 // Ensure consistent height for description
                              }}
                            >
                              {ticker?.name}
                            </Typography>
                            <Typography 
                              variant="body2" 
                              color="text.secondary"
                              sx={{ 
                                minHeight: 40 // Ensure consistent height for description
                              }}
                            >
                              ID: {ticker?.id}
                            </Typography>
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Typography 
                              variant="subtitle2" 
                              sx={{ mb: 1 }}
                            >
                              Market Type: {ticker?.market_type ?? ""}
                            </Typography>
                            <Typography 
                              variant="subtitle2" 
                              sx={{ mb: 1 }}
                            >
                              Exchange: {ticker?.exchange ?? ""}
                            </Typography>
                            <Typography 
                              variant="subtitle2" 
                              sx={{ mb: 1 }}
                            >
                              Exchange Short Name: {ticker?.exchangeShortName ?? ""}
                            </Typography>
                            <Typography 
                              variant="subtitle2" 
                              sx={{ mb: 1 }}
                            >
                              Currency: {ticker?.currency ?? ""}
                            </Typography>
                            <Typography 
                              variant="subtitle2"
                            >
                              Stock Exchange: {ticker?.stockExchange ?? ""}
                            </Typography>
                          </Box>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              <TablePagination
                component="div"
                labelRowsPerPage="Per page"
                count={totalCount}
                page={page}
                onPageChange={handlePageChange}
                rowsPerPage={perPage}
                onRowsPerPageChange={handlePerPageChange}
                rowsPerPageOptions={[12, 24, 36]}
              />
            </>
          ) : (
            <TableNoData 
              title="No tickers found" 
              description={search ? "Try adjusting your search or filters" : "No tickers available for this category"}
            />
          )}
        </>
      )}
    </Stack>
  );
}; 