import { useState, useRef, useEffect } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Popover from '@mui/material/Popover';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Icon } from '@iconify/react';

const featureOptions = [
  { value: 'inbound', label: 'Inbound Calls' },
  { value: 'outbound', label: 'Outbound Calls' },
  { value: 'recording', label: 'Call Recording' },
  { value: 'ivr', label: 'IVR' },
  { value: 'sms', label: 'SMS' },
  { value: 'agent_mapping', label: 'Agent Mapping' },
  { value: 'analytics', label: 'Call Analytics' },
  { value: 'voicemail', label: 'Voicemail' },
  { value: 'advanced_routing', label: 'Advanced Routing' },
  { value: 'hangup', label: 'Hangup' }
];

const regionOptions = [
  { value: 'North America', label: 'North America' },
  { value: 'Europe', label: 'Europe' },
  { value: 'Asia Pacific', label: 'Asia Pacific' },
  { value: 'Latin America', label: 'Latin America' },
  { value: 'Middle East', label: 'Middle East' },
  { value: 'Africa', label: 'Africa' }
];

const reviewOptions = [
  { value: 5, label: '5 Stars' },
  { value: 4.5, label: '4.5+ Stars' },
  { value: 4, label: '4+ Stars' },
  { value: 3.5, label: '3.5+ Stars' },
  { value: 3, label: '3+ Stars' }
];

export const CallSystemFilters = ({ onFiltersChange }) => {
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [selectedReviews, setSelectedReviews] = useState([]);
  
  const [featureAnchor, setFeatureAnchor] = useState(null);
  const [regionAnchor, setRegionAnchor] = useState(null);
  const [reviewAnchor, setReviewAnchor] = useState(null);

  const featureRef = useRef(null);
  const regionRef = useRef(null);
  const reviewRef = useRef(null);

  useEffect(() => {
    onFiltersChange({
      features: selectedFeatures,
      regions: selectedRegions,
      reviews: selectedReviews
    });
  }, [selectedFeatures, selectedRegions, selectedReviews, onFiltersChange]);

  const handleFeatureClick = () => {
    setFeatureAnchor(featureRef.current);
  };

  const handleRegionClick = () => {
    setRegionAnchor(regionRef.current);
  };

  const handleReviewClick = () => {
    setReviewAnchor(reviewRef.current);
  };

  const handleCloseFeature = () => {
    setFeatureAnchor(null);
  };

  const handleCloseRegion = () => {
    setRegionAnchor(null);
  };

  const handleCloseReview = () => {
    setReviewAnchor(null);
  };

  const handleFeatureToggle = (value) => {
    setSelectedFeatures(prev =>
      prev.includes(value)
        ? prev.filter(v => v !== value)
        : [...prev, value]
    );
  };

  const handleRegionToggle = (value) => {
    setSelectedRegions(prev =>
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

  const handleRemoveFeature = (value) => {
    setSelectedFeatures(prev => prev.filter(v => v !== value));
  };

  const handleRemoveRegion = (value) => {
    setSelectedRegions(prev => prev.filter(v => v !== value));
  };

  const handleClearAll = () => {
    setSelectedFeatures([]);
    setSelectedRegions([]);
    setSelectedReviews([]);
  };

  const hasActiveFilters = selectedFeatures.length > 0 || selectedRegions.length > 0 || selectedReviews.length > 0;

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
            ref={featureRef}
            onClick={handleFeatureClick}
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
              {selectedFeatures.length > 0 ? (
                selectedFeatures.slice(0, 2).map((feature) => (
                  <Chip
                    key={feature}
                    label={featureOptions.find(opt => opt.value === feature)?.label || feature}
                    onDelete={(e) => {
                      e.stopPropagation();
                      handleRemoveFeature(feature);
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
                  Filter by features
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
            ref={regionRef}
            onClick={handleRegionClick}
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
              {selectedRegions.length > 0 ? (
                selectedRegions.slice(0, 2).map((region) => (
                  <Chip
                    key={region}
                    label={regionOptions.find(opt => opt.value === region)?.label || region}
                    onDelete={(e) => {
                      e.stopPropagation();
                      handleRemoveRegion(region);
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
                  Filter by region
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
        open={Boolean(featureAnchor)}
        anchorEl={featureAnchor}
        onClose={handleCloseFeature}
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
          {featureOptions.map((option) => (
            <FormControlLabel
              key={option.value}
              control={
                <Checkbox
                  checked={selectedFeatures.includes(option.value)}
                  onChange={() => handleFeatureToggle(option.value)}
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
        open={Boolean(regionAnchor)}
        anchorEl={regionAnchor}
        onClose={handleCloseRegion}
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
          {regionOptions.map((option) => (
            <FormControlLabel
              key={option.value}
              control={
                <Checkbox
                  checked={selectedRegions.includes(option.value)}
                  onChange={() => handleRegionToggle(option.value)}
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

