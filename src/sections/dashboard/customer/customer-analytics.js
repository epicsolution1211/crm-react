import { useMemo, useState } from 'react';
import { endOfMonth, startOfMonth } from 'date-fns';

import Badge from '@mui/material/Badge';
import Box from "@mui/material/Box";
import Button from '@mui/material/Button';
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Grid from "@mui/system/Unstable_Grid/Grid";
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Popover from '@mui/material/Popover';
import Skeleton from '@mui/material/Skeleton';
import Stack from "@mui/material/Stack";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Tooltip from '@mui/material/Tooltip';
import Typography from "@mui/material/Typography";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { alpha } from '@mui/system/colorManipulator';
import { useTheme } from "@mui/material/styles";

import { Iconify } from 'src/components/iconify';
import { useGetCustomerAnalytics } from 'src/hooks/swr/use-customers';
import { useTimezone } from "src/hooks/use-timezone";

const ICON_MAP = {
  // Client & Basic Info
  client_id: 'account',
  client_name: 'account',
  external_user_id: 'account',

  total_packages: 'package',
  total_transactions: 'swap-horizontal',
  total_bets: 'casino',
  total_bets_count: 'casino',
  overall_status: 'check-circle',

  // Dates & Time
  from: 'calendar',
  to: 'calendar',
  first_bet_date: 'calendar',
  last_bet_date: 'calendar',
  first_transaction: 'calendar',
  last_transaction: 'calendar',
  last_balance_update: 'calendar',
  average_days_to_settlement: 'clock',
  total_days_active: 'clock',
  
  // Financial Amounts
  total_amount: 'currency-usd',
  total_bet_amount: 'currency-usd',
  total_win_amount: 'currency-usd',
  total_converted: 'currency-usd',
  total_usd_converted: 'currency-usd',
  total_gaming_volume: 'currency-usd',
  net_gaming_revenue: 'currency-usd',
  player_lifetime_value: 'currency-usd',
  net_position: 'currency-usd',
  
  // Balances
  balance: 'wallet',
  current_real_balance: 'wallet',
  current_bonus_balance: 'wallet',
  current_total_balance: 'wallet',
  highest_real_balance: 'wallet',
  highest_bonus_balance: 'wallet',
  balance_changes: 'wallet',
  
  // Deposits & Withdrawals
  total_deposits: 'bank',
  total_withdrawals: 'bank',
  deposit_count: 'bank',
  average_deposit: 'bank',
  largest_deposit: 'bank',
  first_deposit_count: 'bank',
  first_deposit_total: 'bank',
  days_between_deposits: 'bank',
  
  // Profit & Loss
  profit_loss: 'trending-up',
  total_profit_loss: 'trending-up',
  total_profit_loss_percentage: 'trending-up',
  house_edge: 'trending-up',
  house_edge_percentage: 'trending-up',
  
  // Rates & Percentages
  win_rate: 'percent',
  loss_rate: 'percent',
  pending_rate: 'percent',
  settlement_rate: 'percent',
  rtp_percentage: 'percent',
  win_to_deposit_ratio: 'percent',
  bonus_to_deposit_ratio: 'percent',
  withdrawal_to_deposit_ratio: 'percent',
  
  // Risk & Analysis
  risk_score: 'shield',
  risk_level: 'shield',
  betting_risk_level: 'shield',
  
  // Bonus Related
  bonus: 'gift',
  total_bonuses: 'gift',
  bonus_count: 'gift',
  average_bonus: 'gift',
  no_deposit_bonuses: 'gift',
  no_deposit_total: 'gift',
  
  // Counts & Statistics
  count: 'calculator',
  wins: 'trophy',
  losses: 'close-circle',
  pending: 'clock',
  cancelled: 'close-circle',
  void: 'close-circle',
  settled: 'check-circle',
  
  // Betting Metrics
  average_odds: 'chart-line',
  highest_odds: 'chart-line',
  lowest_odds: 'chart-line',
  average_selections: 'chart-line',
  single_bets: 'dice-multiple',
  multiple_bets: 'dice-multiple',
  live_bets: 'dice-multiple',
  pre_match_bets: 'dice-multiple',
  virtual_bets: 'dice-multiple',
  regular_bets: 'dice-multiple',
  
  // Transaction Status
  approved_transactions: 'check-circle',
  pending_transactions: 'clock',
  failed_transactions: 'close-circle',
  
  // Default
  default: 'chart-line'
};

// Common Components
const getIconForKey = (key, color = 'primary') => (
  <Box 
    sx={{
      backgroundColor: `${color}.main`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 24,
      height: 24,
      borderRadius: '50%',
      flexShrink: 0
    }}
  >
    <Iconify 
      icon={`mdi:${ICON_MAP[key] || ICON_MAP.default}`}
      sx={{ color: 'text.primary' }}
      width={18}
    />
  </Box>
);

