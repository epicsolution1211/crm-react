import { useCallback, useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";

import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";

import { Iconify } from "src/components/iconify";
import { usePopover } from "src/hooks/use-popover";
import { Scrollbar } from "src/components/scrollbar";

export const FormLabelAssignPopover = ({
  value = [],
  onChange,
  options = [],
  onEditClick = () => {},
  onAssignClick = () => {},
  onRemoveClick = () => {},
  loadingStatus = { assign: false, remove: false },
}) => {
  const [values, setValues] = useState(options??[]);
  const [search, setSearch] = useState("");

  const prevOptions = useRef();
  const prevSearch = useRef();

  const popover = usePopover();

  useEffect(() => {
    if (JSON.stringify(prevOptions.current) !== JSON.stringify(options)) {
      setValues(options);
      prevOptions.current = options;
    }
  }, [options]);

  useEffect(() => {
    if (prevSearch.current !== search) {
      const filteredValues = options?.filter((val) =>
        val?.label?.toLowerCase()?.includes(search?.toLowerCase())
      );
      setValues(filteredValues);
      prevSearch.current = search;
    }
  }, [search, options]);

  const handleSearch = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    setSearch(event.target.value);
  }, []);

  const handleValueChange = useCallback(
    (event) => {
      let newValue = [...value];

      if (event.target.checked) {
        newValue.push(event.target.value);
      } else {
        newValue = newValue.filter((item) => item !== event.target.value);
      }

      onChange?.(newValue);
    },
    [onChange, value]
  );

  return (
    <>
      <Tooltip title="Assign label">
        <IconButton
          onClick={popover.handleOpen}
          ref={popover.anchorRef}
          sx={{ color: 'text.primary', '&:hover': { bgcolor: 'action.hover' } }}
        >
          <Iconify icon="mynaui:label" width={24}/>
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={popover.anchorRef.current}
        onClose={popover.handleClose}
        open={popover.open}
        PaperProps={{ style: { width: 280 } }}
      >
        <Stack
          sx={{
            flexDirection: 'row',
            alignItems: 'center',
            px: 2,
            py: 1,
            gap: 0.5,
          }} 
        >
          <TextField
            type="search"
            size="small"
            hiddenLabel
            placeholder="Search labels..."
            onChange={handleSearch}
            value={search}
            onKeyDown={(e) => e.stopPropagation()}
          />
          <Tooltip title="Edit labels">
            <IconButton onClick={onEditClick} color="info" sx={{ '&:hover': { bgcolor: 'action.hover' }}}>
              <Iconify icon="line-md:folder-plus-twotone" width={28} />
            </IconButton>
          </Tooltip>
        </Stack>

        <Scrollbar sx={{ maxHeight: 310 }}>
          {values?.map((option) => (
            <MenuItem key={option.label} sx={{ px: 2 }} selected={value?.includes(option?.value)}>
              <FormControlLabel
                control={
                  <Checkbox
                    sx={{ p: 0.5 }}
                    checked={value?.includes(option.value)}
                    onChange={handleValueChange}
                    value={option.value}
                  />
                }
                label={
                  <Stack direction='row' alignItems='center' gap={1} pl={0.5}>
                    {option?.color && 
                      <Box sx={{ backgroundColor: option?.color, maxWidth: 1, height: 1, padding: 1, borderRadius: 20 }}></Box>}
                    <Typography sx={{ whiteSpace: "nowrap", flexGrow: 1 }}>
                      {option.label}
                    </Typography>
                  </Stack>
                }
                sx={{
                  flexGrow: 1,
                  mr: 0,
                  fontSize: 14,
                }}
              />
            </MenuItem>
          ))}
        </Scrollbar>
        <Stack sx={{ mx: 2, pt: 1, gap: 1, flexDirection: 'row', alignItems: 'center', borderTop: '1px solid', borderColor: 'divider' }}>
          <LoadingButton
            loading={loadingStatus?.assign}
            disabled={loadingStatus?.assign}
            variant="outlined" 
            size="small" 
            fullWidth 
            color="success" 
            sx={{ color : 'success.main' }}
            onClick={()=> {
              if (value?.length == 0) {
                onAssignClick(options?.map(option => option?.value));
              } else {
                onAssignClick(value);
              }
            }}
          >
            {value?.length == 0 ? "Assign All" : `Assign (${value?.length})`}
          </LoadingButton>
          <LoadingButton
            loading={loadingStatus?.remove}
            disabled={loadingStatus?.remove}
            variant="outlined" 
            size="small" 
            fullWidth 
            color="error" 
            sx={{ color : 'error.main' }} 
            onClick={()=> {
              if (value?.length == 0) {
                onRemoveClick(options?.map(option => option?.value));
              } else {
                onRemoveClick(value);
              }
            }}
          >
            {value?.length == 0 ? "Remove All" : `Remove (${value?.length})`}
          </LoadingButton>
        </Stack>
      </Menu>
    </>
  );
};
