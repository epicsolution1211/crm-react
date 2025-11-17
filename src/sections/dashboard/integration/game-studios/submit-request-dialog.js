import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import { Icon } from '@iconify/react';

import { QuillEditor } from 'src/components/quill-editor';

const PROVIDER_TYPES = [
  'Game Studios',
  'Payment provider',
  'KYC Platforms',
  'Affiliate Network',
  'SEO & Marketing',
  'Technology Providers'
];

const PROVIDER_CATEGORIES = {
  'Game Studios': [
    'Slot Games',
    'Casino Games',
    'Live Casino',
    'Sports Games',
    'Jackpots',
    'Table Games',
    'Virtual Sports',
    'Crash Games',
    'Skill Games',
    'Lottery & Bingo'
  ],
  'Payment provider': [
    'Card Payments (Visa, Mastercard)',
    'Crypto Payments',
    'Bank Transfers',
    'E-wallets',
    'Instant Payments',
    'PSP Integration',
    'High-risk Processing',
    'Recurring Payments',
    'Payment Gateways',
    'Chargeback Protection'
  ],
  'KYC Platforms': [
    'Identity Verification',
    'Document Verification',
    'Age Verification',
    'Address Verification',
    'AML Screening',
    'Transaction Monitoring',
    'Fraud Detection',
    'Risk Scoring',
    'Sanction & PEP Screening'
  ],
  'Affiliate Network': [
    'Casino Affiliate Programs',
    'Sports Betting Affiliates',
    'Hybrid CPA/RevShare Deals',
    'Affiliate Management Software',
    'Influencer Partnerships',
    'Traffic Monetization',
    'Lead Generation',
    'Campaign Tracking'
  ],
  'SEO & Marketing': [
    'SEO Optimization',
    'Content Marketing',
    'PPC Campaigns (Google, Meta, etc.)',
    'Social Media Marketing',
    'Email Marketing',
    'Reputation Management',
    'PR & Branding',
    'Link Building',
    'Conversion Optimization'
  ],
  'Technology Providers': [
    'Casino Platform (iGaming Platform)',
    'Sportsbook Platform',
    'Back-office Solutions',
    'Game Aggregation Platform',
    'Payment Gateway Integration',
    'API & Custom Development',
    'Website Development',
    'Mobile App Development'
  ]
};

