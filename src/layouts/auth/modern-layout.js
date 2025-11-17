import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { getAssetPath } from 'src/utils/asset-path';

import { LogoAccenture } from 'src/components/logos/logo-accenture';
import { LogoAtt } from 'src/components/logos/logo-att';
import { LogoAws } from 'src/components/logos/logo-aws';
import { LogoBolt } from 'src/components/logos/logo-bolt';
import { LogoSamsung } from 'src/components/logos/logo-samsung';
import { LogoVisma } from 'src/components/logos/logo-visma';

export const Layout = (props) => {
  const { children } = props;
  return (
    <Box
      sx={{
        backgroundColor: 'background.default',
        display: 'flex',
        flex: '1 1 auto',
        flexDirection: {
          xs: 'column-reverse',
          md: 'row'
        }
      }}
    >
      <Box
        sx={{
          alignItems: 'center',
          backgroundColor: 'neutral.800',
          backgroundImage: 'url("' + getAssetPath('/assets/others/gradient-bg.svg') + '")',
          backgroundPosition: 'top center',
          backgroundRepeat: 'no-repeat',
          color: 'common.white',
          display: 'flex',
          flex: {
            xs: '0 0 auto',
            md: '1 1 auto'
          },
          justifyContent: 'center',
          p: {
            xs: 4,
            md: 8
          }
        }}
      >
        <Box maxWidth="md">
          <Typography
            sx={{ mb: 1 }}
            variant="h4"
          >
            Welcome to CRM
          </Typography>
          <Typography
            color="text.secondary"
            sx={{ mb: 4 }}
          >
            Unlock the full potential of your business with our cutting-edge solutions. Leverage the power of data and streamlined workflows to drive success and efficiency.
          </Typography>
          <Typography
            variant="subtitle2"
            sx={{ mb: 2 }}
          >
            Join 6,000+ forward-thinking companies:
          </Typography>
          <Stack
            alignItems="center"
            direction="row"
            flexWrap="wrap"
            gap={4}
            sx={{
              color: 'text.primary',
              '& > *': {
                color: 'neutral.400',
                flex: '0 0 auto'
              }
            }}
          >
            <LogoSamsung />
            <LogoVisma />
            <LogoBolt />
            <LogoAws />
            <LogoAccenture />
            <LogoAtt />
          </Stack>
        </Box>
      </Box>
      <Box
        sx={{
          backgroundColor: 'background.paper',
          display: 'flex',
          flex: {
            xs: '1 1 auto',
            md: '0 0 auto'
          },
          flexDirection: 'column',
          justifyContent: {
            md: 'center'
          },
          maxWidth: '100%',
          p: {
            xs: 4,
            md: 8
          },
          width: {
            md: 600
          }
        }}
      >
        <div>
          <Box sx={{ mb: 4 }}>
          </Box>
          {children}
        </div>
      </Box>
    </Box>
  );
};

Layout.propTypes = {
  children: PropTypes.node
};
