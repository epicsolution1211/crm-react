import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { getAssetPath } from 'src/utils/asset-path';

import { usePopover } from 'src/hooks/use-popover';

import { LanguagePopover } from './language-popover';

const languageOptions = {
  en: {
    icon: getAssetPath('/assets/flags/flag-uk.png'),
    label: 'English',
    code: 'UK',
  },
  de: {
    icon: getAssetPath('/assets/flags/flag-de.png'),
    label: 'German',
    code: 'DE',
  },
  es: {
    icon: getAssetPath('/assets/flags/flag-es.png'),
    label: 'Spanish',
    code: 'ES'
  },
  it: {
    icon: getAssetPath('/assets/flags/flag-it.png'),
    label: 'Italian',
    code: 'IT'
  },
  ru: {
    icon: getAssetPath('/assets/flags/flag-ru.png'),
    label: 'Russian',
    code: 'RU'
  },
  nl: {
    icon: getAssetPath('/assets/flags/flag-nl.png'),
    label: 'Dutch',
    code: 'NL'
  },
};


export const LanguageSwitch = () => {
  const { i18n } = useTranslation();
  const popover = usePopover();

  const flag = languageOptions[i18n.language]?.icon;

  return (
    <>
      <Tooltip title="Language">
        <IconButton
          onClick={popover.handleOpen}
          ref={popover.anchorRef}
        >
          <Box
            sx={{
              width: 26,
              '& img': {
                width: '100%'
              },
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center'
            }}
          >
            <img src={flag} />
          </Box>
        </IconButton>
      </Tooltip>
      <LanguagePopover
        anchorEl={popover.anchorRef.current}
        onClose={popover.handleClose}
        open={popover.open}
      />
    </>
  );
};
