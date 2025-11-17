import Box from '@mui/material/Box';
import SvgIcon from '@mui/material/SvgIcon';
import { useSelector } from 'react-redux';

import { useSettings } from "src/hooks/use-settings";
import { Logo } from './logos/logo';
import { getAPIUrl } from '../config';

export const SplashScreen = () => {
  const avatar = useSelector(state => state.companies.avatar);
  const settings = useSettings();

  return (
    <Box
      sx={{
        alignItems: 'center',
        backgroundColor: 'background.paper',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        justifyContent: 'center',
        left: 0,
        p: 3,
        position: 'fixed',
        top: 0,
        width: '100vw',
        zIndex: 1400,
      }}
    >
      {avatar ?
        <img
          src={avatar ? avatar?.includes('http') ? avatar : `${getAPIUrl()}/${avatar}` : ""}
          alt="Company logo"
          loading="lazy"
          style={{ height: 48, width: 48, objectFit: "fill", backgroundColor: "9BA4B5" }} />
        :
        <SvgIcon sx={{ height: 48, width: 48 }}>
          <Logo color={settings?.colorPreset} />
        </SvgIcon>}
    </Box>
  );
};
