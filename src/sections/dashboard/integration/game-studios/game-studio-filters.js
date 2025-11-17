import { useState, useRef, useEffect } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Popover from '@mui/material/Popover';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Icon } from '@iconify/react';

const gameTypeOptions = [
  { value: 'slots', label: 'Slots' },
  { value: 'video_slots', label: 'Video Slots' },
  { value: 'table_games', label: 'Table Games' },
  { value: 'video_poker', label: 'Video Poker' },
  { value: 'live_casino', label: 'Live Casino' },
  { value: 'live_game_shows', label: 'Live Game Shows' },
  { value: 'crash_games', label: 'Crash Games' },
  { value: 'instant_games', label: 'Instant Games' },
  { value: 'roulette', label: 'Roulette' },
  { value: 'blackjack', label: 'Blackjack' },
  { value: 'baccarat', label: 'Baccarat' },
  { value: 'poker', label: 'Poker' }
];

const currencyOptions = [
  { value: 'USD', label: 'Dollar' },
  { value: 'EUR', label: 'Euro' },
  { value: 'GBP', label: 'Pound' },
  { value: 'CAD', label: 'Canadian Dollar' },
  { value: 'AUD', label: 'Australian Dollar' },
  { value: 'BRL', label: 'Brazilian Real' },
  { value: 'BTC', label: 'Bitcoin' },
  { value: 'ETH', label: 'Ethereum' },
  { value: 'USDT', label: 'Tether' },
  { value: 'INR', label: 'Indian Rupee' },
  { value: 'SEK', label: 'Swedish Krona' },
  { value: 'NOK', label: 'Norwegian Krone' }
];

const reviewOptions = [
  { value: 5, label: '5 Stars' },
  { value: 4.5, label: '4.5+ Stars' },
  { value: 4, label: '4+ Stars' },
  { value: 3.5, label: '3.5+ Stars' },
  { value: 3, label: '3+ Stars' }
];