const DataCard = ({ title, data, color = 'info', isSmall = false }) => {
  const theme = useTheme();
  const { toLocalTime } = useTimezone();
  const formatValue = (value, key) => {
    
    if (value === undefined || value === null) return 'N/A';

    if (['velocity_flags', 'pattern_details'].includes(key)) {
      return (
        <Stack direction="row" gap={0} flexWrap="wrap">
          {value.split(',').map((item, index) => (
            <Typography key={index} variant="caption" component="span">
              {item.trim().split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </Typography>
          ))}
        </Stack>
      );
    }

    if (typeof value === 'boolean') {
      return (
        <Iconify icon={value ? "gg:check-o" : "mdi:cross-circle-outline"} width={18} sx={{ color: value ? 'success.main' : 'error.main' }}/>
      );
    }
    const dateKeys = ['first_bet_date', 'last_bet_date', 'first_transaction', 'last_transaction', 'first_bonus_date', 'last_bonus_date'];
    if (dateKeys.includes(key) && value) {
      return toLocalTime(value, 'yyyy-MM-dd HH:mm');
    }
    if (['from', 'to'].includes(key) && value) {
      return toLocalTime(value).split(' ')[0];
    }
    
    if (typeof value !== 'number') return value;
    return Number.isInteger(value) ? value : value.toFixed(3);
  };

  return (
    <Paper 
      sx={{ 
        p: 2,
        width: '100%',
        height: '100%',
        bgcolor: alpha(theme.palette[color].main, 0.05),
        '&:hover': {
          boxShadow: theme.shadows[4],
          transform: 'translateY(-2px)',
          transition: 'all 0.3s'
        }
      }}
    >
      {title && (
        <Typography 
          variant="h6" 
          gutterBottom 
          sx={{ mb: 2 }}
        >
          {title}
        </Typography>
      )}
      <Grid container spacing={2}>
        {Object.entries(data ?? {}).map(([key, value]) => {
          if (typeof value === 'object' && value !== null) {
            return null;
          }
          const formattedKey = key.split('_').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' ');
          
          return (
            <Grid xs={12} sm={6} md={isSmall ? 3 : 2} key={key} sx={{ p: isSmall ? 0.5 : 'auto' }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'start',
                  gap: 1.5,
                  color: color ? `${color}.darker` : theme.palette.text.secondary
                }}
              >
                <Stack pt={1}>
                  {getIconForKey(key, color)}
                </Stack>
                <Stack direction='column' gap={isSmall ? 0 : 0.2}>
                  <Typography variant="caption">
                    {formattedKey}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color={color ? `${color}.darker` : 'text.primary'}
                    sx={{ 
                      width: '100%',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {formatValue(value, key)}
                  </Typography>
                </Stack>
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Paper>
  );
};

const DataCardSkeleton = () => {
  return (
    <Stack spacing={3}>
      {[1, 2, 3].map((card) => (
        <Paper key={card} sx={{ p: 2, width: '100%', height: '100%' }}>
          <Skeleton variant="text" width={200} height={32} sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Grid xs={12} sm={6} md={2} key={item}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Skeleton variant="circular" width={24} height={24} />
                  <Stack direction='column' gap={0.2} sx={{ flex: 1 }}>
                    <Skeleton variant="text" width={80} height={16} />
                    <Skeleton variant="text" width={60} height={20} />
                  </Stack>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>
      ))}
    </Stack>
  );
};

const NoData = () => (
  <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
    <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
      <Stack spacing={1} alignItems="center">
        <Iconify icon="solar:notebook-broken" width={40} sx={{ color: 'text.disabled' }} />
        <Typography variant="body2" color="text.disabled">No data available</Typography>
      </Stack>
    </TableCell>
  </TableRow>
);

// Transaction Components
const TransactionBreakdownTable = ({ data, title }) => {
  const [selectedCategory, setSelectedCategory] = useState('by_type');
  const [selectedTypes, setSelectedTypes] = useState({});

  const categories = {
    by_type: 'Types',
    by_status: 'Status',
    by_provider: 'Providers'
  };

  const handleCategoryChange = (event, newValue) => {
    if (newValue !== null) {
      setSelectedCategory(newValue);
      setSelectedTypes({}); // Reset selected types when changing category
    }
  };

  const renderTableContent = () => {
    const categoryData = data[selectedCategory] || {};
    const filteredData = Object.entries(categoryData)
      .filter(([type]) => !Object.keys(selectedTypes).length || selectedTypes[type]);

    if (filteredData.length === 0) {
      return <NoData />;
    }

    return filteredData.map(([type, stats]) => (
      <TableRow key={type} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
        <TableCell sx={{ textTransform: 'capitalize' }}>
          {type === 'none' ? 'Other' : type}
        </TableCell>
        <TableCell>{stats.count}</TableCell>
        <TableCell>{(stats.total_amount || 0).toFixed(2)}</TableCell>
        <TableCell>{(stats.average_amount || (stats.total_amount / stats.count)).toFixed(2)}</TableCell>
        <TableCell>{(stats.percentage_of_total || ((stats.count / Object.values(categoryData).reduce((sum, item) => sum + item.count, 0)) * 100)).toFixed(2)}%</TableCell>
      </TableRow>
    ));
  };

  return (
    <Box sx={{ mt: 3 }}>
    <Stack direction='row' justifyContent='space-between' alignItems='center' mb={2}>
      <Stack direction='row' alignItems='center' gap={1.5}>
        <Typography variant="h6">{title}</Typography>
        <Chip 
          label={`Approved: ${data?.approved_transactions ?? 0 }`} 
          variant="filled"
          size='small'
          color='success'
          sx={{ fontSize: 12 }}
        />
        <Chip 
          label={`Pending: ${data?.pending_transactions ?? 0 }`} 
          variant="filled"
          size='small'
          color='warning'
          sx={{ fontSize: 12 }}
        />
        <Chip 
          label={`Failed: ${data?.failed_transactions ?? 0 }`} 
          variant="filled"
          size='small'
          color='error'
          sx={{ fontSize: 12 }}
        />
      </Stack>
      <ToggleButtonGroup
        value={selectedCategory}
        exclusive
        color='primary'
        size='small'
        onChange={handleCategoryChange}
        aria-label="transaction category"
        sx={{ 
          display: 'flex',
          flexWrap: 'wrap',
          '& .MuiToggleButton-root': {
            textTransform: 'none',
            px: 3,
            py: 1,
          }
        }}
      >
        {Object.entries(categories).map(([value, label]) => (
          <ToggleButton key={value} value={value}>
            {label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Stack>
      
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell width="20%">Category</TableCell>
              <TableCell width="20%">Count</TableCell>
              <TableCell width="20%">Total Amount</TableCell>
              <TableCell width="20%">Average Amount</TableCell>
              <TableCell width="20%">Percentage of Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {renderTableContent()}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

const TransactionPaymentBreakdownTable = ({ data, title }) => {
  const [selectedCategory, setSelectedCategory] = useState('by_payment_method');

  const categories = {
    by_payment_method: 'Payment Methods',
    by_external_brand: 'External Brands'
  };

  const handleCategoryChange = (event, newValue) => {
    if (newValue !== null) {
      setSelectedCategory(newValue);
    }
  };

  const renderTableContent = () => {
    const categoryData = data?.[selectedCategory] || {};
    const entries = Object.entries(categoryData);

    if (entries.length === 0) {
      return <NoData />;
    }

    return entries.map(([type, stats]) => (
      <TableRow key={type} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
        <TableCell sx={{ textTransform: 'capitalize' }}>
          {type === 'unknown' ? 'Other' : type}
        </TableCell>
        <TableCell>{stats.count}</TableCell>
        <TableCell>{(stats.total_amount || 0).toFixed(2)}</TableCell>
        <TableCell>{(stats.total_amount / stats.count).toFixed(2)}</TableCell>
        <TableCell>
          {((stats.count / Object.values(categoryData).reduce((sum, item) => sum + item.count, 0)) * 100).toFixed(2)}%
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Stack direction='row' justifyContent='space-between' alignItems='center' mb={2}>
        <Stack direction='row' alignItems='center' gap={1.5}>
          <Typography variant="h6">{title}</Typography>
          <Chip 
            label={`Approved: ${data?.approved_transactions ?? 0 }`} 
            variant="filled"
            size='small'
            color='success'
            sx={{
              fontSize: '12px'
            }}
          />
          <Chip 
            label={`Pending: ${data?.pending_transactions ?? 0 }`} 
            variant="filled"
            size='small'
            color='warning'
            sx={{
              fontSize: '12px'
            }}
          />
          <Chip 
            label={`Failed: ${data?.failed_transactions ?? 0 }`} 
            variant="filled"
            size='small'
            color='error'
            sx={{
              fontSize: '12px'
            }}
          />
        </Stack>
        <ToggleButtonGroup
          value={selectedCategory}
          exclusive
          size='small'
          color='primary'
          onChange={handleCategoryChange}
          aria-label="payment category"
          sx={{ 
            display: 'flex',
            flexWrap: 'wrap',
            '& .MuiToggleButton-root': {
              textTransform: 'none',
              px: 3,
              py: 1,
            }
          }}
        >
          {Object.entries(categories).map(([value, label]) => (
            <ToggleButton key={value} value={value}>
              {label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Stack>
      
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell width="20%">Category</TableCell>
              <TableCell width="20%">Count</TableCell>
              <TableCell width="20%">Total Amount</TableCell>
              <TableCell width="20%">Average Amount</TableCell>
              <TableCell width="20%">Percentage of Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {renderTableContent()}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

const TransactionTimeAnalyticsTable = ({ data, title }) => {
  const entries = Object.entries(data?.monthly_breakdown ?? {});
  return (
    <Box sx={{ mt: 3 }}>
      <Stack direction='row' justifyContent='flex-start' alignItems='center' gap={1.5} mb={2}>
        <Typography variant="h6">{title}</Typography>
        <Stack direction='row' justifyContent='flex-start' alignItems='center' gap={1.5}>
          <Chip 
            label={`Average transaction per day: ${data?.transaction_frequency?.average_transactions_per_day ?? 0 }`} 
            variant="filled"
            size='small'
            color='success'
            sx={{ fontSize: 12 }}
          />
          <Chip 
            label={`Total days active: ${data?.transaction_frequency?.total_days_active ?? 0 }`} 
            variant="filled"
            size='small'
            color='info'
            sx={{ fontSize: 12 }}
          />
        </Stack>
      </Stack>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell width="20%" sx={{ whiteSpace: 'nowrap' }}>Period</TableCell>
              <TableCell width="20%" sx={{ whiteSpace: 'nowrap' }}>Count</TableCell>
              <TableCell width="20%" sx={{ whiteSpace: 'nowrap' }}>Total Amount</TableCell>
              <TableCell width="20%" sx={{ whiteSpace: 'nowrap' }}>Deposits</TableCell>
              <TableCell width="20%" sx={{ whiteSpace: 'nowrap' }}>Bonuses</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {entries.length > 0 ? entries.map(([period, stats]) => (
              <TableRow key={period} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell>{period}</TableCell>
                <TableCell>{stats?.count ?? 0}</TableCell>
                <TableCell>{(stats?.total_amount ?? 0).toFixed(2)}</TableCell>
                <TableCell>{stats?.deposits ?? 0}</TableCell>
                <TableCell>{stats?.bonuses ?? 0}</TableCell>
              </TableRow>
            )) : <NoData />}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

// Bet Components
const BetBreakdownTable = ({ data, title }) => {
  const [selectedCategory, setSelectedCategory] = useState('by_type');

  const categories = {
    by_type: 'Types',
    by_category: 'Categories'
  };

  const handleCategoryChange = (event, newValue) => {
    if (newValue !== null) {
      setSelectedCategory(newValue);
    }
  };
  const renderTableContent = () => {
    const categoryData = selectedCategory === 'by_type' ? (data.by_type || {}) : (data.by_category || {});
    const entries = Object.entries(categoryData);

    if (entries.length === 0) {
      return <NoData />;
    }

    return entries.map(([type, stats]) => {
      // Calculate win rate if not provided
      const totalBetAmount = stats.total_bet_amount || stats.total_amount || 0;
      const totalWinAmount = stats.total_win_amount || 0;
      const winRate = stats.win_rate || (totalBetAmount > 0 ? (totalWinAmount / totalBetAmount * 100) : 0);

      return (
        <TableRow key={type} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
          <TableCell sx={{ textTransform: 'capitalize' }}>
            {type === 'none' ? 'Other' : type}
          </TableCell>
          <TableCell>{stats.count}</TableCell>
          <TableCell>{totalBetAmount.toFixed(2)}</TableCell>
          <TableCell>{totalWinAmount.toFixed(2)}</TableCell>
          <TableCell>{winRate.toFixed(2)}%</TableCell>
        </TableRow>
      );
    });
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Stack direction='row' justifyContent='space-between' alignItems='center' mb={2}>
        <Typography variant="h6">{title}</Typography>
        <ToggleButtonGroup
          value={selectedCategory}
          exclusive
          size='small'
          color='primary'
          onChange={handleCategoryChange}
          aria-label="bet category"
          sx={{ 
            display: 'flex',
            flexWrap: 'wrap',
            '& .MuiToggleButton-root': {
              textTransform: 'none',
              px: 3,
              py: 1,
            }
          }}
        >
          {Object.entries(categories).map(([value, label]) => (
            <ToggleButton key={value} value={value}>
              {label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Stack>
      
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell width="20%">Category</TableCell>
              <TableCell width="20%">Count</TableCell>
              <TableCell width="20%">Total Amount</TableCell>
              <TableCell width="20%">Win Amount</TableCell>
              <TableCell width="20%">Win Rate</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {renderTableContent()}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

const BetPlatformBreakdownTable = ({ data, title }) => {
  const [selectedCategory, setSelectedCategory] = useState('by_platform');

  const categories = {
    by_platform: 'Platforms',
    by_source: 'Sources',
    by_brand: 'Brands'
  };

  const handleCategoryChange = (event, newValue) => {
    if (newValue !== null) {
      setSelectedCategory(newValue);
    }
  };

  const renderTableContent = () => {
    const categoryData = data[selectedCategory] || {};
    const entries = Object.entries(categoryData);

    if (entries.length === 0) {
      return <NoData />;
    }

    return entries.map(([type, stats]) => {
      const totalBetAmount = stats.total_bet_amount || stats.total_amount || 0;
      const totalWinAmount = stats.total_win_amount || 0;
      const winRate = stats.win_rate || (totalBetAmount > 0 ? (totalWinAmount / totalBetAmount * 100) : 0);

      // Convert snake_case to Title Case
      const displayType = type.split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      return (
        <TableRow key={type} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
          <TableCell sx={{ textTransform: 'capitalize' }}>
            {displayType}
          </TableCell>
          <TableCell>{stats.count}</TableCell>
          <TableCell>{totalBetAmount.toFixed(2)}</TableCell>
          <TableCell>{totalWinAmount.toFixed(2)}</TableCell>
          <TableCell>{winRate.toFixed(2)}%</TableCell>
        </TableRow>
      );
    });
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Stack direction='row' justifyContent='space-between' alignItems='center' mb={2}>
        <Typography variant="h6">{title}</Typography>
        <ToggleButtonGroup
          value={selectedCategory}
          exclusive
          size='small'
          color='primary'
          onChange={handleCategoryChange}
          aria-label="platform category"
          sx={{ 
            display: 'flex',
            flexWrap: 'wrap',
            '& .MuiToggleButton-root': {
              textTransform: 'none',
              px: 3,
              py: 1,
            }
          }}
        >
          {Object.entries(categories).map(([value, label]) => (
            <ToggleButton key={value} value={value}>
              {label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Stack>
      
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell width="20%">Category</TableCell>
              <TableCell width="20%">Count</TableCell>
              <TableCell width="20%">Total Amount</TableCell>
              <TableCell width="20%">Win Amount</TableCell>
              <TableCell width="20%">Win Rate</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {renderTableContent()}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

const BetTimeAnalyticsTable = ({ data, title }) => {
  const entries = Object.entries(data?.monthly_breakdown ?? {});

  return (
    <Box sx={{ mt: 3 }}>
      <Stack direction='row' justifyContent='flex-start' alignItems='center' gap={1} mb={2}>
        <Typography variant="h6">{title}</Typography>
        <Stack direction='row' justifyContent='flex-start' alignItems='center' gap={1}>
          <Chip 
            label={`Average days to settlement: ${data?.settlement_analysis?.average_days_to_settlement ?? 0 }`} 
            variant="filled"
            size='small'
            color='success'
            sx={{ fontSize: 12 }}
          />
          <Chip 
            label={`Fastest settlement: ${data?.settlement_analysis?.fastest_settlement ?? 0 }`} 
            variant="filled"
            size='small'
            color='info'
            sx={{ fontSize: 12 }}
          />
          <Chip 
            label={`Slowest settlement: ${data?.settlement_analysis?.slowest_settlement ?? 0 }`} 
            variant="filled"
            size='small'
            color='warning'
            sx={{ fontSize: 12 }}
          />
        </Stack>
      </Stack>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell width="16.67%" sx={{ whiteSpace: 'nowrap' }}>Period</TableCell>
              <TableCell width="16.67%" sx={{ whiteSpace: 'nowrap' }}>Count</TableCell>
              <TableCell width="16.67%" sx={{ whiteSpace: 'nowrap' }}>Bet Amount</TableCell>
              <TableCell width="16.67%" sx={{ whiteSpace: 'nowrap' }}>Total Win Amount</TableCell>
              <TableCell width="16.67%" sx={{ whiteSpace: 'nowrap' }}>Wins</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {entries.length > 0 ? entries.map(([period, stats]) => (
              <TableRow key={period} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell>{period}</TableCell>
                <TableCell>{stats.count}</TableCell>
                <TableCell>{(stats.total_bet_amount || 0).toFixed(2)}</TableCell>
                <TableCell>{(stats.total_win_amount || 0).toFixed(2)}</TableCell>
                <TableCell>{stats.wins || 0}</TableCell>
              </TableRow>
            )) : <NoData />}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

const BetRiskAnalyticsTable = ({ data, title }) => {
  const highRiskEntries = Object.entries(data?.high_risk_indicators ?? {});
  const stakeDistEntries = Object.entries(data?.stake_distribution ?? {});

  return (
    <Box sx={{ mt: 3 }}>
      <Stack direction='row' justifyContent='flex-start' alignItems='center' gap={1.5} mb={2}>
        <Typography variant="h6">{title}</Typography>
        <Stack direction='row' justifyContent='flex-start' alignItems='center' gap={1.5}>
          <Chip 
            label={`Risk Score: ${data?.risk_score?.toFixed(2) ?? 0}`} 
            variant="filled"
            size='small'
            color={data?.risk_level === 'low' ? 'success' : data?.risk_level === 'medium' ? 'warning' : 'error'}
            sx={{ fontSize: 12 }}
          />
          <Chip 
            label={`Risk Level: ${data?.risk_level?.toUpperCase() ?? 'N/A'}`} 
            variant="filled"
            size='small'
            color={data?.risk_level === 'low' ? 'success' : data?.risk_level === 'medium' ? 'warning' : 'error'}
            sx={{ fontSize: 12 }}
          />
        </Stack>
      </Stack>

      <Grid container spacing={2}>
        {/* High Risk Indicators Table */}
        <Grid item xs={12} md={6}>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell colSpan={2} sx={{ pb: 0 }}>
                    <Stack direction="row" alignItems="center" gap={1}>
                      <Iconify icon="charm:shield-warning" width={20} color="text.primary" />
                      <Typography variant="subtitle2" color="text.primary" fontWeight={600}>
                        High Risk Indicators
                      </Typography>
                    </Stack>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell width="50%">Indicator</TableCell>
                  <TableCell width="50%">Count</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {highRiskEntries.length > 0 ? highRiskEntries.map(([key, value]) => (
                  <TableRow key={key} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell sx={{ textTransform: 'capitalize' }}>
                      {key.split('_').join(' ')}
                    </TableCell>
                    <TableCell>{value}</TableCell>
                  </TableRow>
                )) : <NoData />}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        {/* Stake Distribution Table */}
        <Grid item xs={12} md={6}>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell colSpan={2} sx={{ pb: 0 }}>
                    <Stack direction="row" alignItems="center" gap={1}>
                      <Iconify icon="ph:stack" width={20} color="text.primary" />
                      <Typography variant="subtitle2" color="text.primary" fontWeight={600}>
                        Stake Distribution
                      </Typography>
                    </Stack>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell width="50%">Level</TableCell>
                  <TableCell width="50%">Count</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stakeDistEntries.length > 0 ? stakeDistEntries.map(([key, value]) => (
                  <TableRow key={key} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell sx={{ textTransform: 'capitalize' }}>
                      {key.split('_').join(' ')}
                    </TableCell>
                    <TableCell>{value}</TableCell>
                  </TableRow>
                )) : <NoData />}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Box>
  );
};

// Summary
const Summary = ({ data }) => {
  const { betting_summary, transaction_summary, combined_metrics } = data.summary ?? {};

  return (
    <Stack spacing={3}>
      <DataCard 
        title="Betting Summary" 
        data={betting_summary}
        color='primary'
      />
      <DataCard 
        title="Transaction Summary" 
        data={transaction_summary}
        color='success'
      />
      <DataCard 
        title="Combined Metrics" 
        data={combined_metrics}
        color='secondary'
      />
    </Stack>
  );
};

// Bet Analytics
const BetAnalytics = ({ data }) => {
  const {
    client_info,
    financial_totals,
    outcome_breakdown,
    performance_metrics,
    bet_type_breakdown,
    platform_breakdown,
    time_analysis,
    risk_analysis
  } = data.bet_analytics ?? {};

  return (
    <Stack spacing={3}>
      <DataCard 
        title="Client Info"
        color='primary'
        data={{
          client_name: client_info.client_name,
          total_bets_count: client_info.total_bets_count,
          from: client_info.date_range.from,
          to: client_info.date_range.to,
          first_bet_date: client_info.date_range.first_bet_date,
          last_bet_date: client_info.date_range.last_bet_date
        }}
      />
      {financial_totals && (
        <DataCard 
          title="Financial Totals"
          color='success'
          data={financial_totals}
        />
      )}
      {outcome_breakdown && (
        <DataCard 
          title="Outcome Breakdown"
          color='warning'
          data={outcome_breakdown}
        />
      )}
      {performance_metrics && (
        <DataCard 
          title="Performance Metrics"
          color='info'
          data={performance_metrics}
        />
      )}

      <BetBreakdownTable 
        title="Bet Breakdown" 
        data={bet_type_breakdown}
      />

      <BetPlatformBreakdownTable 
        title="Platform Breakdown" 
        data={platform_breakdown}
      />

      <BetTimeAnalyticsTable 
        title="Time Analysis - Monthly Breakdown" 
        data={time_analysis}
      />

      <BetRiskAnalyticsTable 
        title="Risk Analysis" 
        data={risk_analysis}
      />
    </Stack>
  );
};

// Transaction Analytics
const TransactionAnalytics = ({ data }) => {
  const {
    client_info,
    financial_analysis,
    transaction_breakdown,
    deposit_analysis,
    bonus_analysis,
    win_loss_analysis,
    casino_ratios,
    payment_analysis,
    balance_analysis,
    time_analysis
  } = data.transaction_analytics;

  return (
    <Stack spacing={3}>
      <DataCard 
        title="Client Info" 
        color="primary"
        data={{
          client_name: client_info.client_name,
          total_transactions: client_info.total_transactions,
          from: client_info.date_range.from,
          to: client_info.date_range.to,
          first_transaction: client_info.date_range.first_transaction,
          last_transaction: client_info.date_range.last_transaction
        }}
      />
      {financial_analysis && (
        <DataCard 
          title="Financial Analysis"
          color="success" 
          data={financial_analysis}
        />
      )}
      {deposit_analysis && (
        <DataCard 
          title="Deposit Analysis"
          color="warning"
          data={deposit_analysis}
        />
      )}
      {bonus_analysis && (
        <DataCard 
          title="Bonus Analysis"
          color="secondary"
          data={bonus_analysis}
        />
      )}
      {win_loss_analysis && (
        <DataCard 
          title="Win/Loss Analysis"
          color="error"
          data={win_loss_analysis}
        />
      )}
      {casino_ratios && (
        <DataCard 
          title="Casino Ratios"
          color="info"
          data={casino_ratios}
        />
      )}
      {balance_analysis && (
        <DataCard 
          title="Balance Analysis"
          color="primary"
          data={balance_analysis}
        />
      )}
      <TransactionBreakdownTable 
        title="Transaction Breakdown" 
        data={{...transaction_breakdown, ...payment_analysis}}
      />
      <TransactionPaymentBreakdownTable 
        title="Payment Analysis" 
        data={payment_analysis}
      />
      <TransactionTimeAnalyticsTable 
        title="Time Analysis - Monthly Breakdown" 
        data={time_analysis}
        isTransaction
      />
    </Stack>
  );
};

// Constants for Bonus Package Analytics
const BONUS_PACKAGE_DATA_CARDS = [
  { title: "Betting Stats", color: "success", field: "betting_stats" },
  { title: "Bonus Performance", color: "warning", field: "bonus_performance" },
  { title: "Player Behavior", color: "error", field: "player_behavior" },
  { title: "Lifecycle Metrics", color: "secondary", field: "lifecycle_metrics" },
  { title: "Financial Impact", color: "primary", field: "financial_impact" },
  { title: "Game Analytics", color: "info", field: "game_analytics" }
];

const BONUS_CHIPS = [
  {
    labelPrefix: "Duration",
    getValue: (bonusPackage, toLocalTime) => 
      `${toLocalTime(bonusPackage.first_bonus_date)} - ${toLocalTime(bonusPackage.last_bonus_date)}`,
    color: "primary"
  },
  {
    labelPrefix: "Bonus Type",
    getValue: (bonusPackage) => bonusPackage.bonus_type,
    color: "info"
  },
  {
    labelPrefix: "External Brand",
    getValue: (bonusPackage) => bonusPackage.external_brand,
    color: "secondary"
  },
  {
    labelPrefix: "Wagered amount",
    getValue: (bonusPackage) => bonusPackage.total_bonus_amount,
    color: "success"
  }
];

const BonusChip = ({ labelPrefix, value, color }) => (
  <Chip 
    size="small"
    label={`${labelPrefix}: ${value ?? ""}`}
    sx={{
      backgroundColor: (theme) => alpha(theme.palette[color].main, 0.3),
    }}
  />
);

const BonusPackageHeader = ({ bonusPackage, toLocalTime }) => (
  <Stack direction="row" alignItems="center" justifyContent="space-between">
    <Stack direction="row" alignItems="center" spacing={1}>
      <Box 
        sx={{
          backgroundColor: 'primary.main',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 30,
          height: 30,
          borderRadius: '20%',
          flexShrink: 0
        }}
      >
        <Iconify 
          icon="fluent:gift-24-regular"
          sx={{ color: 'text.primary' }}
          width={24}
        />
      </Box>

      <Tooltip 
        title={bonusPackage?.last_status?.description && (
          <Typography variant="caption" noWrap sx={{ bgcolor: 'info.main', p: 0.5, borderRadius: 1 }}>
            Reason: {bonusPackage?.last_status?.description ?? ""}
          </Typography>
        )}
      >
        <Typography variant="subtitle1" noWrap>
          {bonusPackage?.bonus_code ?? ""} :
          {bonusPackage?.last_status && (
            <Typography 
              variant="subtitle2" 
              component='span'
              pl={1} 
            >
              {bonusPackage?.last_status?.display_status ?? ""}
            </Typography>
          )}
        </Typography>
      </Tooltip>

      <Stack direction="row" gap={1} pl={1} sx={{ flexWrap: 'wrap' }}>
        {BONUS_CHIPS.map((chip, idx) => (
          <BonusChip
            key={idx}
            labelPrefix={chip.labelPrefix}
            value={chip.getValue(bonusPackage, toLocalTime)}
            color={chip.color}
          />
        ))}
      </Stack>
    </Stack>
  </Stack>
);

const BonusPackageCard = ({ bonusPackage, index, isExpanded, onExpand, toLocalTime }) => (
  <Card 
    sx={{ 
      p: 2,
      borderRadius: 1,
      border: '1px dashed',
      borderColor: (theme) => alpha(theme.palette.primary.main, 0.3),
      cursor: 'pointer',
      transition: 'all 0.3s',
      backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.03),
      '&:hover': {
        transform: 'translateY(-1px)',
        boxShadow: (theme) => theme.shadows[4]
      }
    }}
    onClick={() => onExpand(index)}
  >
    <Stack spacing={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <BonusPackageHeader bonusPackage={bonusPackage} toLocalTime={toLocalTime} />
        <Iconify 
          icon={isExpanded ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
          width={20}
        />
      </Stack>

      {!isExpanded && (
        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
          <DataCard
            isSmall
            color="success"
            data={bonusPackage.betting_stats}
          />
        </Stack>
      )}

      {isExpanded && (
        <Stack spacing={2} sx={{ mt: 1 }}>
          <Divider />
          {BONUS_PACKAGE_DATA_CARDS?.map((card, idx) => (
            bonusPackage?.[card.field] && (
              <DataCard
                key={idx}
                title={card.title}
                color={card.color}
                data={bonusPackage[card.field]}
              />
            )
          ))}
          <DataCard
            title="Risk Indicators"
            color="error"
            data={{
              ...bonusPackage.risk_indicators,
              velocity_flags:  bonusPackage.risk_indicators.velocity_flags.join(', '),
              pattern_details: bonusPackage.risk_indicators.pattern_details.join(', ')
            }}
          />
        </Stack>
      )}
    </Stack>
  </Card>
);

const BonusPackagesAnalytics = ({ data }) => {
  const { bonus_packages } = data.bonus_packages;
  const { toLocalTime } = useTimezone();
  const [expandedPackage, setExpandedPackage] = useState(null);

  const handleExpandPackage = (index) => {
    setExpandedPackage(expandedPackage === index ? null : index);
  };

  return (
    <Stack spacing={3}>
      <DataCard 
        title="Client Info" 
        color="primary"
        data={{
          client_name: data.bonus_packages.client_name,
          external_user_id: data.bonus_packages.external_user_id,
          total_packages: data.bonus_packages.total_packages ?? 0,
        }}
      />

      <Grid container spacing={2}>
        {bonus_packages?.map((bonusPackage, index) => (
          <Grid item xs={12} key={index}>
            <BonusPackageCard
              bonusPackage={bonusPackage}
              index={index}
              isExpanded={expandedPackage === index}
              onExpand={handleExpandPackage}
              toLocalTime={toLocalTime}
            />
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
};

export const CustomerAnalytics = ({ customerId }) => {
  const theme = useTheme();
  const { toUTCTime, toLocalTime } = useTimezone();

  const [currentTab, setCurrentTab] = useState(0);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [dateRange, setDateRange] = useState({ start_date: null, end_date: null });

  const [anchorEl, setAnchorEl] = useState(null);

  const filterParams = useMemo(() => {
    if (dateRange.start_date && dateRange.end_date) {
      return {
        date_from: dateRange.start_date,
        date_to: dateRange.end_date
      }
    }
    return null;
  }, [dateRange]);

  const { analytics, isLoading } = useGetCustomerAnalytics(customerId, filterParams);

  const handleTabChange = (event, newValue) => {
    if (newValue !== null) {
      setCurrentTab(newValue);
    }
  };

  const handleFilterClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setAnchorEl(null);
  };

  const handleApplyDateRange = () => {
    if (startDate && endDate) {
      setDateRange({
        start_date: toUTCTime(startDate),
        end_date: toUTCTime(endDate)
      });
    }
    handleFilterClose();
  };

  const handleClearDateRange = () => {
    setStartDate(null);
    setEndDate(null);
    setDateRange({ start_date: null, end_date: null });
    handleFilterClose();
  };

  const handleCurrentMonth = () => {
    const now = new Date();
    const firstDay = startOfMonth(now);
    const lastDay = endOfMonth(now);
    setStartDate(firstDay);
    setEndDate(lastDay);
    setDateRange({ start_date: toUTCTime(firstDay), end_date: toUTCTime(lastDay) });
    handleApplyDateRange();
  };

  const open = Boolean(anchorEl);
  const id = open ? 'date-range-popover' : undefined;

  return (
    <Stack spacing={3}>
      <Card>
        <Stack 
          sx={{
            flexDirection: { xs: 'row', md: 'row' },
            justifyContent: { xs: 'start', md: 'space-between' },
            alignItems: { xs: 'start', md: 'center' },
            gap: { xs: 2, md: 0 },
            px: 2,
            pt: 2
          }}
        >
          <Stack direction="row" alignItems="center" gap={2}>
            <ToggleButtonGroup
              value={currentTab}
              exclusive
              size='small'
              onChange={handleTabChange}
              aria-label="analytics view"
              sx={{ 
                display: 'flex',
                flexWrap: 'wrap',
                '& .MuiToggleButton-root': {
                  textTransform: 'none',
                  px: 3,
                  py: 1,
                  '&.Mui-selected': {
                    bgcolor: alpha(theme.palette.primary.main, 0.2),
                  }
                }
              }}
            >
              <ToggleButton value={0} sx={{ width: { xs: '100%', md: 'auto' } }}>
                <Stack direction="row" alignItems="center" gap={1}>
                  <Iconify icon="solar:chart-2-bold" width={20} />
                  Summary
                </Stack>
              </ToggleButton>
              <ToggleButton value={1} sx={{ width: { xs: '100%', md: 'auto' } }}>
                <Stack direction="row" alignItems="center" gap={1}>
                  <Iconify icon="ic:outline-casino" width={20} />
                  Bet Analytics
                </Stack>
              </ToggleButton>
              <ToggleButton value={2} sx={{ width: { xs: '100%', md: 'auto' } }}>
                <Stack direction="row" alignItems="center" gap={1}>
                  <Iconify icon="mingcute:transfer-line" width={20} />
                  Transaction Analytics
                </Stack>
              </ToggleButton>
              <ToggleButton value={3} sx={{ width: { xs: '100%', md: 'auto' } }}>
                <Stack direction="row" alignItems="center" gap={1}>
                  <Iconify icon="basil:present-outline" width={20} />
                  Bonus Packages
                </Stack>
              </ToggleButton>
            </ToggleButtonGroup>
            {filterParams && (
              <Chip 
                label={filterParams ? `Date Range: ${toLocalTime(filterParams.date_from, 'yyyy-MM-dd') + ' - ' + toLocalTime(filterParams.date_to, 'yyyy-MM-dd')}` : ''}
                variant="filled"
                color="primary"
                sx={{ fontSize: 12 }}
                onDelete={()=> {
                  setStartDate(null);
                  setEndDate(null);
                  setDateRange({ start_date: null, end_date: null });
                }}
              />
            )}
          </Stack>

          <Tooltip title="Filter">
            <Badge 
              color="error"
              variant="dot"
              overlap="circular"
              invisible={!filterParams}
            >
              <IconButton onClick={handleFilterClick} color="primary">
                <Iconify icon="iconoir:filter" width={24} />
              </IconButton>
            </Badge>
          </Tooltip>

          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleFilterClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <Box sx={{ p: 2, width: 320 }}>
              <Stack spacing={2}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Start Date"
                    value={startDate}
                    onChange={(newValue) => setStartDate(newValue)}
                    slotProps={{
                      textField: {
                        size: 'small',
                        fullWidth: true
                      }
                    }}
                  />
                  <DatePicker
                    label="End Date"
                    value={endDate}
                    onChange={(newValue) => setEndDate(newValue)}
                    slotProps={{
                      textField: {
                        size: 'small',
                        fullWidth: true
                      }
                    }}
                  />
                </LocalizationProvider>
                <Stack direction="column" spacing={1}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={handleCurrentMonth}
                    startIcon={<Iconify icon="mdi:calendar-month" width={20} />}
                    sx={{ whiteSpace: 'nowrap' }}
                    size='small'
                  >
                    Current Month
                  </Button>
                  <Stack direction="row" spacing={1}>
                    <Button
                      disabled={!startDate || !endDate}
                      fullWidth
                      variant="outlined"
                      color="primary"
                      onClick={handleApplyDateRange}
                      size='small'
                    >
                      Apply
                    </Button>
                    <Button
                      disabled={!startDate || !endDate}
                      fullWidth
                      variant="outlined"
                      color="error"
                      onClick={handleClearDateRange}
                      size='small'
                    >
                      Clear
                    </Button>
                  </Stack>
                </Stack>
              </Stack>
            </Box>
          </Popover>
        </Stack>
        <Divider sx={{ mt: 2 }} />
        <CardContent>
          {isLoading ? (
            <DataCardSkeleton />
          ) : (
            <>
              {currentTab === 0 && <Summary data={analytics} />}
              {currentTab === 1 && <BetAnalytics data={analytics} />}
              {currentTab === 2 && <TransactionAnalytics data={analytics} />}
              {currentTab === 3 && <BonusPackagesAnalytics data={analytics} />}
            </>
          )}
        </CardContent>
      </Card>
    </Stack>
  );
};


