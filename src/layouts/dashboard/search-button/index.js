import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import { useDialog } from 'src/hooks/use-dialog';

import { SearchDialog } from './search-dialog';
import { Iconify } from 'src/components/iconify';

export const SearchButton = () => {
  const dialog = useDialog();

  return (
    <>
      <Tooltip title="Search">
        <IconButton onClick={dialog.handleOpen}>
          <Iconify icon="lucide:search" color="text.secondary" width={24} />
        </IconButton>
      </Tooltip>
      <SearchDialog
        onClose={dialog.handleClose}
        open={dialog.open}
      />
    </>
  );
};
