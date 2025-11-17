import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { keyframes } from '@mui/system';
import LoadingButton from '@mui/lab/LoadingButton';

const shimmerAnimation = keyframes`
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
`;

export const EffectButton = ({ loading, disabled, onClick, isShow }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Box 
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: !isShow ? 0 : 1,
        transition: 'opacity 0.3s ease'
      }}
    >
      <Box sx={{ position: 'relative' }}>
        {/* Gradient border container */}
        <Box
          sx={{
            position: 'absolute',
            inset: -0.5,
            borderRadius: 5,
            opacity: 1,
            filter: 'blur(2px)',
            background: 'linear-gradient(90deg, #4F14DA, #4073fd)',
            transition: 'all 300ms ease-in-out'
          }}
        />
        
        <LoadingButton
          loading={loading}
          disabled={disabled}
          onClick={onClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          variant="contained"
          sx={{
            position: 'relative',
            color: 'white',
            width: 75,
            px: 2,
            py: 1,
            height: 38,
            fontWeight: 500,
            borderRadius: 5,
            border: 0,
            transition: 'all 300ms ease-in-out',
            overflow: 'hidden',
          }}
        >
          {!loading && 
          <Typography variant="subtitle2" sx={{ position: 'relative', zIndex: 10, whiteSpace: 'nowrap', color: 'white' }}>
            Ask AI
          </Typography>}
          
          {/* Inner glow effect */}
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              borderRadius: 5,
              opacity: 0.3,
              transition: 'opacity 300ms ease-in-out',
              background: 'radial-gradient(circle, rgba(64,115,253,0.8) 0%, rgba(64,115,253,0) 70%)'
            }}
          />
          
          {/* Outer glow animation */}
          <Box
            sx={{
              position: 'absolute',
              inset: -2,
              borderRadius: 5,
              opacity: 0.5,
              filter: 'blur(8px)',
              transition: 'opacity 300ms ease-in-out',
              background: 'radial-gradient(circle, rgba(64,115,253,0.8) 0%, rgba(64,115,253,0) 70%)'
            }}
          />
          
          {/* Shimmer effect only on hover */}
          {isHovered && (
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                backgroundSize: '200% 100%',
                animation: `${shimmerAnimation} 2s linear infinite`
              }}
            />
          )}
        </LoadingButton>
      </Box>
    </Box>
  );
}