export const SubmitRequestDialog = ({ open, onClose }) => {
  const [selectedProviderType, setSelectedProviderType] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [description, setDescription] = useState('');
  const [consentChecked, setConsentChecked] = useState(false);

  const handleProviderTypeClick = (type) => {
    setSelectedProviderType(type);
    setSelectedCategories([]);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((item) => item !== category);
      }
      return [...prev, category];
    });
  };

  const handleSubmit = () => {
    console.log({
      providerType: selectedProviderType,
      categories: selectedCategories,
      description
    });
    onClose();
  };

  const handleClose = () => {
    setSelectedProviderType('');
    setSelectedCategories([]);
    setDescription('');
    setConsentChecked(false);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: '#242e3f',
          borderRadius: '20px',
          maxWidth: '700px',
          overflow: 'hidden'
        }
      }}
    >
      <Box sx={{ p: 2.5 }}>
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography
            sx={{
              fontSize: '18px',
              fontWeight: 700,
              color: 'white',
              textTransform: 'uppercase',
              lineHeight: 1.57,
              fontFamily: 'Inter, sans-serif'
            }}
          >
            Submit Request
          </Typography>
          <Typography
            sx={{
              fontSize: '14px',
              fontWeight: 300,
              color: 'white',
              lineHeight: 'normal',
              fontFamily: 'Poppins, sans-serif',
              mt: 0.5
            }}
          >
            We will submit your request to all related providers
          </Typography>
        </Box>

        <Typography
          sx={{
            fontSize: '18px',
            fontWeight: 700,
            color: 'white',
            textTransform: 'uppercase',
            lineHeight: 1.57,
            textAlign: 'center',
            fontFamily: 'Inter, sans-serif',
            mb: 1.25
          }}
        >
          Choose provider type
        </Typography>

        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1.25,
            justifyContent: 'center',
            px: 12.5,
            py: 1.25,
            mb: 1
          }}
        >
          {PROVIDER_TYPES.map((type) => {
            const isSelected = selectedProviderType === type;
            return (
              <Chip
                key={type}
                label={type}
                onClick={() => handleProviderTypeClick(type)}
                icon={
                  isSelected ? (
                    <Icon icon="mdi:check" width={12} height={12} style={{ color: 'white' }} />
                  ) : undefined
                }
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  fontSize: '10px',
                  fontWeight: 700,
                  height: 'auto',
                  py: 0.25,
                  px: 1.25,
                  borderRadius: '5px',
                  fontFamily: 'Inter, sans-serif',
                  cursor: 'pointer',
                  opacity: isSelected ? 1 : 0.5,
                  transition: 'opacity 0.2s',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    opacity: 1
                  },
                  '& .MuiChip-label': {
                    px: isSelected ? 0 : 1.25,
                    py: 0
                  },
                  '& .MuiChip-icon': {
                    color: 'white',
                    ml: 0.5,
                    mr: 0
                  }
                }}
              />
            );
          })}
        </Box>

        <Box sx={{ py: 2.5 }}>
          <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
        </Box>

        <Typography
          sx={{
            fontSize: '18px',
            fontWeight: 700,
            color: 'white',
            textTransform: 'uppercase',
            lineHeight: 1.57,
            textAlign: 'center',
            fontFamily: 'Inter, sans-serif'
          }}
        >
          Define the category of interest
        </Typography>

        <Typography
          sx={{
            fontSize: '14px',
            fontWeight: 300,
            color: 'white',
            lineHeight: 'normal',
            textAlign: 'center',
            fontFamily: 'Poppins, sans-serif',
            mt: 0.5
          }}
        >
          {selectedProviderType ? `Select categories for ${selectedProviderType}` : 'Please select a provider type first'}
        </Typography>

        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1.25,
            justifyContent: 'center',
            px: 3,
            py: 1.25,
            mt: 1
          }}
        >
          {selectedProviderType ? (
            (PROVIDER_CATEGORIES[selectedProviderType] || []).map((category) => {
              const isSelected = selectedCategories.includes(category);
              return (
                <Chip
                  key={category}
                  label={category}
                  onClick={() => handleCategoryClick(category)}
                  icon={
                    <Icon
                      icon={isSelected ? "mdi:checkbox-marked" : "mdi:checkbox-blank-outline"}
                      width={14}
                      height={14}
                      style={{ color: 'white' }}
                    />
                  }
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    fontSize: '10px',
                    fontWeight: 500,
                    height: 'auto',
                    py: 0.625,
                    px: 2.5,
                    borderRadius: '5px',
                    fontFamily: 'Inter, sans-serif',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.3)'
                    },
                    '& .MuiChip-label': {
                      px: 0,
                      py: 0
                    },
                    '& .MuiChip-icon': {
                      color: 'white',
                      ml: 0,
                      mr: 1.25
                    }
                  }}
                />
              );
            })
          ) : (
            <Typography
              sx={{
                fontSize: '14px',
                fontWeight: 300,
                color: 'rgba(255, 255, 255, 0.5)',
                lineHeight: 'normal',
                fontFamily: 'Poppins, sans-serif',
                fontStyle: 'italic'
              }}
            >
              Categories will appear after selecting a provider type
            </Typography>
          )}
        </Box>

        <Box sx={{ py: 2.5 }}>
          <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
        </Box>

        <Box sx={{ textAlign: 'center', mb: 1.25 }}>
          <Typography
            sx={{
              fontSize: '18px',
              fontWeight: 700,
              color: 'white',
              textTransform: 'uppercase',
              lineHeight: 1.57,
              fontFamily: 'Inter, sans-serif'
            }}
          >
            Write your description
          </Typography>
          <Typography
            sx={{
              fontSize: '14px',
              fontWeight: 300,
              color: 'white',
              lineHeight: 'normal',
              fontFamily: 'Poppins, sans-serif',
              mt: 0.5
            }}
          >
            Please clearly describe your requiremnts
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <QuillEditor
            value={description}
            onChange={setDescription}
            placeholder="Type your description here..."
            sx={{
              height: '146px',
              borderColor: '#6e6e6e',
              borderRadius: '8px',
              '& .ql-toolbar': {
                borderColor: '#6e6e6e',
                backgroundColor: 'transparent'
              },
              '& .ql-container': {
                borderColor: '#6e6e6e',
                backgroundColor: 'transparent',
                color: 'white'
              },
              '& .ql-editor': {
                color: 'white',
                minHeight: '100px'
              },
              '& .ql-editor.ql-blank::before': {
                color: 'rgba(255, 255, 255, 0.5)'
              }
            }}
          />
        </Box>

        <Stack spacing={1.25} alignItems="center">
          <Stack 
            direction="row" 
            spacing={0.625} 
            alignItems="center"
            onClick={() => setConsentChecked(!consentChecked)}
            sx={{ cursor: 'pointer' }}
          >
            <Icon 
              icon={consentChecked ? "mdi:checkbox-marked" : "mdi:checkbox-blank-outline"} 
              width={18} 
              height={18} 
              style={{ color: 'white' }} 
            />
            <Typography
              sx={{
                fontSize: '14px',
                fontWeight: 300,
                color: 'white',
                lineHeight: 'normal',
                fontFamily: 'Poppins, sans-serif'
              }}
            >
              We will submit your request to all related providers
            </Typography>
          </Stack>

          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!consentChecked}
            sx={{
              bgcolor: 'white',
              color: 'black',
              fontSize: '14px',
              fontWeight: 500,
              fontFamily: 'Inter, sans-serif',
              textTransform: 'none',
              px: 2,
              py: 0.75,
              borderRadius: '8px',
              boxShadow: '0px 1px 2px 0px rgba(0,0,0,0.08)',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.9)'
              },
              '&.Mui-disabled': {
                bgcolor: 'rgba(255, 255, 255, 0.3)',
                color: 'rgba(0, 0, 0, 0.5)'
              }
            }}
          >
            Submit request
          </Button>
        </Stack>
      </Box>
    </Dialog>
  );
};