export const GameStudioFilters = ({ onFiltersChange }) => {
  const [selectedGameTypes, setSelectedGameTypes] = useState([]);
  const [selectedCurrencies, setSelectedCurrencies] = useState([]);
  const [selectedReviews, setSelectedReviews] = useState([]);
  
  const [gameTypeAnchor, setGameTypeAnchor] = useState(null);
  const [currencyAnchor, setCurrencyAnchor] = useState(null);
  const [reviewAnchor, setReviewAnchor] = useState(null);

  const gameTypeRef = useRef(null);
  const currencyRef = useRef(null);
  const reviewRef = useRef(null);

  useEffect(() => {
    onFiltersChange({
      gameTypes: selectedGameTypes,
      currencies: selectedCurrencies,
      reviews: selectedReviews
    });
  }, [selectedGameTypes, selectedCurrencies, selectedReviews, onFiltersChange]);

  const handleGameTypeClick = () => {
    setGameTypeAnchor(gameTypeRef.current);
  };

  const handleCurrencyClick = () => {
    setCurrencyAnchor(currencyRef.current);
  };

  const handleReviewClick = () => {
    setReviewAnchor(reviewRef.current);
  };

  const handleCloseGameType = () => {
    setGameTypeAnchor(null);
  };

  const handleCloseCurrency = () => {
    setCurrencyAnchor(null);
  };

  const handleCloseReview = () => {
    setReviewAnchor(null);
  };

  const handleGameTypeToggle = (value) => {
    setSelectedGameTypes(prev =>
      prev.includes(value)
        ? prev.filter(v => v !== value)
        : [...prev, value]
    );
  };

  const handleCurrencyToggle = (value) => {
    setSelectedCurrencies(prev =>
      prev.includes(value)
        ? prev.filter(v => v !== value)
        : [...prev, value]
    );
  };

  const handleReviewToggle = (value) => {
    setSelectedReviews(prev =>
      prev.includes(value)
        ? prev.filter(v => v !== value)
        : [...prev, value]
    );
  };

  const handleRemoveGameType = (value) => {
    setSelectedGameTypes(prev => prev.filter(v => v !== value));
  };

  const handleRemoveCurrency = (value) => {
    setSelectedCurrencies(prev => prev.filter(v => v !== value));
  };

  const handleClearAll = () => {
    setSelectedGameTypes([]);
    setSelectedCurrencies([]);
    setSelectedReviews([]);
  };

  const hasActiveFilters = selectedGameTypes.length > 0 || selectedCurrencies.length > 0 || selectedReviews.length > 0;

  return (
    <Box
      sx={{
        borderBottom: 1,
        borderColor: 'divider',
        px: 5,
        py: 2
      }}
    >
      <Stack direction="row" spacing={1.25} alignItems="center" justifyContent="space-between">
        <Stack direction="row" spacing={1.25} flex={1}>
          <Box
            ref={gameTypeRef}
            onClick={handleGameTypeClick}
            sx={{
              border: 1,
              borderColor: 'divider',
              borderRadius: '8px',
              height: '41px',
              width: '272px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              px: 2.5,
              cursor: 'pointer',
              bgcolor: 'background.paper',
              '&:hover': {
                borderColor: 'text.secondary'
              }
            }}
          >
            <Stack direction="row" spacing={0.625} alignItems="center" sx={{ overflow: 'hidden', flex: 1 }}>
              {selectedGameTypes.length > 0 ? (
                selectedGameTypes.slice(0, 2).map((type) => (
                  <Chip
                    key={type}
                    label={gameTypeOptions.find(opt => opt.value === type)?.label || type}
                    onDelete={(e) => {
                      e.stopPropagation();
                      handleRemoveGameType(type);
                    }}
                    deleteIcon={
                      <Icon 
                        icon="mdi:close" 
                        width={14} 
                        height={14}
                      />
                    }
                    sx={{
                      backgroundColor: 'action.selected',
                      color: 'text.primary',
                      fontSize: '12px',
                      height: '20px',
                      borderRadius: '20px',
                      '& .MuiChip-deleteIcon': {
                        color: 'text.primary',
                        '&:hover': {
                          color: 'text.primary'
                        }
                      }
                    }}
                  />
                ))
              ) : (
                <Typography
                  sx={{
                    fontSize: '12px',
                    color: 'text.secondary',
                    fontFamily: 'Inter, sans-serif'
                  }}
                >
                  Filter by game type
                </Typography>
              )}
            </Stack>
            <Icon 
              icon="mdi:chevron-down" 
              width={16} 
              height={16}
              style={{ flexShrink: 0 }}
            />
          </Box>

          <Box
            ref={currencyRef}
            onClick={handleCurrencyClick}
            sx={{
              border: 1,
              borderColor: 'divider',
              borderRadius: '8px',
              height: '41px',
              width: '272px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              px: 2.5,
              cursor: 'pointer',
              bgcolor: 'background.paper',
              '&:hover': {
                borderColor: 'text.secondary'
              }
            }}
          >
            <Stack direction="row" spacing={0.625} alignItems="center" sx={{ overflow: 'hidden', flex: 1 }}>
              {selectedCurrencies.length > 0 ? (
                selectedCurrencies.slice(0, 2).map((currency) => (
                  <Chip
                    key={currency}
                    label={currencyOptions.find(opt => opt.value === currency)?.label || currency}
                    onDelete={(e) => {
                      e.stopPropagation();
                      handleRemoveCurrency(currency);
                    }}
                    deleteIcon={
                      <Icon 
                        icon="mdi:close" 
                        width={14} 
                        height={14}
                      />
                    }
                    sx={{
                      backgroundColor: 'action.selected',
                      color: 'text.primary',
                      fontSize: '12px',
                      height: '20px',
                      borderRadius: '20px',
                      '& .MuiChip-deleteIcon': {
                        color: 'text.primary',
                        '&:hover': {
                          color: 'text.primary'
                        }
                      }
                    }}
                  />
                ))
              ) : (
                <Typography
                  sx={{
                    fontSize: '12px',
                    color: 'text.secondary',
                    fontFamily: 'Inter, sans-serif'
                  }}
                >
                  Filter by currency
                </Typography>
              )}
            </Stack>
            <Icon 
              icon="mdi:chevron-down" 
              width={16} 
              height={16}
              style={{ flexShrink: 0 }}
            />
          </Box>

          <Box
            ref={reviewRef}
            onClick={handleReviewClick}
            sx={{
              border: 1,
              borderColor: 'divider',
              borderRadius: '8px',
              height: '41px',
              width: '272px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              px: 2.5,
              cursor: 'pointer',
              bgcolor: 'background.paper',
              '&:hover': {
                borderColor: 'text.secondary'
              }
            }}
          >
            <Typography
              sx={{
                fontSize: '12px',
                color: selectedReviews.length > 0 ? 'text.primary' : 'text.secondary',
                fontFamily: 'Inter, sans-serif'
              }}
            >
              {selectedReviews.length > 0 
                ? `${selectedReviews.length} review filter${selectedReviews.length > 1 ? 's' : ''}`
                : 'Filter by reviews'
              }
            </Typography>
            <Icon 
              icon="mdi:chevron-down" 
              width={16} 
              height={16}
              style={{ flexShrink: 0 }}
            />
          </Box>
        </Stack>

        {hasActiveFilters && (
          <Box
            onClick={handleClearAll}
            sx={{
              backgroundColor: 'action.hover',
              borderRadius: '10px',
              px: 2.5,
              py: 0.625,
              display: 'flex',
              alignItems: 'center',
              gap: 1.25,
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'action.selected'
              }
            }}
          >
            <Typography
              sx={{
                fontSize: '14px',
                color: 'text.primary',
                fontFamily: 'Inter, sans-serif',
                textDecoration: 'underline'
              }}
            >
              Clear all Filter
            </Typography>
            <Icon 
              icon="mdi:close-circle" 
              width={20} 
              height={20}
            />
          </Box>
        )}
      </Stack>

      <Popover
        open={Boolean(gameTypeAnchor)}
        anchorEl={gameTypeAnchor}
        onClose={handleCloseGameType}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        sx={{
          '& .MuiPopover-paper': {
            backgroundColor: 'background.paper',
            border: 1,
            borderColor: 'divider',
            borderRadius: '8px',
            mt: 0.5,
            minWidth: '272px'
          }
        }}
      >
        <Box sx={{ p: 2 }}>
          {gameTypeOptions.map((option) => (
            <FormControlLabel
              key={option.value}
              control={
                <Checkbox
                  checked={selectedGameTypes.includes(option.value)}
                  onChange={() => handleGameTypeToggle(option.value)}
                  sx={{
                    color: 'text.secondary',
                    '&.Mui-checked': {
                      color: 'primary.main'
                    }
                  }}
                />
              }
              label={
                <Typography
                  sx={{
                    color: 'text.primary',
                    fontSize: '14px',
                    fontFamily: 'Inter, sans-serif'
                  }}
                >
                  {option.label}
                </Typography>
              }
              sx={{ display: 'flex', width: '100%' }}
            />
          ))}
        </Box>
      </Popover>

      <Popover
        open={Boolean(currencyAnchor)}
        anchorEl={currencyAnchor}
        onClose={handleCloseCurrency}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        sx={{
          '& .MuiPopover-paper': {
            backgroundColor: 'background.paper',
            border: 1,
            borderColor: 'divider',
            borderRadius: '8px',
            mt: 0.5,
            minWidth: '272px'
          }
        }}
      >
        <Box sx={{ p: 2 }}>
          {currencyOptions.map((option) => (
            <FormControlLabel
              key={option.value}
              control={
                <Checkbox
                  checked={selectedCurrencies.includes(option.value)}
                  onChange={() => handleCurrencyToggle(option.value)}
                  sx={{
                    color: 'text.secondary',
                    '&.Mui-checked': {
                      color: 'primary.main'
                    }
                  }}
                />
              }
              label={
                <Typography
                  sx={{
                    color: 'text.primary',
                    fontSize: '14px',
                    fontFamily: 'Inter, sans-serif'
                  }}
                >
                  {option.label}
                </Typography>
              }
              sx={{ display: 'flex', width: '100%' }}
            />
          ))}
        </Box>
      </Popover>

      <Popover
        open={Boolean(reviewAnchor)}
        anchorEl={reviewAnchor}
        onClose={handleCloseReview}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        sx={{
          '& .MuiPopover-paper': {
            backgroundColor: 'background.paper',
            border: 1,
            borderColor: 'divider',
            borderRadius: '8px',
            mt: 0.5,
            minWidth: '272px'
          }
        }}
      >
        <Box sx={{ p: 2 }}>
          {reviewOptions.map((option) => (
            <FormControlLabel
              key={option.value}
              control={
                <Checkbox
                  checked={selectedReviews.includes(option.value)}
                  onChange={() => handleReviewToggle(option.value)}
                  sx={{
                    color: 'text.secondary',
                    '&.Mui-checked': {
                      color: 'primary.main'
                    }
                  }}
                />
              }
              label={
                <Typography
                  sx={{
                    color: 'text.primary',
                    fontSize: '14px',
                    fontFamily: 'Inter, sans-serif'
                  }}
                >
                  {option.label}
                </Typography>
              }
              sx={{ display: 'flex', width: '100%' }}
            />
          ))}
        </Box>
      </Popover>
    </Box>
  );
};

