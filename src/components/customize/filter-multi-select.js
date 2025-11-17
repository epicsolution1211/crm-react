import { useCallback, useEffect, useRef, useState } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import { Iconify } from "src/components/iconify";
import { Scrollbar } from "../scrollbar";
import { useDebounce } from "src/hooks/use-debounce";
import { usePopover } from "src/hooks/use-popover";

export const RenderItem = ({
  option,
  handleValueChange,
  value,
  isExclude,
  nonValue,
  handleNonValueChange,
}) => {
  return (
    <MenuItem key={option?.label} sx={{ px: 4 }}>
      <Stack
        direction="row"
        width={1}
        alignItems="center"
        justifyContent="space-between"
        gap={1}
      >
        <FormControlLabel
          control={<Checkbox
            checked={value?.some((item) => item == option.value)}
            onChange={handleValueChange}
            value={option.value}
            sx={{ p: 0, mr: 1 }} />}
          label={<Stack direction='row' alignItems='center' gap={1}>
            {option?.color ? <Box sx={{ backgroundColor: option?.color, maxWidth: 1, height: 1, padding: 1, borderRadius: 20 }}></Box> : null}
            <Typography sx={{ whiteSpace: "nowrap", flexGrow: 1 }}>
              {option.label}
            </Typography>
          </Stack>}
          sx={{
            flexGrow: 1,
            mr: 0,
            fontSize: 14,
          }} />
        {isExclude && (
          <Tooltip title="Exclude">
            <IconButton
              onClick={() => handleNonValueChange(option.value)}
              sx={{ p: 0 }}
            >
              <Iconify icon="lets-icons:remove" width={20} sx={{ color: nonValue?.includes(option?.value) ? "error.main" : "action.disabled" }} />
            </IconButton>
          </Tooltip>
        )}
      </Stack>
    </MenuItem>
  );
};

export const RenderInput = ({ placeholder, setSearch }) => {
  const [inputValue, setInputValue] = useState("");
  const query = useDebounce(inputValue, 200);
  const handleSearch = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setInputValue(event.target.value);
  };

  useEffect(() => {
    setSearch(query);
  }, [query])

  return (
    <Stack sx={{ px: 2, py: 1 }}>
      <TextField
        type="search"
        placeholder={placeholder ?? ""}
        value={inputValue}
        onChange={handleSearch}
        hiddenLabel
        size="small"
        onKeyDown={(e) => e.stopPropagation()}
      />
    </Stack>
  )
}

function dedupeOptions(options) {
  const seen = new Set();
  return options.filter(opt => {
    if (seen.has(opt.value)) return false;
    seen.add(opt.value);
    return true;
  });
}

export const FilterMultiSelect = ({
  label,
  options,
  placeholder,
  value = [],
  onChange,
  withSearch,
  isExclude,
  isLabel,
  handleModalOpen,
  valueNon = [],
  onChangeNon,
  onGetOptions,
}) => {
  const [values, setValues] = useState(options ?? []);
  const prevOptions = useRef();

  const [search, setSearch] = useState("");
  const query = useDebounce(search, 100);

  const popover = usePopover();

  useEffect(() => {
    if (onGetOptions) {
      onGetOptions(query);
    }
  }, [query]);

  useEffect(() => {
    if (JSON.stringify(prevOptions.current) !== JSON.stringify(options)) {
      setValues(dedupeOptions(options));
      prevOptions.current = options;
    }
  }, [options]);

  useEffect(() => {
    if (onGetOptions) return;
    const filteredValues = options.filter((val) =>
      val?.label?.toLowerCase()?.includes(search?.toLowerCase())
    );
    setValues(dedupeOptions(filteredValues));
  }, [search, options]);

  const handleValueChange = useCallback(
    (event) => {
      let newValue = [...value];
      if (event.target.checked) {
        if (event.target.value == '_empty') {
          newValue = ['_empty']
        } else {
          newValue = newValue.filter(item => item != '_empty')
          newValue.push(event.target.value);
        }
      } else {
        newValue = newValue.filter((item) => item != event.target.value);
      }

      if (valueNon?.includes(event.target.value)) {
        valueNon = valueNon?.filter(item => item != event.target.value);
        onChangeNon?.(valueNon);
      }
      onChange?.(newValue, valueNon);
    },
    [onChange, onChangeNon, value, valueNon]
  );

  const handleNonValueChange = (val) => {
    let newValue = [...valueNon];
    if (!newValue.includes(val)) {
      newValue.push(val);
    } else {
      newValue = newValue.filter((item) => item !== val);
    }

    if (value?.includes(val)) {
      value = value?.filter(item => item !== val);
      onChange?.(value)
    }
    onChangeNon?.(newValue);
  };

  return (
    <>
      <Button
        color="inherit"
        endIcon={<Iconify icon="icon-park-outline:down" width={20} />}
        sx={{ p: 0 }}
        onClick={popover.handleOpen}
        ref={popover.anchorRef}
      >
        <Typography fontSize={14} fontWeight="600" sx={{ whiteSpace: 'nowrap' }}>
          {label}
        </Typography>
      </Button>
      <Menu
        anchorEl={popover.anchorRef.current}
        onClose={popover.handleClose}
        open={popover.open}
        PaperProps={{ style: { px: 2 } }}
      >
        {withSearch && (
          <RenderInput placeholder={placeholder} setSearch={setSearch} />
        )}
        <Scrollbar style={{ maxHeight: 180, minWidth: 150 }}>
          {dedupeOptions(values).map((option) => (
            <RenderItem
              option={option}
              key={option.label + option.value}
              handleValueChange={handleValueChange}
              value={value}
              handleNonValueChange={handleNonValueChange}
              nonValue={valueNon}
              isExclude={isExclude}
            />
          ))}
        </Scrollbar>
        {isLabel && (
          <Stack px={2} pt={1}>
            <Button variant="outlined" size="small" onClick={() => handleModalOpen()}>Edit Labels</Button>
          </Stack>
        )}
      </Menu>
    </>
  );
};
