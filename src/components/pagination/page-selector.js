import { useState, useEffect } from "react";

import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/system/colorManipulator";

import { usePopover } from "src/hooks/use-popover";
import { Iconify } from "src/components/iconify";

export const PageNumberSelect = ({ currentPage, totalPage, onUpdate }) => {
  const popover = usePopover();
  const [pageNumber, setPageNumber] = useState(currentPage + 1);
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    setPageNumber(currentPage + 1);
  }, [currentPage, popover.open]);

  const handlePageNumberChange = (event) => {
    const value = parseInt(event.target.value);
    setPageNumber(value);
    setIsValid(value >= 1 && value <= totalPage);
  };

  const handleUpdate = () => {
    if (isValid) {
      onUpdate(pageNumber - 1);
      popover.handleClose();
    }
  };

  return (
    <>
      <Stack sx={{ px: { md: 0, xs: 2 }, pt: { md: 0, xs: 1 }, display: { xs: 'none', md: 'flex' }, justifyContent: "start", alignItems: 'center' }}>
        <Stack sx={{ flexDirection: 'row', gap: 2, alignItems: 'center' }}>
          <Typography
            sx={{ fontSize: 14, display: 'flex', justifyContent: 'flex-end', whiteSpace: 'nowrap' }}
          >
            Page:
          </Typography>
          <Stack
            onClick={popover.handleOpen}
            ref={popover.anchorRef}
            sx={{ flexDirection: 'row', alignItems: 'center', gap: 0.5, cursor: 'pointer' }}
          >
            <Typography
              sx={{ fontSize: 14, display: 'flex', justifyContent: 'flex-end' }}
            >
              {currentPage >= 0 ? (currentPage + 1) : 0}
            </Typography>
            <Iconify icon="fe:drop-down" sx={{ color: 'text.disabled'}} width={16} />
          </Stack>
        </Stack>
      </Stack>
      <Menu
        anchorEl={popover.anchorRef.current}
        onClose={popover.handleClose}
        open={popover.open}
        PaperProps={{ 
          sx: { 
            px: { sm: 1, xs: 0 }, 
            mt: { sm: -0.5, xs: -5 },
            ml: { sm: 3.5, xs: '12px' },
            boxShadow: 8
          } 
        }}
      >
        <Stack sx={{ px: 0, py: 0, gap: { sm: 1, xs: 0.5 } }} direction="row" alignItems='center'>
          <IconButton
            sx={{ '&:hover': { color: 'primary.main', bgcolor: 'action.hover' }, color:'primary.main'}}
            onClick={() => setPageNumber(1)}
            disabled={pageNumber === 1}
            size="small" 
          >
            <Iconify icon="icon-park-outline:go-start" width={24} />
          </IconButton>
          <TextField
            size="small"
            type="number"
            hiddenLabel
            value={pageNumber}
            onChange={handlePageNumberChange}
            sx={{ width: { sm: 75, xs: 50 } }}
          />
          <IconButton
            sx={{ '&:hover': { color: 'primary.main', bgcolor: 'action.hover' }, color:'primary.main'}}
            onClick={() => setPageNumber(totalPage)}
            disabled={pageNumber === totalPage}  
            size="small"
          >
            <Iconify icon="icon-park-outline:go-end" width={24} />
          </IconButton>
          <IconButton
            disabled={!isValid}
            sx={{ 
              color: isValid ? 'primary.main' : 'text.disabled',
              '&:hover': { 
                backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.5), 
                color: 'white' 
              }
            }}
            onClick={handleUpdate}
            size="small"
          >
            <Iconify icon="material-symbols:check" width={24} />
          </IconButton>
        </Stack>
      </Menu>
    </>
  );
};
