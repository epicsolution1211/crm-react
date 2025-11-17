import { useCallback, useEffect, useRef, useState } from "react";

import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { Iconify } from "src/components/iconify";
import { usePopover } from "src/hooks/use-popover";

export const MultiSelect = ({
  label,
  onChange,
  options,
  value = [],
  noPadding,
  withSearch,
  withIcon,
  labelIcon,
  withEdit,
  editLabel,
  onEditClick,
  width,
  ...other
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
      {withIcon ? (
        <IconButton
          onClick={popover.handleOpen}
          ref={popover.anchorRef}
          {...other}
        >
          {labelIcon}
        </IconButton>
      ) : (
        <Button
          color="inherit"
          endIcon={
            !withIcon && (
              <Iconify icon="icon-park-outline:down" width={20} />
            )
          }
          sx={noPadding && { p: 0 }}
          onClick={popover.handleOpen}
          ref={popover.anchorRef}
          {...other}
        >
          <Typography fontSize={14} fontWeight="600" whiteSpace='nowrap'>
            {label}
          </Typography>
        </Button>
      )}
      <Menu
        anchorEl={popover.anchorRef.current}
        onClose={popover.handleClose}
        open={popover.open}
        PaperProps={{ style: { width: width ?? 250 } }}
      >
        {withSearch && (
          <Stack sx={{ px: 2, py: 1 }}>
            <TextField
              type="search"
              label="Search something..."
              onChange={handleSearch}
              value={search}
              onKeyDown={(e) => e.stopPropagation()}
            />
          </Stack>
        )}
        {values.map((option) => (
          <MenuItem key={option.label} sx={{ px: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  sx={{ p: 0.5 }}
                  checked={value.includes(option.value)}
                  onChange={handleValueChange}
                  value={option.value}
                />
              }
              label={option.label}
              sx={{
                flexGrow: 1,
                mr: 0,
                fontSize: 14,
              }}
            />
          </MenuItem>
        ))}

        {withEdit && (
          <Button variant="text" fullWidth onClick={onEditClick}>
            {editLabel}
          </Button>
        )}
      </Menu>
    </>
  );
};
